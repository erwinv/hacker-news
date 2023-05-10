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
import { useLocation, useNavigate } from 'react-router-dom'
import { TopStory } from '~/api/common'
import { extractSite } from '~/fns'
import SiteSubmissionsLink from './SiteSubmissionsLink'
import UserLink from './UserLink'

interface CompactListItemProps {
  story: TopStory
  number?: number
}

export function CompactListItem({ story, number = NaN }: CompactListItemProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const site = story.url && extractSite(story.url)
  const storyRoute = `story/${story.id}`

  const goToCommentsButton =
    story.type !== 'story' ? null : (
      <Button
        variant="plain"
        color="neutral"
        startDecorator={<ModeCommentOutlined />}
        disabled={location.pathname.endsWith(storyRoute)}
        onClick={() => {
          navigate(storyRoute)
        }}
      >
        <Typography level="body3" sx={{ display: 'inline-block', width: '16px' }}>
          {story.descendants}
        </Typography>
      </Button>
    )

  return (
    <ListItem endAction={goToCommentsButton}>
      <ListItemButton
        onClick={() => {
          if (story.url) {
            window.open(story.url, '_blank')
          } else {
            navigate(`/${story.type}/${story.id}`)
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
            Posted by <UserLink username={story.by} />
          </Typography>
        </ListItemContent>
      </ListItemButton>
    </ListItem>
  )
}

interface CompactListProps {
  stories?: TopStory[]
  numbered?: boolean
}

export default function CompactList({ stories, numbered = false }: CompactListProps) {
  if (!stories) return <LinearProgress />

  return (
    <List>
      {stories.map((story, i) => (
        <CompactListItem key={story.id} story={story} number={numbered ? i + 1 : undefined} />
      ))}
    </List>
  )
}
