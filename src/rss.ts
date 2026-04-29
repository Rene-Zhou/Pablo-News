import { renderMarkdown, parseMeta } from './markdown'

const SITE_URL = 'https://news.renezhou.com'
const SITE_NAME = '科技早报'
const SITE_DESC = 'AI 科技早报 · 每日清晨推送全球 AI 领域动态'

export async function generateRSS(
  env: { BRIEFINGS_ASSETS: Fetcher },
  fetchBriefing: (env: { BRIEFINGS_ASSETS: Fetcher }, date: string) => Promise<string | null>
): Promise<string> {
  const dates: string[] = []
  const today = new Date()
  // Search tomorrow first, then today, then yesterday...
  for (let offset = 1; offset >= -365; offset--) {
    const d = new Date(today)
    d.setDate(d.getDate() + offset)
    const dateStr = d.toISOString().slice(0, 10)
    const md = await fetchBriefing(env, dateStr)
    if (md) dates.push(dateStr)
    if (dates.length >= 30) break
  }

  const items: string[] = []

  for (const date of dates) {
    const md = await fetchBriefing(env, date)
    if (!md) continue
    const meta = parseMeta(date, md)
    const html = renderMarkdown(md)
    const preview = stripHtml(html).slice(0, 500).replace(/\n+/g, ' ').trim()

    items.push(`
    <item>
      <title><![CDATA[${meta.title}]]></title>
      <link>${SITE_URL}/${date}</link>
      <guid>${SITE_URL}/${date}</guid>
      <pubDate>${new Date(date + 'T00:00:00+08:00').toUTCString()}</pubDate>
      <description><![CDATA[${preview}]]></description>
    </item>`)
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <description>${SITE_DESC}</description>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items.join('')}
  </channel>
</rss>`
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
    .replace(/&[^;]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
