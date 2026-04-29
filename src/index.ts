import { Hono } from 'hono'
import { renderMarkdown, parseMeta } from './markdown'
import { renderHome, renderBriefing, renderArchive, renderNotFound, renderAbout } from './render'
import { generateRSS } from './rss'

type Bindings = {
  BRIEFINGS_ASSETS: Fetcher
}

const app = new Hono<{ Bindings: Bindings }>()

async function fetchBriefing(env: Bindings, date: string): Promise<string | null> {
  try {
    const resp = await env.BRIEFINGS_ASSETS.fetch(`https://fake/${date}.md`)
    if (!resp.ok) return null
    return await resp.text()
  } catch {
    return null
  }
}

/** Search for briefing files by iterating forward then backward from today */
async function listAllBriefings(env: Bindings): Promise<string[]> {
  const dates: string[] = []
  const today = new Date()
  // Search tomorrow -> today -> yesterday -> ... (covers briefing generated for "next day")
  for (let offset = 1; offset >= -365; offset--) {
    const d = new Date(today)
    d.setDate(d.getDate() + offset)
    const dateStr = d.toISOString().slice(0, 10)
    const md = await fetchBriefing(env, dateStr)
    if (md) dates.push(dateStr)
  }
  return dates
}

/** Find the latest briefing by date */
async function findLatest(env: Bindings): Promise<{ date: string; content: string } | null> {
  const today = new Date()
  for (let offset = 1; offset >= -365; offset--) {
    const d = new Date(today)
    d.setDate(d.getDate() + offset)
    const dateStr = d.toISOString().slice(0, 10)
    const md = await fetchBriefing(env, dateStr)
    if (md) return { date: dateStr, content: md }
  }
  return null
}

/* ============ 首页 ============ */
app.get('/', async (c) => {
  const latest = await findLatest(c.env)
  const allDates = await listAllBriefings(c.env)

  return c.html(renderHome(
    latest ? { date: latest.date, html: renderMarkdown(latest.content) } : null,
    allDates
  ))
})

/* ============ 单期简报 ============ */
app.get('/:date{[0-9]{4}-[0-9]{2}-[0-9]{2}}', async (c) => {
  const date = c.req.param('date')
  const md = await fetchBriefing(c.env, date)

  if (!md) return c.notFound()

  const meta = parseMeta(date, md)
  const html = renderMarkdown(md)
  return c.html(renderBriefing(date, html, meta))
})

/* ============ 归档页 ============ */
app.get('/archive', async (c) => {
  const dates = await listAllBriefings(c.env)

  if (dates.length === 0) {
    return c.html(renderArchive([], {}))
  }

  return c.html(renderArchive(dates, {}))
})

/* ============ RSS Feed ============ */
app.get('/rss.xml', async (c) => {
  const xml = await generateRSS(c.env, fetchBriefing)
  return c.newResponse(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
  })
})

/* ============ 关于页 ============ */
app.get('/about', async (c) => {
  return c.html(renderAbout())
})

/* ============ 404 ============ */
app.notFound(async (c) => {
  const path = c.req.path
  if (path === '/favicon.ico') return c.newResponse(null, 204)
  if (path === '/robots.txt') {
    return c.text('User-agent: *\nAllow: /\nSitemap: https://news.renezhou.com/rss.xml\n')
  }
  return c.html(renderNotFound())
})

export default app
