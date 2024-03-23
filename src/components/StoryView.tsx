import { TrendingUp } from '@mui/icons-material'
import { Link, Tooltip, Typography } from '@mui/joy'
import { Job, Story, isJob } from '~/api/hackerNews'
import { extractSite, toTime } from '~/fns'
import { SiteSubmissionsLink } from './SiteSubmissionsLink'
import { UserLink } from './UserLink'

interface StoryViewProps {
  story: Story | Job
}

export function StoryView({ story }: StoryViewProps) {
  const site = story.url && extractSite(story.url)
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
    <>
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
    </>
  )
}