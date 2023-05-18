import { Card, CardOverflow, Divider, Link, Stack, Typography } from '@mui/joy'
import { Job } from '~/api/common'
import InlineHtmlText from './InlineHtmlText'

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Card variant="outlined">
      <Typography level="h2" sx={{ fontSize: 'md', mb: 1 }}>
        <Link href={job.url} overlay underline="none" target="_blank" rel="noopener">
          {job.title}
        </Link>
      </Typography>
      {!job.text ? null : (
        <>
          <Divider inset="context" sx={{ my: 1 }} />
          <InlineHtmlText text={job.text} />
        </>
      )}

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
