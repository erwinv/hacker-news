import { ArrowUpward, ArticleOutlined, ModeCommentOutlined, WorkOutline } from '@mui/icons-material'
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Typography,
} from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import { TopStory } from '~/api/common'
import { extractSite } from '~/fns'
import SiteSubmissionsLink from './SiteSubmissionsLink'
import UserLink from './UserLink'

interface CompactListItemProps {
  story: TopStory
}

function CompactListItem({ story }: CompactListItemProps) {
  const navigate = useNavigate()
  const site = extractSite(story.url)

  const commentsButton =
    story.type !== 'story' ? null : (
      <Button
        variant="plain"
        color="neutral"
        startDecorator={<ModeCommentOutlined />}
        onClick={() => {
          navigate(`/story/${story.id}`)
        }}
        sx={{ width: 80, justifyContent: 'start' }}
      >
        <Typography level="body3">{story.descendants}</Typography>
      </Button>
    )

  return (
    <ListItem endAction={commentsButton}>
      <ListItemButton
        onClick={() => {
          window.location.href = story.url
        }}
      >
        <ListItemDecorator>
          <IconButton variant="plain" color="neutral" disabled>
            <ArrowUpward />
          </IconButton>
          <Typography level="body2" sx={{ mx: 'auto', fontWeight: 'lg' }}>
            {story.score}
          </Typography>
          <IconButton variant="plain" size="lg" color="neutral">
            {story.type === 'story' ? <ArticleOutlined /> : <WorkOutline />}
          </IconButton>
        </ListItemDecorator>
        <ListItemContent sx={{ pr: 6 }}>
          <Typography level="body2" variant="plain" color="neutral" sx={{ fontWeight: 'lg' }}>
            {story.title}
            <SiteSubmissionsLink site={site} />
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
  stories: TopStory[]
}

export default function CompactList({ stories }: CompactListProps) {
  return (
    <List
      sx={{
        '--ListItemDecorator-size': '8rem',
      }}
    >
      {stories.map((story) => (
        <CompactListItem key={story.id} story={story} />
      ))}
    </List>
  )
}
