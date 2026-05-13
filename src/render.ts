import { css } from './style'
import { BriefingMeta } from './markdown'

const SITE_URL = 'https://news.renezhou.com'
const SITE_NAME = '科技早报'

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#2563eb"/>
  <rect x="16" y="12" width="32" height="40" rx="4" fill="#fff"/>
  <rect x="20" y="20" width="24" height="3" rx="1.5" fill="#2563eb" opacity="0.6"/>
  <rect x="20" y="28" width="18" height="3" rx="1.5" fill="#2563eb" opacity="0.4"/>
  <rect x="20" y="36" width="22" height="3" rx="1.5" fill="#2563eb" opacity="0.4"/>
</svg>`

const GAME_FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#059669"/>
  <circle cx="32" cy="52" r="4" fill="#fff"/>
  <rect x="24" y="14" width="16" height="20" rx="2" fill="none" stroke="#fff" stroke-width="2"/>
  <circle cx="28" cy="32" r="3" fill="#fff"/>
  <circle cx="36" cy="32" r="3" fill="#fff"/>
  <rect x="29" y="36" width="6" height="3" rx="1" fill="#fff"/>
  <line x1="32" y1="12" x2="32" y2="10" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
</svg>`

export type Channel = 'ai' | 'games'

const channelInfo: Record<Channel, { name: string; desc: string; favicon: string; color: string }> = {
  ai: { name: '科技早报', desc: 'AI 科技早报 · 每日清晨推送全球 AI 领域动态', favicon: FAVICON_SVG, color: '#2563eb' },
  games: { name: '游戏速报', desc: '游戏速报 · 每日推送全球游戏行业动态', favicon: GAME_FAVICON_SVG, color: '#059669' },
}

function renderTabs(active: Channel): string {
  const aiClass = active === 'ai' ? 'tab active' : 'tab'
  const gameClass = active === 'games' ? 'tab active' : 'tab'
  return `<nav class="tabs">
    <a href="/" class="${aiClass}">科技</a>
    <a href="/games" class="${gameClass}">游戏</a>
  </nav>`
}

function Layout(props: { title: string; channel: Channel; children: string }) {
  const info = channelInfo[props.channel]
  const styleVars = `--accent:${info.color};--accent-hover:${info.color}dd`
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(props.title)} — ${info.name}</title>
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(info.favicon)}">
<meta name="description" content="${info.desc}">
<meta name="color-scheme" content="light dark">
<style>${css}</style>
</head>
<body style="${styleVars}">
<header>
  <div class="header-top">
    <h1><a href="/">${SITE_NAME}</a></h1>
    <nav class="header-nav">
      <a href="/">最新</a>
      <a href="/archive">归档</a>
      <a href="/rss.xml">RSS</a>
      <a href="/about">关于</a>
    </nav>
  </div>
  ${renderTabs(props.channel)}
</header>
<main>${props.children}</main>
<footer>
  <p><a href="${SITE_URL}">${SITE_NAME}</a> · ${info.name} · 自动生成于 <a href="https://github.com/Rene-Zhou/Pablo-News">GitHub</a></p>
</footer>
</body>
</html>`
}

export function renderHome(latest: { date: string; html: string } | null, archiveDates: string[], channel: Channel = 'ai'): string {
  const info = channelInfo[channel]
  const title = latest
    ? latest.date + ' — ' + info.name
    : info.name

  let content = ''

  if (latest) {
    content += '<div class="briefing-meta">'
      + '<span class="date">' + latest.date + '</span>'
      + '</div>'
    content += '<div class="content">' + latest.html + '</div>'
  } else {
    content = '<div class="not-found"><h2>暂无最新简报</h2><p>首期简报正在生成中，请稍候。</p></div>'
  }

  if (archiveDates.length > 1) {
    content += '<section><h2>历史简报</h2><ul class="archive-list">'
    for (const date of archiveDates.slice(0, 7)) {
      const label = date === latest?.date ? '（最新）' : ''
      const href = channel === 'ai' ? '/' + date : '/games/' + date
      content += '<li><a href="' + href + '">' + date + '</a><span class="arc-date">' + label + '</span></li>'
    }
    if (archiveDates.length > 7) {
      content += '<li><a href="/archive" style="font-size:.875rem;color:var(--accent)">查看全部 ' + archiveDates.length + ' 期 →</a></li>'
    }
    content += '</ul></section>'
  }

  return Layout({ title, channel, children: content })
}

export function renderBriefing(date: string, html: string, meta: BriefingMeta | null, channel: Channel = 'ai'): string {
  const info = channelInfo[channel]
  const title = date

  const content = '<div class="briefing-meta">'
    + '<span class="date">' + date + '</span>'
    + '</div><div class="content">' + html + '</div>'
    + '<p class="back-link"><a href="' + (channel === 'ai' ? '/' : '/games') + '">← 返回首页</a></p>'

  return Layout({ title, channel, children: content })
}

export function renderArchive(dates: string[], channel: Channel = 'ai'): string {
  const info = channelInfo[channel]
  const list = dates.map(d => {
    const href = channel === 'ai' ? '/' + d : '/games/' + d
    return '<li><a href="' + href + '">' + d + '</a></li>'
  }).join('\n')

  const content = '<section>'
    + '<h2>全部简报</h2>'
    + '<p style="font-size:.875rem;color:#888;margin-bottom:16px">共 ' + dates.length + ' 期</p>'
    + '<ul class="archive-list">' + list + '</ul>'
    + '</section>'

  return Layout({ title: '归档 — ' + info.name, channel, children: content })
}

export function renderNotFound(channel: Channel = 'ai'): string {
  return Layout({
    title: '页面未找到',
    channel,
    children: '<div class="not-found"><h2>404</h2><p>该期简报不存在</p><a href="/">← 返回首页</a></div>'
  })
}

export function renderAbout(channel: Channel = 'ai'): string {
  return Layout({
    title: '关于',
    channel,
    children: `<section class="about-section">
      <h2>关于 科技早报</h2>
      <p>一份由 AI 自动生成的科技资讯精选，每日清晨推送。</p>
      <p>目前涵盖 <strong>AI 科技</strong> 和 <strong>游戏</strong> 两个频道。</p>
      <br>
      <p><strong>内容来源</strong></p>
      <p>AI 频道：Hacker News、TechCrunch、The Verge 等优质科技媒体</p>
      <p>游戏频道：游民星空、机核、IGN、Eurogamer、Gematsu 等游戏媒体</p>
      <br>
      <p><strong>技术栈</strong></p>
      <p>Hermes Agent（信息采集+生成）→ Hono + Cloudflare Workers（发布）</p>
      <br>
      <p><a href="https://github.com/Rene-Zhou/Pablo-News" class="accent-link">源代码 →</a></p>
    </section>`
  })
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
