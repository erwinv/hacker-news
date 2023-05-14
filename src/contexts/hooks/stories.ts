import { useCallback, useEffect, useState } from 'react'
import { Lazy, Story, fetchItem, hackerNewsApiBaseUrl, isMissing } from '~/api/common'
import db from '~/db'

const itemsPerPage = 30

export default function useNewStories() {
  const [newStories, setNewStories] = useState<Lazy<Story>[]>()
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(itemsPerPage)
  const more = useCallback(() => {
    setLimit((x) => x + itemsPerPage)
  }, [])

  useEffect(() => {
    const aborter = new AbortController()
    ;(async () => {
      const url = new URL(`/v0/${'new'}stories.json`, hackerNewsApiBaseUrl)
      const response = await fetch(url, { signal: aborter.signal })
      if (!response.ok) throw response
      const ids = (await response.json()) as Story['id'][]
      setTotal(ids.length)

      const storyIds = ids.slice(0, limit)

      const maybeStories = (await db.items.bulkGet(storyIds)) as (Story | undefined)[]
      const lazyStories = maybeStories.map((maybeItem, i) => maybeItem ?? storyIds[i])
      setNewStories(lazyStories)

      const missingStories = [] as Story[]
      const newStories = await Promise.all(
        lazyStories.map(async (storyOrId) => {
          if (!isMissing(storyOrId)) return storyOrId

          const story = (await fetchItem(storyOrId, aborter)) as Story
          missingStories.push(story)
          return story
        })
      )

      await db.items.bulkAdd(missingStories)
      setNewStories(newStories)
    })()

    return () => {
      aborter.abort()
    }
  }, [limit])

  return { newStories, hasMore: total > limit, more }
}
