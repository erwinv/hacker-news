import {
  Box,
  CircularProgress,
  Container,
  LinearProgress,
  List,
  ListItem,
  ListItemContent,
  Stack,
  Typography,
} from '@mui/joy'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import fetchComments, { CommentTree } from '~/api/comments'
import { Story } from '~/api/common'
import fetchStory from '~/api/story'
import { CompactListItem } from '~/components/CompactList'
import { ignoreAbortError } from '~/fns'

interface CommentProps {
  comment: CommentTree
}

function Comment({ comment }: CommentProps) {
  const childComments = comment.comments

  return (
    <>
      <ListItem>
        <ListItemContent>
          <Typography level="body3" sx={{ fontWeight: 'lg', mb: 1 }}>
            {comment.by}
          </Typography>
          <Box
            sx={(theme) => {
              const { body2, body3, body4 } = theme.typography
              return {
                ...body2,
                '& a': body3,
                '& pre': {
                  overflowX: 'auto',
                  backgroundColor: theme.palette.neutral.softBg,
                },
                '& code': { ...body4, fontFamily: 'monospace' },
              }
            }}
            dangerouslySetInnerHTML={{ __html: comment.text }}
          />
        </ListItemContent>
      </ListItem>
      {childComments.length < 1 ? null : (
        <ListItem nested>
          <List>
            {childComments.map((childComment) => (
              <Comment key={childComment.id} comment={childComment} />
            ))}
          </List>
        </ListItem>
      )}
    </>
  )
}

export default function Story() {
  const { id } = useParams()
  const [story, setStory] = useState<Story>()
  const [comments, setComments] = useState<CommentTree[]>()

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

  useEffect(() => {
    if (!story) return

    let aborted = false
    const aborter = new AbortController()

    fetchComments(story, aborter)
      .then((comments) => {
        if (!aborted) {
          setComments(comments)
        }
      })
      .catch(ignoreAbortError)

    return () => {
      aborted = true
      aborter.abort()
    }
  }, [story])

  if (!story) return <LinearProgress />

  const commentsList = comments?.map((comment) => (
    <Comment key={comment.id} comment={comment} />
  )) ?? <CircularProgress />

  return (
    <Container maxWidth="md">
      <Stack sx={{ mt: 2, gap: 2 }}>
        <List
          size="sm"
          sx={{
            '--List-nestedInsetStart': {
              xs: '1rem',
              sm: '2rem',
            },
          }}
        >
          <CompactListItem story={story} />
          {commentsList}
        </List>
      </Stack>
    </Container>
  )
}
