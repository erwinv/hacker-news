import { useMemo } from 'react'
import { inflateNestedCommentTrees } from '~/api/comments'
import { Comment, ItemId, Job, Story, isJob } from '~/api/hackerNews'

export function useCommentTrees(story?: Job | Story, descendants?: Map<ItemId, Comment>) {
  const commentTrees = useMemo(() => {
    if (!story) return undefined
    if (isJob(story)) return []
    if (!descendants) return undefined

    return inflateNestedCommentTrees(story, descendants)
  }, [story, descendants])

  return commentTrees
}
