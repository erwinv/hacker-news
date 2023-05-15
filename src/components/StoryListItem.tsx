import { ModeCommentOutlined } from '@mui/icons-material'
import { Button, ListItem, ListItemButton, ListItemContent, Typography } from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import { Job, Story, isJob } from '~/api/common'
import { extractSite } from '~/fns'
import SiteSubmissionsLink from './SiteSubmissionsLink'
import UserLink from './UserLink'

interface StoryListItemProps {
  story: Story | Job
}

export function StoryListItem({ story }: StoryListItemProps) {
  const navigate = useNavigate()
  const site = story.url && extractSite(story.url)

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
    <ListItem endAction={discussionButton}>
      <ListItemButton
        onClick={() => {
          if (story.url) {
            window.open(story.url, '_blank', 'noopener')
          } else {
            navigate(`${story.id}`)
          }
        }}
        sx={{ alignItems: 'start' }}
      >
        <ListItemContent sx={{ pr: 4 }}>
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
