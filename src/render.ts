import { css } from './style'
import { BriefingMeta } from './markdown'

const SITE_URL = 'https://news.renezhou.com'
const SITE_NAME = '科技早报'

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="4" fill="#fff"/>
  <text x="32" y="24" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="700" fill="#111">NE</text>
  <text x="32" y="40" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="700" fill="#111">WS</text>
</svg>`

function Layout(props: { title: string; children: string }) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(props.title)} — ${SITE_NAME}</title>
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(FAVICON_SVG)}">
<meta name="description" content="AI 科技早报 · 每日清晨推送全球 AI 领域动态">
<meta name="color-scheme" content="light dark">
<style>${css}</style>
</head>
<body>
<header>
  <h1><a href="/">${SITE_NAME}</a></h1>
  <nav>
    <a href="/">最新</a>
    <a href="/archive">归档</a>
    <a href="/rss.xml">RSS</a>
  </nav>
</header>
<main>${props.children}</main>
<footer>
  <p><a href="${SITE_URL}">${SITE_NAME}</a> · 每日 AI 资讯精选 · 自动生成于 <a href="https://github.com/Rene-Zhou/Pablo-News">GitHub</a></p>
</footer>
</body>
</html>`
}

export function renderHome(latest: { date: string; html: string } | null, archiveDates: string[]): string {
  const title = latest
    ? '🤖 ' + latest.date + ' — AI 科技早报'
    : 'AI 科技早报'

  let content = ''

  if (latest) {
    content += `<div class="briefing-meta">
      <span class="date">${latest.date}</span>
      <span class="tagline">30 秒读懂今日 AI 要闻</span>
    </div>`
    content += latest.html
  } else {
    content = '<div class="not-found"><h2>暂无最新简报</h2><p>首期简报正在生成中，请稍候。</p></div>'
  }

  if (archiveDates.length > 1) {
    content += '<section><h2>📚 历史简报</h2><ul class="archive-list">'
    for (const date of archiveDates.slice(0, 7)) {
      const label = date === latest?.date ? '（最新）' : ''
      content += '<li><a href="/' + date + '">' + date + '</a><span class="arc-date">' + label + '</span></li>'
    }
    if (archiveDates.length > 7) {
      content += '<li><a href="/archive" style="font-size:.875rem;color:#2563eb">查看全部 ' + archiveDates.length + ' 期 →</a></li>'
    }
    content += '</ul></section>'
  }

  return Layout({ title, children: content })
}

export function renderBriefing(date: string, html: string, meta: BriefingMeta | null): string {
  const itemCount = meta ? ' · ' + meta.itemCount + ' 条' : ''
  const sectionCount = meta ? meta.sections + ' 个板块' : ''
  const title = '🤖 ' + date + itemCount

  const content = '<div class="briefing-meta">'
    + '<span class="date">' + date + itemCount + '</span>'
    + '<span class="tagline">' + sectionCount + '</span>'
    + '</div>' + html
    + '<p style="font-size:.75rem;color:#bbb;margin-top:8px"><a href="/">← 返回首页</a></p>'

  return Layout({ title, children: content })
}

export function renderArchive(dates: string[], metaMap: Record<string, BriefingMeta>): string {
  const list = dates.map(d => {
    const m = metaMap[d]
    const count = m ? ' · ' + m.itemCount + ' 条' : ''
    const highlight = m?.headline ? ' · ' + m.headline.slice(0, 30) : ''
    return '<li><a href="/' + d + '">' + d + '</a><span class="arc-date">' + count + highlight + '</span></li>'
  }).join('\n')

  const content = '<section>'
    + '<h2>📚 全部简报</h2>'
    + '<p style="font-size:.875rem;color:#888;margin-bottom:16px">共 ' + dates.length + ' 期 · 按日期降序</p>'
    + '<ul class="archive-list">' + list + '</ul>'
    + '</section>'

  return Layout({ title: '归档 — ' + SITE_NAME, children: content })
}

export function renderNotFound(): string {
  return Layout({
    title: '页面未找到',
    children: '<div class="not-found"><h2>404</h2><p>该期简报不存在</p><a href="/">← 返回首页</a></div>'
  })
}

export function renderAbout(): string {
  return Layout({
    title: '关于 — ' + SITE_NAME,
    children: '<section style="padding:24px 0;line-height:2;font-size:.9375rem">'
      + '<h2 style="border:none;margin-top:0">关于 科技早报</h2>'
      + '<p>一份由 AI 自动生成的全球 AI 科技资讯精选，每日清晨推送。</p><br>'
      + '<p><strong>内容来源</strong></p>'
      + '<p>Hacker News、TechCrunch、The Verge、Stratechery 等优质科技媒体</p><br>'
      + '<p><strong>技术栈</strong></p>'
      + '<p>Hermes Agent（信息采集+生成）→ Hono + Cloudflare Workers（发布）</p><br>'
      + '<p><a href="https://github.com/Rene-Zhou/Pablo-News" style="color:#2563eb">源代码 →</a></p>'
      + '</section>'
  })
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
