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

async function listAllBriefings(env: Bindings): Promise<string[]> {
  const dates: string[] = []
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const md = await fetchBriefing(env, dateStr)
    if (md) dates.push(dateStr)
  }
  return dates
}

/* ============ 首页 ============ */
app.get('/', async (c) => {
  let latestMd: string | null = null
  let latestDate: string | null = null
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const md = await fetchBriefing(c.env, dateStr)
    if (md) {
      latestMd = md
      latestDate = dateStr
      break
    }
  }

  const allDates = await listAllBriefings(c.env)
  return c.html(renderHome(
    latestMd && latestDate ? { date: latestDate, html: renderMarkdown(latestMd) } : null,
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

  const metaMap: Record<string, any> = {}
  for (const d of dates) {
    const md = await fetchBriefing(c.env, d)
    if (md) metaMap[d] = parseMeta(d, md)
  }

  return c.html(renderArchive(dates, metaMap))
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
