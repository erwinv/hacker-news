import { Comment, Story, fetchItems, isComment } from '~/api/common'

export interface CommentTree extends Comment {
  comments: CommentTree[]
}

export default async function fetchComments(story: Story, aborter?: AbortController) {
  const commentIds = story.kids ?? []

  const items = await fetchItems(commentIds, aborter)

  const comments = items
    .filter(isComment)
    .flatMap((comment) => (comment.deleted || comment.dead ? [] : [{ ...comment, comments: [] }]))

  return comments
}

export async function* _walkDescendants(story: Story) {
  const ids = story.kids ?? []
  for (const id of ids) {
    yield id
  }
}
