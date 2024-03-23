import { ModeCommentOutlined } from '@mui/icons-material'
import {
  Badge,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemContent
} from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import { Job, Story, isJob } from '~/api/hackerNews'
import { useStoryKind } from '~/contexts/hooks/useStoryKind'
import { StoryView } from './StoryView'

interface StoryListItemProps {
  story: Story | Job
}

export function StoryListItem({ story }: StoryListItemProps) {
  const kind = useStoryKind()
  const navigate = useNavigate()

  const discussionButton = isJob(story) ? null : (
    <IconButton
      variant="plain"
      onClick={() => {
        navigate(`/item/${story.id}?list=${kind}`)
      }}
    >
      <Badge
        badgeContent={story.descendants}
        max={999}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        badgeInset="-15%"
      >
        <ModeCommentOutlined />
      </Badge>
    </IconButton>
  )

  return (
    <ListItem endAction={discussionButton}>
      <ListItemButton
        onClick={() => {
          if (story.url) {
            window.open(story.url, '_blank', 'noopener')
          } else {
            navigate(`/item/${story.id}?list=${kind}`)
          }
        }}
        sx={{ alignItems: 'start' }}
      >
        <ListItemContent sx={{ pr: 2 }}>
          <StoryView story={story} />
        </ListItemContent>
      </ListItemButton>
    </ListItem>
  )
}
