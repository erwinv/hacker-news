import { Comment, ItemId, Story, fetchItems } from '~/api/common'

export interface CommentTree extends Comment {
  commentTrees: CommentTree[]
}

export default async function fetchCommentTrees(
  story: Story,
  aborter?: AbortController
): Promise<CommentTree[]> {
  const descendants = await prefetchDescendants(story, aborter)

  const comments = (story.kids ?? []).map((id) => descendants.get(id)!)

  return comments
    .filter((comment) => !comment.deleted && !comment.dead)
    .map((comment: Comment) => {
      return { ...comment, commentTrees: fetchNestedCommentTrees(comment, descendants) }
    })
}

function fetchNestedCommentTrees(
  comment: Comment,
  descendants: Map<ItemId, Comment>
): CommentTree[] {
  const childComments = (comment.kids ?? []).map((id) => descendants.get(id)!)
  return childComments
    .filter((comment) => !comment.deleted && !comment.dead)
    .map((childComment: Comment) => {
      return { ...childComment, commentTrees: fetchNestedCommentTrees(childComment, descendants) }
    })
}

export async function prefetchDescendants(parent: Story | Comment, aborter?: AbortController) {
  const descendants = new Map<ItemId, Comment>()

  let ids = parent.kids ?? []
  while (ids.length > 0) {
    const kids = (await fetchItems(ids, aborter)) as Comment[]
    for (const kid of kids) {
      descendants.set(kid.id, kid)
    }
    ids = kids.flatMap((parent) => parent.kids ?? [])
  }

  return descendants
}
