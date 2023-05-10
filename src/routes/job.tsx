import { Container, LinearProgress, List, ListItem, ListItemContent, Stack } from '@mui/joy'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Job } from '~/api/common'
import fetchJob from '~/api/job'
import { CompactListItem } from '~/components/CompactList'
import { ignoreAbortError } from '~/fns'

interface JobDescriptionProps {
  job: Job
}

export function JobDescription({ job }: JobDescriptionProps) {
  return (
    <ListItem>
      <ListItemContent
        sx={(theme) => {
          const { body1, body2, body3 } = theme.typography
          return {
            ...body1,
            '& a': body2,
            '& pre': {
              overflowX: 'auto',
              backgroundColor: theme.palette.neutral.softBg,
            },
            '& code': { ...body3, fontFamily: 'monospace' },
          }
        }}
        dangerouslySetInnerHTML={{ __html: job.text ?? '' }}
      />
    </ListItem>
  )
}

export default function Job() {
  const { id } = useParams()
  const [job, setJob] = useState<Job>()

  useEffect(() => {
    const jobId = Number(id)
    if (!Number.isFinite(jobId)) return

    let aborted = false
    const aborter = new AbortController()

    fetchJob(jobId, aborter)
      .then((job) => {
        if (!aborted) {
          setJob(job)
        }
      })
      .catch(ignoreAbortError)

    return () => {
      aborted = true
      aborter.abort()
    }
  }, [id])

  if (!job) return <LinearProgress />

  return (
    <Container maxWidth="md">
      <Stack sx={{ mt: 2, gap: 2 }}>
        <List size="sm">
          <CompactListItem story={job} />
          <JobDescription job={job} />
        </List>
      </Stack>
    </Container>
  )
}
