import { Box, CircularProgress, LinearProgress, List, ListItem } from '@mui/joy'
import { useParams } from 'react-router-dom'
import { isComment, isJob, isStory } from '~/api/hackerNews'
import CommentCard from '~/components/CommentCard'
import JobCard from '~/components/JobCard'
import StoryCard from '~/components/StoryCard'
import useComments from '~/contexts/hooks/useComments'
import useItem from '~/contexts/hooks/useStory'

export default function Item() {
  const { itemId } = useParams()
  const { item, refetch: refetchStory } = useItem(Number(itemId))
  const { comments, refetch: refetchComments } = useComments(item)

  if (!item) return <LinearProgress />

  const parentCard = isJob(item) ? (
    <JobCard job={item} />
  ) : isStory(item) ? (
    <StoryCard
      story={item}
      reload={async () => {
        await refetchStory()
        await refetchComments()
      }}
    />
  ) : isComment(item) ? (
    <CommentCard comment={item} />
  ) : null

  return (
    <List
      sx={{
        '--List-nestedInsetStart': '2rem',
      }}
    >
      <ListItem>
        <Box sx={{ px: 1.5 }}>{parentCard}</Box>
      </ListItem>
      <ListItem nested>
        {!comments ? (
          <CircularProgress />
        ) : (
          <List>
            {comments.map((comment) => (
              <ListItem key={comment.id}>
                <CommentCard comment={comment} />
              </ListItem>
            ))}
          </List>
        )}
      </ListItem>
    </List>
  )
}
