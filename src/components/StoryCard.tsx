import { Refresh } from '@mui/icons-material'
import {
  Card,
  CardContent,
  CardOverflow,
  Divider,
  Link,
  Stack,
  Tooltip,
  Typography,
} from '@mui/joy'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useNavigate } from 'react-router-dom'
import { Story } from '~/api/common'
import { extractSite } from '~/fns'
import InlineHtmlText from './InlineHtmlText'
import SiteSubmissionsLink from './SiteSubmissionsLink'
import UserLink from './UserLink'

dayjs.extend(relativeTime)

interface StoryCardProps {
  story: Story
}

export default function StoryCard({ story }: StoryCardProps) {
  const navigate = useNavigate()
  const site = story.url && extractSite(story.url)
  const time = dayjs(story.time * 1000)

  return (
    <Card variant="outlined">
      <Typography level="h2" sx={{ fontSize: 'md' }}>
        <Link
          href={story.url}
          overlay
          underline="none"
          target="_blank"
          rel="noopener"
          color="neutral"
          sx={{ mr: site ? 1 : 0 }}
        >
          {story.title}
        </Link>
        {!site ? null : <SiteSubmissionsLink site={site} />}
      </Typography>

      <CardContent sx={{ py: 1 }}>
        {!story.text ? null : (
          <>
            <Divider inset="context" sx={{ mb: 1 }} />
            <InlineHtmlText text={story.text} />
          </>
        )}
      </CardContent>

      <Divider />
      <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
        <Stack direction="row" sx={{ py: 1.5, gap: 1, alignItems: 'center' }}>
          <Typography level="body3">
            <UserLink username={story.by} />
          </Typography>

          <Divider orientation="vertical" />
          <Typography level="body3" sx={{ fontWeight: 'md', color: 'text.secondary' }}>
            {story.score} points
          </Typography>

          <Divider orientation="vertical" />
          <Tooltip title={time.format()}>
            <Typography level="body3" sx={{ fontWeight: 'md', color: 'text.secondary' }}>
              {time.fromNow()}
            </Typography>
          </Tooltip>

          <Divider orientation="vertical" />
          <Link
            level="body3"
            sx={{ fontWeight: 'md', color: 'text.secondary' }}
            endDecorator={<Refresh />}
            onClick={() => {
              navigate(0)
            }}
          >
            {story.descendants} comments
          </Link>
        </Stack>
      </CardOverflow>
    </Card>
  )
}
