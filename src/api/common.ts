import db from '~/db'

export type ItemId = number
export type UnixTime = number

interface BaseItem {
  id: ItemId
  time: UnixTime
  deleted?: boolean
  dead?: boolean
}

export interface Story extends BaseItem {
  type: 'story'

  kids?: Comment['id'][]
  descendants: number

  by: string
  url: string
  title: string
  text?: string
  score: number
}

export interface Comment extends BaseItem {
  type: 'comment'

  parent: Story['id']
  kids?: Comment['id'][]

  by: string
  text: string
}

export interface Job extends BaseItem {
  type: 'job'

  by: string
  url?: string
  title: string
  text?: string
  score: number
}

export interface Poll extends BaseItem {
  type: 'poll'

  kids: Comment['id'][]
  descendants: number
  parts: PollOpt['id'][]

  by: string
  title: string
  text?: string
  score: number
}

export interface PollOpt extends BaseItem {
  type: 'pollopt'

  poll: Poll['id']

  by: string
  text: string
  score: number
}

export type Item = Story | Comment | Job | Poll | PollOpt

export function isStory(x: Item): x is Story {
  return x.type === 'story'
}

export function isComment(x: Item): x is Comment {
  return x.type === 'comment'
}

export function isJob(x: Item): x is Job {
  return x.type === 'job'
}

export function isPoll(x: Item): x is Poll {
  return x.type === 'poll'
}

export function isPollOpt(x: Item): x is PollOpt {
  return x.type === 'pollopt'
}

export type TopStory = Story | Job

export function isTopStory(x: Item): x is TopStory {
  return isStory(x) || isJob(x)
}

export const hackerNewsApiBaseUrl = new URL('https://hacker-news.firebaseio.com')

export async function fetchItem(id: ItemId, aborter?: AbortController): Promise<Item> {
  const url = new URL(`/v0/item/${id}.json`, hackerNewsApiBaseUrl)
  const response = await fetch(url, {
    signal: aborter?.signal,
  })
  if (!response.ok) throw response
  const item = await response.json()
  return item as unknown as Item
}

export async function fetchOrGetItemFromDB(id: ItemId, aborter?: AbortController): Promise<Item> {
  const maybeItem = await db.items.get(id)

  if (maybeItem) return maybeItem

  const item = await fetchItem(id, aborter)

  await db.items.add(item)

  return item
}

export async function fetchItems(ids: ItemId[], aborter?: AbortController): Promise<Item[]> {
  const maybeItems = await db.items.bulkGet(ids)

  const missingItems = [] as Item[]

  const items = await Promise.all(
    maybeItems.map(async (maybeItem, i) => {
      if (maybeItem) return maybeItem

      const item = await fetchItem(ids[i], aborter)
      missingItems.push(item)
      return item
    })
  )

  await db.items.bulkAdd(missingItems)

  return items
}
