import { ItemId, TopStory, fetchItem, hackerNewsApiBaseUrl, isTopStory } from '~/api/common'
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

  const storyIds = (await response.json()) as ItemId[]

  const paginatedIds = take(storyIds, n)

  const items = await Promise.all(paginatedIds.map((id) => fetchItem(id, aborter)))

  return items.filter(isTopStory).filter((story) => !story.deleted && !story.dead)
}
