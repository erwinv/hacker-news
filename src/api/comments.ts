import { Comment, Story, fetchItems, isComment, isParent, isStory } from '~/api/common'

export interface CommentTree extends Comment {
  comments: CommentTree[]
}

export default async function fetchComments(
  parent: Story | Comment,
  aborter?: AbortController
): Promise<CommentTree[]> {
  if (isStory(parent)) {
    await prefetchDescendants(parent, aborter)
  }

  const comments = await fetchItems(parent.kids ?? [], aborter).then((items) =>
    items.filter(isComment)
  )

  return Promise.all(
    comments
      .filter((comment) => !comment.deleted && !comment.dead)
      .map(async (comment: Comment) => {
        return { ...comment, comments: await fetchComments(comment) }
      })
  )
}

export async function prefetchDescendants(parent: Story | Comment, aborter?: AbortController) {
  let ids = parent.kids ?? []

  while (ids.length > 0) {
    const kids = await fetchItems(ids, aborter)
    ids = kids.filter(isParent).flatMap((kid) => kid.kids ?? [])
  }
}
