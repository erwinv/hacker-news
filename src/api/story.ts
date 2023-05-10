import { ItemId, Story, fetchOrGetItemFromDB } from '~/api/common'

export default async function fetchStory(id: ItemId, aborter?: AbortController): Promise<Story> {
  const story = (await fetchOrGetItemFromDB(id, aborter)) as Story
  return story
}
