import { CircularProgress, Container, LinearProgress, List, Stack } from '@mui/joy'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import fetchCommentTrees, { CommentTree } from '~/api/comments'
import { Story } from '~/api/common'
import fetchStory from '~/api/story'
import CommentThread from '~/components/CommentThread'
import { CompactListItem } from '~/components/CompactList'
import { ignoreAbortError } from '~/fns'

interface StoryCommentsProps {
  story: Story
}

export function StoryComments({ story }: StoryCommentsProps) {
  const [comments, setComments] = useState<CommentTree[]>()

  useEffect(() => {
    if (!story) return

    let aborted = false
    const aborter = new AbortController()

    fetchCommentTrees(story, aborter)
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

  if (!comments) return <CircularProgress />

  return (
    <>
      {comments.map((comment) => <CommentThread key={comment.id} commentTree={comment} />) ?? (
        <CircularProgress />
      )}
    </>
  )
}

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

  if (!story) return <LinearProgress />

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
          <StoryComments story={story} />
        </List>
      </Stack>
    </Container>
  )
}
