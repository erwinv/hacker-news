import { Story, fetchOrGetItemFromDB, isStory } from '~/api/common'

export default async function fetchStory(id: number, aborter?: AbortController): Promise<Story> {
  const story = await fetchOrGetItemFromDB(id, aborter)
  if (!isStory(story)) throw story
  return story
}
