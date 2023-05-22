import { useCallback, useEffect, useState } from 'react'
import { ItemId, Job, Story, fetchItems } from '~/api/common'
import db from '~/db'
import { ignoreAbortError } from '~/fns'

export default function useStories(storyIds?: ItemId[], initial = 20) {
  const [stories, setStories] = useState<Array<Job | Story>>()
  const [limit, setLimit] = useState(initial)

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
    setLimit(initial)
  }, [storyIds, initial])

  const hasMore = (storyIds ?? []).length > (stories ?? []).length

  return { stories, hasMore, loadMore, invalidateCache }
}
