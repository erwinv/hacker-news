import {
  CircularProgress,
  Container,
  LinearProgress,
  List,
  ListDivider,
  ListItem,
  ListItemContent,
  Stack,
  Typography,
} from '@mui/joy'
import { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import fetchComments, { CommentTree } from '~/api/comments'
import { Story } from '~/api/common'
import fetchStory from '~/api/story'
import { ignoreAbortError } from '~/fns'

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

  return (
    <Container maxWidth="md">
      <Stack sx={{ mt: 2, gap: 2 }}>
        <Typography level="h3">{story.title}</Typography>
        <List>
          {!comments ? (
            <CircularProgress />
          ) : (
            comments.map((comment, i) => (
              <Fragment key={comment.id}>
                {i === 0 ? null : <ListDivider />}
                <ListItem>
                  <ListItemContent
                    sx={(theme) => {
                      const { body1, body2, body3 } = theme.typography
                      return {
                        ...body1,
                        '& a': body2,
                        '& pre': {
                          overflowX: 'auto',
                          backgroundColor: theme.palette.neutral.softBg,
                        },
                        '& code': { ...body3, fontFamily: 'monospace' },
                      }
                    }}
                    dangerouslySetInnerHTML={{ __html: comment.text }}
                  />
                </ListItem>
              </Fragment>
            ))
          )}
        </List>
      </Stack>
    </Container>
  )
}
