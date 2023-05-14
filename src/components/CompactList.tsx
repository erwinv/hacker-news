import { ModeCommentOutlined } from '@mui/icons-material'
import {
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Typography,
} from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import { TopStory } from '~/api/common'
import { extractSite } from '~/fns'
import SiteSubmissionsLink from './SiteSubmissionsLink'
import UserLink from './UserLink'

interface StoryListItemProps {
  story: TopStory
  number?: number
  disableNav?: boolean
}

function StoryListItem({ story, number = NaN, disableNav = false }: StoryListItemProps) {
  const navigate = useNavigate()
  const site = story.url && extractSite(story.url)

  const discussionButton =
    story.type !== 'story' ? null : (
      <Button
        variant="plain"
        color="neutral"
        startDecorator={<ModeCommentOutlined />}
        onClick={() => {
          if (!disableNav) {
            navigate(`${story.id}`)
          }
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
            if (!disableNav) {
              navigate(`${story.id}`)
            }
          }
        }}
        sx={{ alignItems: 'start' }}
      >
        {Number.isNaN(number) ? null : (
          <Typography level="body3" sx={{ mt: 0.5, mr: 3 }}>
            {number}.
          </Typography>
        )}
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

interface StoryListProps {
  stories?: TopStory[]
  numbered?: boolean
}

export default function StoryList({ stories, numbered = false }: StoryListProps) {
  if (!stories) return <LinearProgress color="neutral" />

  return (
    <List>
      {stories.map((story, i) => (
        <StoryListItem key={story.id} story={story} number={numbered ? i + 1 : undefined} />
      ))}
    </List>
  )
}
