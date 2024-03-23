import { Box, Container, LinearProgress, List } from '@mui/joy'
import { useMediaQuery } from '@mui/system'
import { useEffect } from 'react'
import { Job, Story, isJob } from '~/api/hackerNews'
import { JobCard } from '~/components/JobCard'
import { StoryCard } from '~/components/StoryCard'
import { StoryListItem } from '~/components/StoryListItem'
import { useStories } from '~/contexts/hooks/useStories'
import { useStoryKind } from '~/contexts/hooks/useStoryKind'
import { useStoryListItemIds } from '~/contexts/hooks/useStoryListItemIds'
import { theme } from '~/theme'

export function Stories() {
  const kind = useStoryKind()
  const { storyIds } = useStoryListItemIds(kind)
  const { stories, loaded, total } = useStories(storyIds, 40)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => console.debug(loaded, '/', total), [loaded, total])
  if (!stories) return <LinearProgress />

  return isMobile ? <StoryList stories={stories} /> : <StoryCards stories={stories} />
}

interface StoriesProps {
  stories: Array<Story | Job>
}

function StoryList({ stories }: StoriesProps) {
  return <List>
    {stories.map(story => <StoryListItem key={story.id} story={story} />)}
  </List>
}

function StoryCards({ stories }: StoriesProps) {
  return <Container>
    <Box sx={{
      py: 2,
      display: 'grid',
      gap: 2,
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    }}>
      {stories.map(story =>
        isJob(story) ?
          <JobCard key={story.id} job={story} />
          : <StoryCard key={story.id} story={story} reload={() => { }} />

      )}
    </Box>
  </Container>
}
