import { marked } from 'marked'

export interface BriefingMeta {
  date: string           // "2026-04-29"
  title: string          // "🤖 AI 科技早报 · 2026-04-29"
  sections: number       // 板块数量
  itemCount: number      // 新闻条目数
  wordCount: number      // 中文字数（近似）
  headline: string       // 第一个新闻的标题（用于摘要）
  cachedAt: string       // ISO timestamp
}

export interface Briefing {
  meta: BriefingMeta
  html: string
  markdown: string
}

/** 从 Markdown 中提取元数据 */
export function parseMeta(date: string, md: string): BriefingMeta {
  const lines = md.split('\n')
  const titleLine = lines.find(l => l.startsWith('# ')) || ''
  const title = titleLine.replace(/^# /, '').trim()

  // 统计板块数（## 标题数）
  const sectionMatches = md.match(/^## /gm)
  const sections = sectionMatches ? sectionMatches.length : 0

  // 统计新闻条目数（数字列表项）
  const itemMatches = md.match(/^### \d+\./gm)
  const itemCount = itemMatches ? itemMatches.length : 0

  // 中文词数（近似按字算）
  const cnChars = md.replace(/[\s\S]/, '').length
  const enWords = md.replace(/[a-zA-Z]+/g, 'x').length
  const wordCount = cnChars + enWords

  // 第一个新闻标题
  const headlineMatch = md.match(/^### \d+\.\s*(.+)$/m)
  const headline = headlineMatch ? headlineMatch[1].trim() : ''

  return { date, title, sections, itemCount, wordCount, headline, cachedAt: new Date().toISOString() }
}

/** 从 Markdown 生成 HTML */
export function renderMarkdown(md: string): string {
  // 保留 emoji 和特殊字符，预处理某些格式
  const html = marked.parse(md, { breaks: true }) as string
  return html
}

/** 从 Markdown 解析为结构化新闻条目（用于提取摘要） */
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
