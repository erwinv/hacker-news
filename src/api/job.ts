import { ItemId, Job, fetchOrGetItemFromDB } from '~/api/common'

export default async function fetchJob(id: ItemId, aborter?: AbortController): Promise<Job> {
  const job = (await fetchOrGetItemFromDB(id, aborter)) as Job
  return job
}
