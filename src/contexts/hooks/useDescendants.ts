import { useCallback, useEffect, useState } from 'react'
import { prefetchDescendants } from '~/api/comments'
import { Comment, ItemId, Job, Story, isJob } from '~/api/hackerNews'
import db from '~/db'
import { ignoreAbortError } from '~/fns'

export default function useDescendants(item?: Job | Story) {
  const [descendants, setDescendants] = useState<Map<ItemId, Comment>>()

  useEffect(() => {
    if (!item) {
      setDescendants(undefined)
      return
    }
    if (isJob(item)) return

    const story = item
    if (story.descendants === descendants?.size) return

    const aborter = new AbortController()

    prefetchDescendants(story, aborter, 20)
      .then((descendants) => {
        if (!aborter.signal.aborted) {
          setDescendants(descendants)
        }
      })
      .catch(ignoreAbortError)

    return () => {
      aborter.abort()
    }
  }, [item, descendants?.size])

  const invalidateCache = useCallback(async () => {
    if (!descendants) return

    await db.items.bulkDelete([...descendants.keys()])
  }, [descendants])

  return { descendants, invalidateCache }
}
