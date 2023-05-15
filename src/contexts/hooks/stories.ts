import { useEffect, useState } from 'react'
import { Lazy, fetchItem, hackerNewsApiBaseUrl, isMissing } from '~/api/common'
import { StoryKind, StoryKindMapping } from '~/api/stories'
import db from '~/db'
import { ignoreAbortError } from '~/fns'

export default function useStories<K extends StoryKind>(kind: K) {
  const [stories, setStories] = useState<Lazy<StoryKindMapping[K]>[]>()

  useEffect(() => {
    const aborter = new AbortController()

    ;(async () => {
      const url = new URL(`/v0/${kind}stories.json`, hackerNewsApiBaseUrl)
      const response = await fetch(url, { signal: aborter.signal })
      if (!response.ok) throw response
      const storyIds = (await response.json()) as StoryKindMapping[K]['id'][]

      const maybeStories = (await db.items.bulkGet(storyIds)) as (StoryKindMapping[K] | undefined)[]
      const lazyStories = maybeStories.map((maybeItem, i) => maybeItem ?? storyIds[i])
      setStories(lazyStories)

      const missingStories = await Promise.all(
        lazyStories.map(async (storyOrId, i) => {
          if (!isMissing(storyOrId)) return []

          const story = (await fetchItem(storyOrId, aborter)) as StoryKindMapping[K]
          setStories((prev) => {
            const next = [...(prev ?? [])]
            next[i] = story
            return next
          })

          return [story]
        })
      ).then((results) => results.flat())

      await db.items.bulkAdd(missingStories)
    })().catch(ignoreAbortError)

    return () => {
      aborter.abort()
    }
  }, [kind])

  return stories
}
