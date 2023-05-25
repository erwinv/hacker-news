import { useCallback, useEffect, useState } from 'react'
import { Job, Story } from '~/api/hackerNews'
import fetchStory from '~/api/story'
import db from '~/db'
import { ignoreAbortError } from '~/fns'

export default function useStory(id: number) {
  const [story, setStory] = useState<Job | Story>()

  useEffect(() => {
    if (!Number.isFinite(id)) return
    if (story?.id === id) return

    const aborter = new AbortController()

    fetchStory(id, aborter)
      .then((story) => {
        if (!aborter.signal.aborted) {
          setStory(story)
        }
      })
      .catch(ignoreAbortError)

    return () => {
      aborter.abort()
    }
  }, [id, story])

  const refetch = useCallback(async () => {
    await db.items.delete(id)
    setStory(undefined)
  }, [id])

  return { story, refetch }
}
