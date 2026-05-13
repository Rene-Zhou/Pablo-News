import { Hono } from 'hono'
import { renderMarkdown, parseMeta } from './markdown'
import { renderHome, renderBriefing, renderArchive, renderNotFound, renderAbout, Channel } from './render'
import { generateRSS } from './rss'
import { css } from './style'

type Bindings = {
  BRIEFINGS_ASSETS: Fetcher
}

const app = new Hono<{ Bindings: Bindings }>()

async function fetchBriefing(env: Bindings, channel: Channel, date: string): Promise<string | null> {
  const file = channel === 'ai' ? `${date}.md` : `games-${date}.md`
  try {
    const resp = await env.BRIEFINGS_ASSETS.fetch(`https://fake/${file}`)
    if (!resp.ok) return null
    return await resp.text()
  } catch {
    return null
  }
}

async function listAllBriefings(env: Bindings, channel: Channel): Promise<string[]> {
  const dates: string[] = []
  const today = new Date()
  for (let offset = 1; offset >= -365; offset--) {
    const d = new Date(today)
    d.setDate(d.getDate() + offset)
    const dateStr = d.toISOString().slice(0, 10)
    const md = await fetchBriefing(env, channel, dateStr)
    if (md) dates.push(dateStr)
  }
  return dates
}

async function findLatest(env: Bindings, channel: Channel): Promise<{ date: string; content: string } | null> {
  const today = new Date()
  for (let offset = 1; offset >= -365; offset--) {
    const d = new Date(today)
    d.setDate(d.getDate() + offset)
    const dateStr = d.toISOString().slice(0, 10)
    const md = await fetchBriefing(env, channel, dateStr)
    if (md) return { date: dateStr, content: md }
  }
  return null
}

/* ============ 首页 — AI ============ */
app.get('/', async (c) => {
  const channel: Channel = 'ai'
  const latest = await findLatest(c.env, channel)
  const allDates = await listAllBriefings(c.env, channel)
  return c.html(renderHome(
    latest ? { date: latest.date, html: renderMarkdown(latest.content) } : null,
    allDates, channel
  ))
})

/* ============ AI 频道单期 ============ */
app.get('/:date{[0-9]{4}-[0-9]{2}-[0-9]{2}}', async (c) => {
  const channel: Channel = 'ai'
  const date = c.req.param('date')
  const md = await fetchBriefing(c.env, channel, date)
  if (!md) return c.notFound()
  return c.html(renderBriefing(date, renderMarkdown(md), parseMeta(date, md), channel))
})

/* ============ 游戏频道首页 ============ */
app.get('/games', async (c) => {
  const channel: Channel = 'games'
  const latest = await findLatest(c.env, channel)
  const allDates = await listAllBriefings(c.env, channel)
  return c.html(renderHome(
    latest ? { date: latest.date, html: renderMarkdown(latest.content) } : null,
    allDates, channel
  ))
})

/* ============ 游戏频道单期 ============ */
app.get('/games/:date{[0-9]{4}-[0-9]{2}-[0-9]{2}}', async (c) => {
  const channel: Channel = 'games'
  const date = c.req.param('date')
  const md = await fetchBriefing(c.env, channel, date)
  if (!md) return c.notFound()
  return c.html(renderBriefing(date, renderMarkdown(md), parseMeta(date, md), channel))
})

