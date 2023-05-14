import { Box, CircularProgress, LinearProgress, List, ListDivider } from '@mui/joy'
import { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import fetchCommentTrees, { CommentTree } from '~/api/comments'
import { Story } from '~/api/common'
import fetchStory from '~/api/story'
import CommentThread from '~/components/CommentThread'
import StoryCard from '~/components/StoryCard'
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

    fetchCommentTrees(story, aborter, 10)
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

  if (!comments) return <CircularProgress color="neutral" />

  return (
    <List
      sx={{
        '--List-nestedInsetStart': {
          xs: '1rem',
          sm: '2rem',
        },
      }}
    >
      {comments.map((comment, i) => (
        <Fragment key={comment.id}>
          {i === 0 ? null : <ListDivider inset="gutter" />}
          <CommentThread commentTree={comment} />
        </Fragment>
      ))}
    </List>
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
    <>
      <Box sx={{ px: 1.5 }}>
        <StoryCard story={story} />
      </Box>
      <StoryComments story={story} />
    </>
  )
}
