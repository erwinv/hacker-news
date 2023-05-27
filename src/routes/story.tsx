import { Box, LinearProgress } from '@mui/joy'
import { useParams } from 'react-router-dom'
import { Job, Story, isJob } from '~/api/hackerNews'
import { CommentTrees } from '~/components/CommentTree'
import JobCard from '~/components/JobCard'
import StoryCard from '~/components/StoryCard'
import useCommentTrees from '~/contexts/hooks/useCommentTrees'
import useDescendants from '~/contexts/hooks/useDescendants'
import useItem from '~/contexts/hooks/useStory'

export default function Story() {
  const { itemId } = useParams()
  const { item: story, refetch } = useItem<Job | Story>(Number(itemId))
  const { descendants, invalidateCache } = useDescendants(story)
  const commentTrees = useCommentTrees(story, descendants)

  if (!story) return <LinearProgress />

  if (isJob(story)) {
    const job = story
    return (
      <Box sx={{ px: 1.5 }}>
        <JobCard job={job} />
      </Box>
    )
  }

  return (
    <>
      <Box sx={{ px: 1.5 }}>
        <StoryCard
          story={story}
          reload={async () => {
            await invalidateCache()
            await refetch()
          }}
        />
      </Box>
      <CommentTrees commentTrees={commentTrees} />
    </>
  )
}
