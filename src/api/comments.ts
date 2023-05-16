import { Comment, CommentTree, ItemId, Story, fetchItems } from '~/api/common'
import { take } from '~/fns'

export default async function fetchCommentTrees(
  story: Story,
  aborter?: AbortController,
  limit = Infinity
): Promise<CommentTree[]> {
  const descendants = await prefetchDescendants(story, aborter, limit)

  const comments = take(story.kids ?? [], limit).map((id) => descendants.get(id)!)

  return comments
    .filter((comment) => !comment.deleted && !comment.dead)
    .map((comment: Comment) => {
      return { ...comment, commentTrees: inflateNestedCommentTrees(comment, descendants, limit) }
    })
}

function inflateNestedCommentTrees(
  comment: Comment,
  descendants: Map<ItemId, Comment>,
  limit = Infinity
): CommentTree[] {
  const childComments = take(comment.kids ?? [], limit).map((id) => descendants.get(id)!)
  return childComments
    .filter((comment) => !comment.deleted && !comment.dead)
    .map((childComment: Comment) => {
      return {
        ...childComment,
        commentTrees: inflateNestedCommentTrees(childComment, descendants, limit),
      }
    })
}

export async function prefetchDescendants(
  parent: Story | Comment,
  aborter?: AbortController,
  limit = Infinity
) {
  const descendants = new Map<ItemId, Comment>()

  let ids = take(parent.kids ?? [], limit)
  while (ids.length > 0) {
    const kids = (await fetchItems(ids, aborter)) as Comment[]
    for (const kid of kids) {
      descendants.set(kid.id, kid)
    }
    ids = kids.flatMap((parent) => take(parent.kids ?? [], limit))
  }

  return descendants
}
