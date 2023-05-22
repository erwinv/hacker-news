import { Box, LinearProgress } from '@mui/joy'
import { useParams } from 'react-router-dom'
import { isJob } from '~/api/common'
import JobCard from '~/components/JobCard'
import StoryCard from '~/components/StoryCard'
import StoryDiscussion from '~/components/StoryDiscussion'
import useStory from '~/contexts/hooks/useStory'

export default function Item() {
  const { itemId } = useParams()
  const story = useStory(Number(itemId))

  if (!story) return <LinearProgress />

  if (isJob(story)) {
    const job = story
    return (
      <Box sx={{ px: 1.5 }}>
        <JobCard job={job} />
      </Box>
    )
  } else {
    return (
      <>
        <Box sx={{ px: 1.5 }}>
          <StoryCard story={story} />
        </Box>
        <StoryDiscussion story={story} />
      </>
    )
  }
}
