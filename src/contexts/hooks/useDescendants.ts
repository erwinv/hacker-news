import { useCallback, useEffect, useState } from 'react'
import { prefetchDescendants } from '~/api/comments'
import { Comment, CommentTree, ItemId, Job, Story, StoryTree, isJob } from '~/api/hackerNews'
import db from '~/db'
import { ignoreAbortError } from '~/fns'

export default function useDescendants(item?: Job | Story, initial = 20) {
  const [descendants, setDescendants] = useState<Map<ItemId, Comment>>()

  useEffect(() => {
    if (!item) {
      setDescendants(undefined)
      return
    }
    if (isJob(item)) return
    const story = item

    if (descendants?.size ?? 0 >= initial) return

    const aborter = new AbortController()

    prefetchDescendants(story, aborter, initial)
      .then((descendants) => {
        if (!aborter.signal.aborted) {
          setDescendants(descendants)
        }
      })
      .catch(ignoreAbortError)

    return () => {
      aborter.abort()
    }
  }, [item, descendants?.size, initial])

  const loadMore = useCallback(async (parent: StoryTree | CommentTree, n = 20) => {
    const descendants = await prefetchDescendants(
      parent,
      undefined,
      n + (parent.commentTrees ?? []).length
    )
    setDescendants((prev) => {
      for (const [id, p] of prev ?? []) {
        descendants.set(id, p)
      }
      return descendants
    })
  }, [])

  const invalidateCache = useCallback(async () => {
    if (!descendants) return

    await db.items.bulkDelete([...descendants.keys()])
  }, [descendants])

  return { descendants, loadMore, invalidateCache }
}
