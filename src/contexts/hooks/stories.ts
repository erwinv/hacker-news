import { useEffect, useState } from 'react'
import { Lazy, Story, fetchItem, hackerNewsApiBaseUrl, isMissing } from '~/api/common'
import db from '~/db'
import { ignoreAbortError } from '~/fns'

export default function useNewStories() {
  const [newStories, setNewStories] = useState<Lazy<Story>[]>()

  useEffect(() => {
    const aborter = new AbortController()

    ;(async () => {
      const url = new URL(`/v0/${'new'}stories.json`, hackerNewsApiBaseUrl)
      const response = await fetch(url, { signal: aborter.signal })
      if (!response.ok) throw response
      const storyIds = (await response.json()) as Story['id'][]

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
    })().catch(ignoreAbortError)

    return () => {
      aborter.abort()
    }
  }, [])

  return newStories
}
