import { ModeCommentOutlined, TrendingUp } from '@mui/icons-material'
import {
  Badge,
  IconButton,
  Link,
  ListItem,
  ListItemButton,
  ListItemContent,
  Tooltip,
  Typography,
} from '@mui/joy'
import { useNavigate } from 'react-router-dom'
import { Job, Story, isJob } from '~/api/hackerNews'
import SiteSubmissionsLink from '~/components/SiteSubmissionsLink'
import UserLink from '~/components/UserLink'
import useStoryKind from '~/contexts/hooks/useStoryKind'
import { extractSite, toTime } from '~/fns'

interface StoryListItemProps {
  story: Story | Job
}

export function StoryListItem({ story }: StoryListItemProps) {
  const kind = useStoryKind()
  const navigate = useNavigate()
  const site = story.url && extractSite(story.url)

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
        <ListItemContent sx={{ pr: 2 }}>
          <Typography>
            <Link
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
          <Typography level="body-sm">
            {submittedBy}
            {score}
            {timestamp}
          </Typography>
        </ListItemContent>
      </ListItemButton>
    </ListItem>
  )
}
