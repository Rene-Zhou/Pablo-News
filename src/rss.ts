import { renderMarkdown, parseMeta } from './markdown'
import type { Channel } from './render'

const SITE_URL = 'https://news.renezhou.com'
const SITE_NAME = '科技早报'

function channelInfo(channel: Channel) {
  return channel === 'ai'
    ? { name: 'AI 科技早报', desc: '每日清晨推送全球 AI 领域动态' }
    : { name: '游戏速报', desc: '每日推送全球游戏行业动态' }
}

export async function generateRSS(
  env: { BRIEFINGS_ASSETS: Fetcher },
  fetchBriefing: (env: { BRIEFINGS_ASSETS: Fetcher }, channel: Channel, date: string) => Promise<string | null>,
  channel: Channel = 'ai'
): Promise<string> {
  const info = channelInfo(channel)
  const dates: string[] = []
  const today = new Date()
  for (let offset = 1; offset >= -365; offset--) {
    const d = new Date(today)
    d.setDate(d.getDate() + offset)
    const dateStr = d.toISOString().slice(0, 10)
    const md = await fetchBriefing(env, channel, dateStr)
    if (md) dates.push(dateStr)
    if (dates.length >= 30) break
  }

  const items: string[] = []

  for (const date of dates) {
    const md = await fetchBriefing(env, channel, date)
    if (!md) continue
    const meta = parseMeta(date, md)
    const html = renderMarkdown(md)
    const preview = stripHtml(html).slice(0, 500).replace(/\n+/g, ' ').trim()

    const link = channel === 'ai'
      ? `${SITE_URL}/${date}`
      : `${SITE_URL}/games/${date}`

    items.push(`
    <item>
      <title><![CDATA[${meta.title}]]></title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${new Date(date + 'T00:00:00+08:00').toUTCString()}</pubDate>
      <description><![CDATA[${preview}]]></description>
    </item>`)
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${info.name}</title>
    <description>${info.desc}</description>
    <link>${SITE_URL}${channel === 'ai' ? '' : '/games'}</link>
    <atom:link href="${SITE_URL}/rss/${channel === 'ai' ? 'ai' : 'games'}.xml" rel="self" type="application/rss+xml"/>
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
