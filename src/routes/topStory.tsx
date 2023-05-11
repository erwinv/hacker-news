import { Container, LinearProgress, List, Stack } from '@mui/joy'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { TopStory, isJob } from '~/api/common'
import fetchStory from '~/api/story'
import { CompactListItem } from '~/components/CompactList'
import { ignoreAbortError } from '~/fns'
import { JobDescription } from './job'
import { StoryComments } from './story'

export default function TopStory() {
  const { id } = useParams()
  const [topStory, setTopStory] = useState<TopStory>()

  useEffect(() => {
    const storyId = Number(id)
    if (!Number.isFinite(storyId)) return

    let aborted = false
    const aborter = new AbortController()

    fetchStory(storyId, aborter)
      .then((story) => {
        if (!aborted) {
          setTopStory(story)
        }
      })
      .catch(ignoreAbortError)

    return () => {
      aborted = true
      aborter.abort()
    }
  }, [id])

  if (!topStory) return <LinearProgress />

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
          <CompactListItem story={topStory} disableNav />
          {isJob(topStory) ? <JobDescription job={topStory} /> : <StoryComments story={topStory} />}
        </List>
      </Stack>
    </Container>
  )
}
