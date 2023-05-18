import { Box, LinearProgress } from '@mui/joy'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Story } from '~/api/common'
import fetchStory from '~/api/story'
import StoryCard from '~/components/StoryCard'
import StoryDiscussion from '~/components/StoryDiscussion'
import { ignoreAbortError } from '~/fns'

interface StoryProps {
  virtual?: boolean
  lazy?: boolean
}

export default function Story({ virtual = false, lazy = false }: StoryProps) {
  const { id } = useParams()
  const [story, setStory] = useState<Story>()

  useEffect(() => {
    const storyId = Number(id)
    if (!Number.isFinite(storyId)) return

    const aborter = new AbortController()

    fetchStory(storyId, aborter)
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

  if (!story) return <LinearProgress color="neutral" />

  return (
    <>
      <Box sx={{ px: 1.5 }}>
        <StoryCard story={story} />
      </Box>
      <StoryDiscussion story={story} virtual={virtual} lazy={lazy} />
    </>
  )
}
