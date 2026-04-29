import { BriefingMeta, Briefing } from './markdown'

const KEY_PREFIX = 'briefing:'
const META_KEY = 'briefing:index'
const LATEST_KEY = 'briefing:latest'

export interface Env {
  BRIEFINGS: KVNamespace
}

/** 写入一篇简报 */
export async function putBriefing(env: Env, date: string, md: string, meta: BriefingMeta): Promise<void> {
  const kv = env.BRIEFINGS
  await kv.put(`${KEY_PREFIX}${date}`, md)
  await kv.put(`${KEY_PREFIX}${date}:meta`, JSON.stringify(meta))
  await kv.put(LATEST_KEY, date)
  await updateIndex(env, date, meta)
  await kv.put(`${KEY_PREFIX}${date}:updated`, new Date().toISOString())
}

/** 读取简报 Markdown */
export async function getBriefing(env: Env, date: string): Promise<string | null> {
  return await env.BRIEFINGS.get(`${KEY_PREFIX}${date}`)
}

/** 读取简报元数据 */
export async function getBriefingMeta(env: Env, date: string): Promise<BriefingMeta | null> {
  const raw = await env.BRIEFINGS.get(`${KEY_PREFIX}${date}:meta`)
  return raw ? JSON.parse(raw) : null
}

/** 获取最新简报日期 */
export async function getLatestDate(env: Env): Promise<string | null> {
  return await env.BRIEFINGS.get(LATEST_KEY)
}

/** 获取所有简报日期列表（按日期降序） */
export async function listDates(env: Env): Promise<string[]> {
  const raw = await env.BRIEFINGS.get(META_KEY)
  if (!raw) return []
  const index: string[] = JSON.parse(raw)
  return index.sort((a, b) => b.localeCompare(a))
}

/** 更新索引 */
async function updateIndex(env: Env, date: string, _meta: BriefingMeta): Promise<void> {
  const raw = await env.BRIEFINGS.get(META_KEY)
  const index: string[] = raw ? JSON.parse(raw) : []
  if (!index.includes(date)) {
    index.push(date)
    await env.BRIEFINGS.put(META_KEY, JSON.stringify(index.sort().reverse()))
  }
}

/** 删除简报 */
export async function deleteBriefing(env: Env, date: string): Promise<void> {
  const kv = env.BRIEFINGS
  await kv.delete(`${KEY_PREFIX}${date}`)
  await kv.delete(`${KEY_PREFIX}${date}:meta`)
  await kv.delete(`${KEY_PREFIX}${date}:updated`)
  const raw = await kv.get(META_KEY)
  if (raw) {
    const index: string[] = JSON.parse(raw)
    const filtered = index.filter(d => d !== date)
    await kv.put(META_KEY, JSON.stringify(filtered))
  }
  const latest = await kv.get(LATEST_KEY)
  if (latest === date) {
    const index = await listDates(env)
    await kv.put(LATEST_KEY, index[0] || '')
  }
}
