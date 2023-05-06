import { Container, LinearProgress, Stack, Typography } from '@mui/joy'
import { useEffect, useState } from 'react'
import { TopStory } from '~/api/common'
import fetchTopStories from '~/api/top-stories'
import CompactList from '~/components/CompactList'
import { ignoreAbortError } from '~/fns'

export default function TopStories() {
  const [topStories, setTopStories] = useState<TopStory[]>()

  useEffect(() => {
    let aborted = false
    const aborter = new AbortController()

    fetchTopStories(30, aborter)
      .then((stories) => {
        if (!aborted) {
          setTopStories(stories)
        }
      })
      .catch(ignoreAbortError)

    return () => {
      aborted = true
      aborter.abort()
    }
  }, [])

  return (
    <>
      {!topStories ? <LinearProgress /> : null}
      <Container maxWidth="md">
        <Stack sx={{ m: 2 }}>
          <Typography level="h2">Top Stories</Typography>
          {!topStories ? null : <CompactList stories={topStories} />}
        </Stack>
      </Container>
    </>
  )
}
