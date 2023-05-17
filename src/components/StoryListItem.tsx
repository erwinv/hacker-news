import { ModeCommentOutlined, Refresh } from '@mui/icons-material'
import {
  Button,
  CircularProgress,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemContent,
  Typography,
} from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import { Job, Story, isJob } from '~/api/common'
import { extractSite } from '~/fns'
import SiteSubmissionsLink from './SiteSubmissionsLink'
import UserLink from './UserLink'

interface StoryListItemProps {
  story: Story | Job
  reload?: () => void
  isReloading?: boolean
}

export function StoryListItem({ story, reload, isReloading = false }: StoryListItemProps) {
  const navigate = useNavigate()
  const site = story.url && extractSite(story.url)

  const reloadButton = (
    <IconButton variant="plain" color="neutral" onClick={reload}>
      {isReloading ? <CircularProgress size="sm" color="neutral" /> : <Refresh />}
    </IconButton>
  )

  const discussionButton = isJob(story) ? null : (
    <Button
      variant="plain"
      color="neutral"
      startDecorator={<ModeCommentOutlined />}
      onClick={() => {
        navigate(`${story.id}`)
      }}
    >
      <Typography level="body3" sx={{ display: 'inline-block', width: '16px' }}>
        {story.descendants}
      </Typography>
    </Button>
  )

  return (
    <ListItem
      startAction={reloadButton}
      endAction={discussionButton}
      sx={{
        '.MuiListItem-startAction': {
          display: isReloading ? 'inherit' : 'none',
        },
        '&:hover': {
          '.MuiListItem-startAction': {
            display: 'inherit',
          },
        },
      }}
    >
      <ListItemButton
        variant={isReloading ? 'soft' : 'plain'}
        color={isReloading ? 'warning' : 'neutral'}
        onClick={() => {
          if (story.url) {
            window.open(story.url, '_blank', 'noopener')
          } else {
            navigate(`${story.id}`)
          }
        }}
        sx={{ alignItems: 'start' }}
      >
        <ListItemContent sx={{ pl: 1, pr: 4 }}>
          <Typography level="body2" variant="plain" color="neutral" sx={{ fontWeight: 'lg' }}>
            {story.title}
            {!site ? null : <SiteSubmissionsLink site={site} />}
          </Typography>
          <Typography level="body3">
            <UserLink username={story.by} />
          </Typography>
        </ListItemContent>
      </ListItemButton>
    </ListItem>
  )
}
