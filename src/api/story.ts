import { ItemId, Job, Story, fetchOrGetItemFromDB } from '~/api/hackerNews'

export async function fetchStory(id: ItemId, aborter?: AbortController): Promise<Job | Story> {
  const story = (await fetchOrGetItemFromDB(id, aborter)) as Job | Story
  return story
}
