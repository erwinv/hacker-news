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
import { Job } from '~/api/hackerNews'
import InlineHtmlText from '~/components/InlineHtmlText'
import { toTime } from '~/fns'

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  const time = toTime(job.time)

  return (
    <Card variant="outlined">
      <Typography level="h2" sx={{ fontSize: 'lg' }}>
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
            <Typography level="body2" sx={{ fontWeight: 'md' }}>
              {time.fromNow()}
            </Typography>
          </Tooltip>
        </Stack>
      </CardOverflow>
    </Card>
  )
}
