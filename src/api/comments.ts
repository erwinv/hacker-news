import { Comment, CommentTree, ItemId, Story, fetchItems } from '~/api/hackerNews'
import { take } from '~/fns'

export function inflateNestedCommentTrees(
  parent: Story | Comment,
  descendants: Map<ItemId, Comment>
): CommentTree[] {
  const childComments = (parent.kids ?? []).flatMap((id) => {
    const childComment = descendants.get(id)
    return childComment ? [childComment] : []
  })
  return childComments.map((childComment) => {
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

  let ids = take(parent.kids ?? [], limit - descendants.size)
  while (ids.length > 0 && descendants.size <= limit) {
    const kids = (await fetchItems(ids, aborter)) as Comment[]
    for (const kid of kids) {
      descendants.set(kid.id, kid)
    }
    ids = take(
      kids.flatMap((parent) => parent.kids ?? []),
      limit - descendants.size
    )
  }

  return descendants
}
