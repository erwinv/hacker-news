import { useEffect, useState } from 'react'
import { Job, Story } from '~/api/common'
import fetchStory from '~/api/story'
import { ignoreAbortError } from '~/fns'

export default function useStory(id: number) {
  const [story, setStory] = useState<Job | Story>()

  useEffect(() => {
    if (!Number.isFinite(id)) return

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
  }, [id])

  return story
}
