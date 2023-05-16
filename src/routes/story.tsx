import { Box, LinearProgress } from '@mui/joy'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Story } from '~/api/common'
import fetchStory from '~/api/story'
import StoryCard from '~/components/StoryCard'
import StoryComments from '~/components/StoryComments'
import { ignoreAbortError } from '~/fns'

export default function Story() {
  const { id } = useParams()
  const [story, setStory] = useState<Story>()

  useEffect(() => {
    const storyId = Number(id)
    if (!Number.isFinite(storyId)) return

    let aborted = false
    const aborter = new AbortController()

    fetchStory(storyId, aborter)
      .then((story) => {
        if (!aborted) {
          setStory(story)
        }
      })
      .catch(ignoreAbortError)

    return () => {
      aborted = true
      aborter.abort()
    }
  }, [id])

  if (!story) return <LinearProgress color="neutral" />

  return (
    <>
      <Box sx={{ px: 1.5 }}>
        <StoryCard story={story} />
      </Box>
      <StoryComments story={story} />
    </>
  )
}
