import { Comment, CommentTree, ItemId, Story, fetchItems } from '~/api/common'
import { take } from '~/fns'

export function inflateNestedCommentTrees(
  parent: Story | Comment,
  descendants: Map<ItemId, Comment>
): CommentTree[] {
  const childComments = (parent.kids ?? []).flatMap((id) => {
    const childComment = descendants.get(id)
    return childComment ? [childComment] : []
  })
  return childComments
    .filter((comment) => !comment.deleted && !comment.dead)
    .map((childComment: Comment) => {
      return {
        ...childComment,
        commentTrees: inflateNestedCommentTrees(childComment, descendants),
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
