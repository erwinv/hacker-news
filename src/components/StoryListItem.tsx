import { ModeCommentOutlined, TrendingUp } from '@mui/icons-material'
import {
  Button,
  Link,
  ListItem,
  ListItemButton,
  ListItemContent,
  Tooltip,
  Typography,
} from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import { Job, Story, isJob } from '~/api/hackerNews'
import useStoryKind from '~/contexts/hooks/useStoryKind'
import { extractSite, toTime } from '~/fns'
import SiteSubmissionsLink from './SiteSubmissionsLink'
import UserLink from './UserLink'

interface StoryListItemProps {
  story: Story | Job
}

export function StoryListItem({ story }: StoryListItemProps) {
  const kind = useStoryKind()
  const navigate = useNavigate()
  const site = story.url && extractSite(story.url)

  const discussionButton = isJob(story) ? null : (
    <Button
      variant="plain"
      startDecorator={<ModeCommentOutlined />}
      onClick={() => {
        navigate(`/item/${story.id}?list=${kind}`)
      }}
    >
      <Typography level="body3" sx={{ display: 'inline-block', width: '16px' }}>
        {story.descendants}
      </Typography>
    </Button>
  )

  const submittedBy = isJob(story) ? null : <UserLink username={story.by} />
  const score = isJob(story) ? null : (
    <Tooltip title={`${story.score} points`}>
      <Typography startDecorator={<TrendingUp />} sx={{ px: 1 }}>
        {story.score}
      </Typography>
    </Tooltip>
  )

  const time = toTime(story.time)
  const timestamp = (
    <Tooltip title={time.format()}>
      <Typography>{time.fromNow()}</Typography>
    </Tooltip>
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
        <ListItemContent sx={{ pr: 4 }}>
          <Typography level="body2">
            <Link
              color="neutral"
              variant="plain"
              href={story.url}
              target="_blank"
              rel="noopener"
              onClick={(e) => {
                if (story.url) {
                  e.stopPropagation()
                }
              }}
              sx={(theme) => ({
                p: 0,
                mr: site ? 1 : 0,
                fontWeight: 'lg',
                '&:visited': {
                  color: theme.palette.neutral.solidDisabledColor,
                  [theme.getColorSchemeSelector('dark')]: {
                    color: theme.palette.neutral.solidBg,
                  },
                },
              })}
            >
              {story.title}
            </Link>
            {!site ? null : <SiteSubmissionsLink site={site} />}
          </Typography>
          <Typography level="body3">
            {submittedBy}
            {score}
            {timestamp}
          </Typography>
        </ListItemContent>
      </ListItemButton>
    </ListItem>
  )
}