/* ============ 归档页（双频道混排） ============ */
app.get('/archive', async (c) => {
  const aiDates = await listAllBriefings(c.env, 'ai')
  const gameDates = await listAllBriefings(c.env, 'games')

  const allEntries: { date: string; channel: Channel }[] = []
  for (const d of aiDates) allEntries.push({ date: d, channel: 'ai' })
  for (const d of gameDates) allEntries.push({ date: d, channel: 'games' })
  allEntries.sort((a, b) => b.date.localeCompare(a.date))

  const listHtml = allEntries.map(e => {
    const tag = e.channel === 'ai'
      ? '<span class="channel-tag tag-ai">科技</span>'
      : '<span class="channel-tag tag-games">游戏</span>'
    const href = e.channel === 'ai' ? '/' + e.date : '/games/' + e.date
    return `<li><a href="${href}" class="arc-date-link">${e.date}</a>${tag}</li>`
  }).join('')

  const extraCSS = `
.archive-mixed li{justify-content:flex-start;gap:10px}
.channel-tag{font-size:.6875rem;font-weight:600;padding:2px 8px;border-radius:3px;white-space:nowrap}
.tag-ai{background:#dbeafe;color:#1d4ed8}
.tag-games{background:#d1fae5;color:#047857}
.arc-date-link{font-variant-numeric:tabular-nums;min-width:7.5em;display:inline-block}
@media(prefers-color-scheme:dark){
  .tag-ai{background:#1e3a5f;color:#93c5fd}
  .tag-games{background:#064e3b;color:#6ee7b7}
}
  `

  const content = `<section>
    <h2>全部简报</h2>
    <p style="font-size:.875rem;color:#888;margin-bottom:16px">共 ${allEntries.length} 期（科技 ${aiDates.length} · 游戏 ${gameDates.length}）</p>
    <ul class="archive-list archive-mixed">${listHtml}</ul>
    </section>`

  const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#2563eb"/><rect x="16" y="12" width="32" height="40" rx="4" fill="#fff"/><rect x="20" y="20" width="24" height="3" rx="1.5" fill="#2563eb" opacity="0.6"/><rect x="20" y="28" width="18" height="3" rx="1.5" fill="#2563eb" opacity="0.4"/><rect x="20" y="36" width="22" height="3" rx="1.5" fill="#2563eb" opacity="0.4"/></svg>`

  return c.html(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>归档 — Pablo早报</title>
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(FAVICON_SVG)}">
<meta name="description" content="AI 科技早报 · 每日清晨推送全球 AI 领域动态">
<meta name="color-scheme" content="light dark">
<style>${css}${extraCSS}</style>
</head>
<body style="--accent:#2563eb">
<header>
  <div class="header-top">
    <h1><a href="/">Pablo早报</a></h1>
    <nav class="header-nav">
      <a href="/">最新</a>
      <a href="/archive" class="tab active" style="color:var(--accent);border-bottom:2px solid var(--accent)">归档</a>
      <a href="/rss.xml">RSS</a>
      <a href="/about">关于</a>
    </nav>
  </div>
  <nav class="tabs"><a href="/" class="tab">科技</a><a href="/games" class="tab">游戏</a></nav>
</header>
<main>${content}</main>
<footer><p>Pablo早报 · 科技早报 · 游戏速报 · 自动生成于 <a href="https://github.com/Rene-Zhou/Pablo-News">Pablo-News</a></p></footer>
</body>
</html>`)
})

/* ============ RSS ============ */
app.get('/rss.xml', async (c) => {
  const xml = await generateRSS(c.env, fetchBriefing, 'ai')
  return c.newResponse(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
})

app.get('/rss/ai.xml', async (c) => {
  const xml = await generateRSS(c.env, fetchBriefing, 'ai')
  return c.newResponse(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
})

app.get('/rss/games.xml', async (c) => {
  const xml = await generateRSS(c.env, fetchBriefing, 'games')
  return c.newResponse(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
})

/* ============ 关于 ============ */
app.get('/about', async (c) => {
  return c.html(renderAbout('ai'))
})

/* ============ 404 ============ */
app.notFound(async (c) => {
  const path = c.req.path
  if (path === '/favicon.ico') return c.newResponse(null, 204)
  if (path === '/robots.txt') {
    return c.text('User-agent: *\nAllow: /\nSitemap: https://news.renezhou.com/rss.xml\n')
  }
  return c.html(renderNotFound('ai'))
})

export default app
