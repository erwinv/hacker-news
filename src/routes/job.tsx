import { Box, LinearProgress } from '@mui/joy'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Job } from '~/api/common'
import fetchJob from '~/api/job'
import JobCard from '~/components/JobCard'
import { ignoreAbortError } from '~/fns'

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

  if (!job) return <LinearProgress color="neutral" />

  return (
    <Box sx={{ px: 1.5 }}>
      <JobCard job={job} />
    </Box>
  )
}
