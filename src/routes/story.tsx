import {
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
import fetchStory, { StoryWithComments } from '~/api/story'
import { ignoreAbortError } from '~/fns'

export default function Story() {
  const { id } = useParams()
  const [story, setStory] = useState<StoryWithComments>()

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
        <Typography level="h3">{story.title}</Typography>
        <List>
          {story.comments.map((comment, i) => (
            <Fragment key={comment.id}>
              {i === 0 ? null : <ListDivider />}
              <ListItem>
                <ListItemContent
                  sx={(theme) => {
                    const typographyLevel = theme.typography.body1
                    return {
                      ...typographyLevel,
                      '& a': typographyLevel,
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: comment.text }}
                />
              </ListItem>
            </Fragment>
          ))}
        </List>
      </Stack>
    </Container>
  )
}
