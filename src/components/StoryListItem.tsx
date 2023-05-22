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
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useLocation, useNavigate } from 'react-router-dom'
import { Job, Story, isJob } from '~/api/common'
import { extractSite } from '~/fns'
import SiteSubmissionsLink from './SiteSubmissionsLink'
import UserLink from './UserLink'

dayjs.extend(relativeTime)

interface StoryListItemProps {
  story: Story | Job
}

export function StoryListItem({ story }: StoryListItemProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const site = story.url && extractSite(story.url)

  const [, list, kind] = pathname.split('/')

  const discussionButton = isJob(story) ? null : (
    <Button
      variant="plain"
      startDecorator={<ModeCommentOutlined />}
      onClick={() => {
        navigate(`/item/${story.id}?${list}=${kind}`)
      }}
    >
      <Typography level="body3" sx={{ display: 'inline-block', width: '16px' }}>
        {story.descendants}
      </Typography>
    </Button>
  )

  const time = dayjs(story.time * 1000)

  return (
    <ListItem endAction={discussionButton}>
      <ListItemButton
        onClick={() => {
          if (story.url) {
            window.open(story.url, '_blank', 'noopener')
          } else {
            navigate(`/item/${story.id}?${list}=${kind}`)
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
            <UserLink username={story.by} />
            <Tooltip title={`${story.score} points`}>
              <Typography startDecorator={<TrendingUp />} sx={{ px: 1 }}>
                {story.score}
              </Typography>
            </Tooltip>
            <Tooltip title={time.format()}>
              <Typography>{time.fromNow()}</Typography>
            </Tooltip>
          </Typography>
        </ListItemContent>
      </ListItemButton>
    </ListItem>
  )
}
