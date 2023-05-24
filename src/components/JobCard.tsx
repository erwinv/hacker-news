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
import { Job } from '~/api/common'
import { toTime } from '~/fns'
import InlineHtmlText from './InlineHtmlText'

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  const time = toTime(job.time)

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
      <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
        <Stack direction="row" sx={{ py: 1.5, gap: 1, alignItems: 'center' }}>
          <Tooltip title={time.format()}>
            <Typography level="body3" sx={{ fontWeight: 'md', color: 'text.secondary' }}>
              {time.fromNow()}
            </Typography>
          </Tooltip>
        </Stack>
      </CardOverflow>
    </Card>
  )
}
