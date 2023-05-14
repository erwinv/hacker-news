import { ListItem, ListItemButton } from '@mui/joy'
import StoryList from '~/components/StoryList'
import useNewStories from '~/contexts/hooks/stories'

export default function NewStories() {
  const { newStories, hasMore, more } = useNewStories()

  return (
    <StoryList stories={newStories}>
      {!hasMore ? null : (
        <ListItem>
          <ListItemButton onClick={more}>More</ListItemButton>
        </ListItem>
      )}
    </StoryList>
  )
}
