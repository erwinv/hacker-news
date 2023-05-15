// export type StoryKindMapping = {
//   top: Job | Story
//   new: Story
//   best: Story
//   ask: Story
//   show: Story
//   job: Job
// }
// export type StoryKind = keyof StoryKindMapping

// export default async function fetchStories<K extends StoryKind>(
//   kind: K,
//   n: number,
//   aborter?: AbortController
// ): Promise<StoryKindMapping[K][]> {
//   const url = new URL(`/v0/${kind}stories.json`, hackerNewsApiBaseUrl)

//   const response = await fetch(url, {
//     signal: aborter?.signal,
//   })

//   if (!response.ok) throw response

//   const storyIds = take((await response.json()) as ItemId[], n)

//   const items = (await fetchItems(storyIds, aborter)) as StoryKindMapping[K][]

//   return items.filter((story) => !story.deleted && !story.dead)
// }
