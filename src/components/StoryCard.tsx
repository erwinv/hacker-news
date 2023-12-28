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
  commentCount?: 'child' | 'total'
}

export default function StoryCard({ story, reload, commentCount = 'child' }: StoryCardProps) {
  const site = story.url && extractSite(story.url)
  const time = toTime(story.time)

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <Typography level="h2" fontSize="lg">
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
      <CardOverflow>
        <Stack direction="row" sx={{ py: 1.5, gap: 2, alignItems: 'center' }}>
          <Typography level="body-sm">
            <UserLink username={story.by} />
          </Typography>

          <Typography level="body-sm">{story.score} points</Typography>

          <Tooltip title={time.format()}>
            <Typography level="body-sm">{time.fromNow()}</Typography>
          </Tooltip>

          <Link level="body-sm" onClick={reload}>
            {commentCount === 'total' ? story.descendants : story.kids?.length ?? 0} comments
          </Link>
        </Stack>
      </CardOverflow>
    </Card>
  )
}
