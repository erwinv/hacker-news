import { Card, CardOverflow, Divider, Link, Stack, Typography } from '@mui/joy'
import { Story } from '~/api/common'
import InlineHtmlText from './InlineHtmlText'
import UserLink from './UserLink'

interface StoryCardProps {
  story: Story
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <Card variant="outlined">
      <Typography level="h2" sx={{ fontSize: 'md', mb: 1 }}>
        <Link
          href={story.url}
          overlay
          underline="none"
          target="_blank"
          rel="noopener"
          sx={(theme) => ({
            '&:visited': {
              color: theme.palette.primary.solidActiveBg,
            },
          })}
        >
          {story.title}
        </Link>
      </Typography>
      {!story.text ? null : (
        <>
          <Divider inset="context" sx={{ my: 1 }} />
          <InlineHtmlText text={story.text} />
        </>
      )}

      <Divider sx={{ mt: 1.5 }} />
      <CardOverflow variant="soft" sx={{ py: 1.5, bgcolor: 'background.level1' }}>
        <Stack direction="row" sx={{ gap: 1 }}>
          <Typography level="body3">
            <UserLink username={story.by} />
          </Typography>
          <Divider orientation="vertical" />
          <Typography level="body3" sx={{ fontWeight: 'md', color: 'text.secondary' }}>
            {story.descendants} comments
          </Typography>
          <Divider orientation="vertical" />
          <Typography level="body3" sx={{ fontWeight: 'md', color: 'text.secondary' }}>
            {story.score} points
          </Typography>
        </Stack>
      </CardOverflow>
    </Card>
  )
}
