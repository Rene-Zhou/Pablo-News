import { marked } from 'marked'

export interface BriefingMeta {
  date: string
  title: string
  sections: number
  itemCount: number
  headline: string
}

/** 从 Markdown 中提取元数据 */
export function parseMeta(date: string, md: string): BriefingMeta {
  const lines = md.split('\n')
  const titleLine = lines.find(l => l.startsWith('# ')) || ''
  const title = titleLine.replace(/^# /, '').trim()

  const sectionMatches = md.match(/^## /gm)
  const sections = sectionMatches ? sectionMatches.length : 0

  const itemMatches = md.match(/^### \d+\./gm)
  const itemCount = itemMatches ? itemMatches.length : 0

  const headlineMatch = md.match(/^### \d+\.\s*(.+)$/m)
  const headline = headlineMatch ? headlineMatch[1].trim() : ''

  return { date, title, sections, itemCount, headline }
}

/** 从 Markdown 生成 HTML */
export function renderMarkdown(md: string): string {
  const html = marked.parse(md, { breaks: true }) as string
  return html
}

/** 从 Markdown 解析板块标题（用于摘要） */
export function parseSections(md: string): { heading: string; items: string[] }[] {
  const sections: { heading: string; items: string[] }[] = []
  const lines = md.split('\n')
  let currentSection = ''
  let currentItems: string[] = []

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections.push({ heading: currentSection, items: currentItems })
      }
      currentSection = line.replace(/^## /, '')
      currentItems = []
    } else if (line.startsWith('### ')) {
      currentItems.push(line.replace(/^### /, ''))
    }
  }
  if (currentSection) {
    sections.push({ heading: currentSection, items: currentItems })
  }
  return sections
}

/** 从 HTTP 响应头中推断最新简报日期 */
export function extractLatestDate(headers: Headers): string | null {
  // Assets binding 的 headers 里有日期后缀
  return null
}
