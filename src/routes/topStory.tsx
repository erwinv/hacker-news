import { Box, LinearProgress } from '@mui/joy'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { TopStory, isJob } from '~/api/common'
import fetchStory from '~/api/story'
import JobCard from '~/components/JobCard'
import StoryCard from '~/components/StoryCard'
import StoryDiscussion from '~/components/StoryDiscussion'
import { ignoreAbortError } from '~/fns'

export default function TopStory() {
  const { id } = useParams()
  const [topStory, setTopStory] = useState<TopStory>()

  useEffect(() => {
    const storyId = Number(id)
    if (!Number.isFinite(storyId)) return

    const aborter = new AbortController()

    fetchStory(storyId, aborter)
      .then((story) => {
        if (!aborter.signal.aborted) {
          setTopStory(story)
        }
      })
      .catch(ignoreAbortError)

    return () => {
      aborter.abort()
    }
  }, [id])

  if (!topStory) return <LinearProgress />

  if (isJob(topStory)) return <JobCard job={topStory} />

  return (
    <>
      <Box sx={{ px: 1.5 }}>
        <StoryCard story={topStory} />
      </Box>
      <StoryDiscussion story={topStory} />
    </>
  )
}
