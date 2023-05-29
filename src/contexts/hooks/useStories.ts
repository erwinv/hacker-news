import { useCallback, useEffect, useState } from 'react'
import { ItemId, Job, Story, fetchItems } from '~/api/hackerNews'
import db from '~/db'
import { ignoreAbortError } from '~/fns'

export default function useStories(storyIds?: ItemId[], initial = 20) {
  const [stories, setStories] = useState<Array<Job | Story>>()
  const [limit, setLimit] = useState(initial)

  useEffect(() => setLimit(initial), [storyIds, initial])
  useEffect(() => {
    if (!storyIds) {
      setStories(undefined)
      return
    }
    if ((stories?.length ?? 0) >= limit) return

    const aborter = new AbortController()

    ;(async () => {
      const from = stories?.length ?? 0
      const ids = storyIds.slice(from, limit)
      const fetchedStories = (await fetchItems(ids, aborter)) as Array<Job | Story>
      if (aborter.signal.aborted) return
      setStories((stories) => (!stories ? fetchedStories : [...stories, ...fetchedStories]))
    })().catch(ignoreAbortError)

    return () => {
      aborter.abort()
    }
  }, [storyIds, stories?.length, limit])

  const loadMore = useCallback((lastIndex: number, n: number) => {
    setLimit(lastIndex + n + 1)
  }, [])

  const invalidateCache = useCallback(async () => {
    if (storyIds) {
      await db.items.bulkDelete(storyIds)
    }
  }, [storyIds])

  const total = storyIds?.length ?? 0
  const loaded = stories?.length ?? 0
  const hasMore = total > loaded

  return { stories, hasMore, loaded, total, loadMore, invalidateCache }
}
