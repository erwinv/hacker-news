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
import { Story } from '~/api/hackerNews'
import InlineHtmlText from '~/components/InlineHtmlText'
import SiteSubmissionsLink from '~/components/SiteSubmissionsLink'
import UserLink from '~/components/UserLink'
import { extractSite, toTime } from '~/fns'

interface StoryCardProps {
  story: Story
  reload: () => void
}

export default function StoryCard({ story, reload }: StoryCardProps) {
  const site = story.url && extractSite(story.url)
  const time = toTime(story.time)

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <Typography level="h2" sx={{ fontSize: 'md' }}>
        <Link
          href={story.url}
          overlay
          underline="none"
          target="_blank"
          rel="noopener"
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
            onClick={reload}
          >
            {/* {story.descendants} comments */}
            {story.kids?.length ?? 0} comments
          </Link>
        </Stack>
      </CardOverflow>
    </Card>
  )
}
