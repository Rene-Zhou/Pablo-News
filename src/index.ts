import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Env, putBriefing, getBriefing, getBriefingMeta, getLatestDate, listDates } from './kv'
import { parseMeta, renderMarkdown } from './markdown'
import { renderHome, renderBriefing, renderArchive, renderNotFound, renderAbout } from './render'
import { generateRSS } from './rss'

type Bindings = Env & {
  API_KEY: string          // 用于 POST /api/sync 认证
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS（仅 API 端点）
app.use('/api/*', cors())

/* ===== 首页 ===== */
app.get('/', async (c) => {
  const env = c.env
  const latestDate = await getLatestDate(env)
  const dates = await listDates(env)

  let latestHtml: string | null = null
  if (latestDate) {
    const md = await getBriefing(env, latestDate)
    if (md) {
      latestHtml = renderMarkdown(md)
    }
  }

  return c.html(renderHome(
    latestDate && latestHtml ? { date: latestDate, html: latestHtml } : null,
    dates
  ))
})

/* ===== 单期简报 ===== */
app.get('/:date{[0-9]{4}-[0-9]{2}-[0-9]{2}}', async (c) => {
  const date = c.req.param('date')
  const env = c.env
  const md = await getBriefing(env, date)

  if (!md) {
    return c.notFound()
  }

  const meta = await getBriefingMeta(env, date)
  const html = renderMarkdown(md)
  return c.html(renderBriefing(date, html, meta))
})

/* ===== 归档页 ===== */
app.get('/archive', async (c) => {
  const env = c.env
  const dates = await listDates(env)

  if (dates.length === 0) {
    return c.html(renderArchive([], {}))
  }

  // 批量获取元数据
  const metaEntries = await Promise.all(
    dates.map(async (d) => ({ date: d, meta: await getBriefingMeta(env, d) }))
  )
  const metaMap: Record<string, any> = {}
  for (const { date, meta } of metaEntries) {
    if (meta) metaMap[date] = meta
  }

  return c.html(renderArchive(dates, metaMap))
})

/* ===== RSS Feed ===== */
app.get('/rss.xml', async (c) => {
  const env = c.env
  const xml = await generateRSS(env)
  return c.newResponse(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
  })
})

/* ===== 关于页 ===== */
app.get('/about', async (c) => {
  return c.html(renderAbout())
})

/* ===== API: 推送新简报 ===== */
app.post('/api/sync', async (c) => {
  const apiKey = c.req.header('X-API-Key')
  if (!apiKey || apiKey !== c.env.API_KEY) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const body = await c.req.text()
  if (!body) {
    return c.json({ error: 'Empty body' }, 400)
  }

  const date = c.req.query('date')
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return c.json({ error: 'Missing or invalid ?date=YYYY-MM-DD query param' }, 400)
  }

  const meta = parseMeta(date, body)
  await putBriefing(c.env, date, body, meta)

  return c.json({
    ok: true,
    date: meta.date,
    title: meta.title,
    sections: meta.sections,
    items: meta.itemCount,
  })
})

/* ===== 404 ===== */
app.notFound(async (c) => {
  // 如果是 /favicon.ico 等常见资源请求，忽略
  const path = c.req.path
  if (path === '/favicon.ico') return c.newResponse(null, 204)
  if (path === '/robots.txt') {
    return c.text('User-agent: *\nAllow: /\nSitemap: https://news.renezhou.com/rss.xml\n')
  }
  return c.html(renderNotFound())
})

export default app
