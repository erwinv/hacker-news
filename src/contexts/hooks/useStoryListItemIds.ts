import { useCallback, useEffect, useState } from 'react'
import { ItemId, StoryKind, hackerNewsApiBaseUrl } from '~/api/hackerNews'
import { ignoreAbortError } from '~/fns'

export default function useStoryListItemIds<K extends StoryKind>(kind: K) {
  const [storyIds, setStoryIds] = useState<ItemId[]>()
  const [refetchHack, setRefetchHack] = useState(false)

  useEffect(() => {
    const aborter = new AbortController()

    ;(async () => {
      const url = new URL(`/v0/${kind}stories.json`, hackerNewsApiBaseUrl)
      const response = await fetch(url, { signal: aborter.signal })
      if (!response.ok) throw response
      const storyIds = (await response.json()) as ItemId[]
      setStoryIds(storyIds)
    })().catch(ignoreAbortError)

    return () => {
      aborter.abort()
      setStoryIds(undefined)
    }
  }, [kind, refetchHack])

  const refetch = useCallback(() => {
    setRefetchHack((x) => !x)
  }, [])

  return { storyIds, refetch }
}
