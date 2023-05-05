import { Comment, Story, fetchItem, isComment, isStory } from '~/api/common'

type CommentWithComments = Comment & {
  comments: CommentWithComments[]
}

export interface StoryWithComments extends Story {
  comments: CommentWithComments[]
}

export default async function fetchStory(
  id: number,
  aborter?: AbortController
): Promise<StoryWithComments> {
  const story = await fetchItem(id, aborter)
  if (!isStory(story)) throw story

  const commentIds = story.deleted || story.dead ? [] : story.kids ?? []
  const items = await Promise.all(commentIds.map((id) => fetchItem(id, aborter)))
  const comments = items
    .filter(isComment)
    .flatMap((comment) => (comment.deleted || comment.dead ? [] : [{ ...comment, comments: [] }])) // TODO FIXME

  return { ...story, comments }
}

// TODO FIXME
export async function* _walkKids(story: Story) {
  const ids = story.kids ?? []
  for (const id of ids) {
    yield id
  }
}
