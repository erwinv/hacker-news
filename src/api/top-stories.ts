import { Item, ItemId, TopStory, fetchItem, hackerNewsApiBaseUrl, isTopStory } from '~/api/common'
import db from '~/db'
import { take } from '~/fns'

export default async function fetchTopStories(
  n: number,
  aborter?: AbortController
): Promise<TopStory[]> {
  const url = new URL('/v0/topstories.json', hackerNewsApiBaseUrl)

  const response = await fetch(url, {
    signal: aborter?.signal,
  })

  if (!response.ok) throw response

  const storyIds = take((await response.json()) as ItemId[], n)

  const items = await db.items.bulkGet(storyIds)
    .then(async (ids) => {
      const missingItems = [] as Item[]

      const items = await Promise.all(ids.map(async (maybeItem, i) => {
        if (maybeItem) return maybeItem

        const item = await fetchItem(storyIds[i], aborter)
        missingItems.push(item)
        return item
      }))

      await db.items.bulkAdd(missingItems)

      return items
    })

  return items.filter(isTopStory).filter((story) => !story.deleted && !story.dead)
}
