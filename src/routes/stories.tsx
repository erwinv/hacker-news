import { useEffect, useState } from 'react'
import fetchStories, { StoryKind, StoryKindMapping } from '~/api/stories'
import StoryList from '~/components/StoryList'
import { ignoreAbortError } from '~/fns'

interface StoriesProps<K extends StoryKind> {
  kind: K
}

export default function Stories<K extends StoryKind>({ kind }: StoriesProps<K>) {
  const [stories, setStories] = useState<StoryKindMapping[K][]>()

  useEffect(() => {
    let aborted = false
    const aborter = new AbortController()

    setStories(undefined)
    fetchStories(kind, 30, aborter)
      .then((stories) => {
        if (!aborted) {
          setStories(stories)
        }
      })
      .catch(ignoreAbortError)

    return () => {
      aborted = true
      aborter.abort()
    }
  }, [kind])

  return <StoryList stories={stories} />
}
