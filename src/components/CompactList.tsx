import { ArrowUpward, ArticleOutlined, ModeCommentOutlined, WorkOutline } from '@mui/icons-material'
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Stack,
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
  const site = story.url && extractSite(story.url)

  const upvoteStory = () => {
    window.location.href = `https://news.ycombinator.com/vote?id=${story.id}&how=up&goto=news`
  }

  const scoreAndUpvoteButton = (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      width={{ xs: '4rem', sm: '8rem' }}
      sx={{ alignItems: 'center', justifyContent: 'space-between' }}
    >
      <IconButton
        variant="plain"
        color="neutral"
        onClick={(ev) => {
          ev.stopPropagation()
          ev.preventDefault()
          upvoteStory()
        }}
      >
        <ArrowUpward />
      </IconButton>
      <Typography level="body2" sx={{ mx: 'auto', fontWeight: 'lg' }}>
        {story.score}
      </Typography>
      <IconButton
        variant="plain"
        size="lg"
        color="neutral"
        sx={{ display: { xs: 'none', sm: 'block' } }}
      >
        {story.type === 'story' ? <ArticleOutlined /> : <WorkOutline />}
      </IconButton>
    </Stack>
  )

  const commentsButton =
    story.type !== 'story' ? null : (
      <Button
        variant="plain"
        color="neutral"
        startDecorator={<ModeCommentOutlined />}
        onClick={() => {
          navigate(`/story/${story.id}`)
        }}
      >
        <Typography level="body3" sx={{ display: 'inline-block', width: '16px' }}>
          {story.descendants}
        </Typography>
      </Button>
    )

  return (
    <ListItem endAction={commentsButton}>
      <ListItemButton
        onClick={() => {
          if (story.url) {
            window.location.href = story.url
          } else {
            navigate(`/${story.type}/${story.id}`)
          }
        }}
      >
        <ListItemDecorator>{scoreAndUpvoteButton}</ListItemDecorator>
        <ListItemContent sx={{ pr: 6 }}>
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
  stories: TopStory[]
}

export default function CompactList({ stories }: CompactListProps) {
  return (
    <List
      sx={{
        '--ListItemDecorator-size': {
          xs: '4rem',
          sm: '8rem',
        },
      }}
    >
      {stories.map((story) => (
        <CompactListItem key={story.id} story={story} />
      ))}
    </List>
  )
}
