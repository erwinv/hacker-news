import { useCallback, useEffect, useState } from 'react'
import { ItemId, StoryKind, StoryKindMapping, fetchItems, hackerNewsApiBaseUrl } from '~/api/common'
import db from '~/db'
import { ignoreAbortError } from '~/fns'

export default function useStories<K extends StoryKind>(kind: K, initial: number) {
  const [storyIds, setStoryIds] = useState<ItemId[]>()
  const [limit, setLimit] = useState(initial)
  const [stories, setStories] = useState<StoryKindMapping[K][]>()
  const [isFetching, setFetching] = useState(false)

  useEffect(() => {
    setStories(undefined)
    setLimit(initial)

    const aborter = new AbortController()

    ;(async () => {
      const url = new URL(`/v0/${kind}stories.json`, hackerNewsApiBaseUrl)
      const response = await fetch(url, { signal: aborter.signal })
      if (!response.ok) throw response
      const storyIds = (await response.json()) as StoryKindMapping[K]['id'][]
      setStoryIds(storyIds)
    })().catch(ignoreAbortError)

    return () => {
      aborter.abort()
    }
  }, [kind, initial])

  useEffect(() => {
    if (!storyIds) return
    if ((stories?.length ?? 0) >= limit) return

    const aborter = new AbortController()

    ;(async () => {
      const from = stories?.length ?? 0
      const ids = storyIds.slice(from, limit)

      setFetching(true)
      const fetchedStories = (await fetchItems(ids, aborter).finally(() =>
        setFetching(false)
      )) as StoryKindMapping[K][]

      setStories((stories) => (!stories ? fetchedStories : [...stories, ...fetchedStories]))
    })().catch(ignoreAbortError)

    return () => {
      aborter.abort()
    }
  }, [storyIds, stories?.length, limit])

  const loadMore = useCallback((lastIndex: number, n: number) => {
    setLimit(lastIndex + n + 1)
  }, [])

  const reload = useCallback(async () => {
    if (storyIds) {
      await db.items.bulkDelete(storyIds)
    }
    setStories(undefined)
  }, [storyIds])

  const hasMore = (storyIds ?? [])?.length > (stories ?? [])?.length

  return { stories, hasMore, isFetching, loadMore, reload }
}
