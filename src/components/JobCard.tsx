import { Card, CardContent, CardOverflow, Divider, Link, Stack, Typography } from '@mui/joy'
import { Job } from '~/api/common'
import InlineHtmlText from './InlineHtmlText'

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Card variant="outlined">
      <Typography level="h2" sx={{ fontSize: 'md' }}>
        <Link href={job.url} overlay underline="none" target="_blank" rel="noopener">
          {job.title}
        </Link>
      </Typography>

      <CardContent sx={{ py: 1 }}>
        {!job.text ? null : (
          <>
            <Divider inset="context" sx={{ mb: 1 }} />
            <InlineHtmlText text={job.text} />
          </>
        )}
      </CardContent>

      <Divider />
      <CardOverflow variant="soft" sx={{ py: 1.5, bgcolor: 'background.level1' }}>
        <Stack direction="row" sx={{ gap: 1 }}>
          <Typography level="body3">{job.by}</Typography>
          <Divider orientation="vertical" />
          <Typography level="body3" sx={{ fontWeight: 'md', color: 'text.secondary' }}>
            {job.score} points
          </Typography>
        </Stack>
      </CardOverflow>
    </Card>
  )
}
