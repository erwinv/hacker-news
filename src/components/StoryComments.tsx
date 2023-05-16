import { CircularProgress, List, ListDivider, ListItem } from '@mui/joy'
import { Fragment, useEffect, useState } from 'react'
import fetchCommentTrees from '~/api/comments'
import { CommentTree, Story } from '~/api/common'
import CommentThread from '~/components/CommentThread'
import { ignoreAbortError } from '~/fns'

interface StoryCommentsProps {
  story: Story
}

export default function StoryComments({ story }: StoryCommentsProps) {
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

  return (
    <List
      sx={{
        '--List-nestedInsetStart': {
          xs: '1rem',
          sm: '2rem',
        },
      }}
    >
      {!comments ? (
        <ListItem>
          <CircularProgress color="neutral" />
        </ListItem>
      ) : (
        comments.map((comment, i) => (
          <Fragment key={comment.id}>
            {i === 0 ? null : <ListDivider inset="gutter" />}
            <CommentThread commentTree={comment} />
          </Fragment>
        ))
      )}
    </List>
  )
}
