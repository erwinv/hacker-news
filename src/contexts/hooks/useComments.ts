import { useCallback, useEffect, useState } from 'react'
import { Comment, Item, ItemId, fetchItems, isParent, isValid } from '~/api/hackerNews'
import db from '~/db'
import { ignoreAbortError } from '~/fns'

export default function useComments(item?: Item, initial = 20) {
  const [comments, setComments] = useState<Comment[]>()
  const [limit, setLimit] = useState(initial)
  const [commentIds, setCommentIds] = useState<ItemId[]>()

  useEffect(() => {
    if (!item) {
      setCommentIds(undefined)
    } else if (!isParent(item)) {
      setCommentIds([])
    } else {
      setCommentIds(item.kids)
    }
  }, [item])

  useEffect(() => {
    if (!commentIds) {
      setComments(undefined)
      return
    }

    if ((comments?.length ?? 0) >= limit) return

    const aborter = new AbortController()

    ;(async () => {
      const from = comments?.length ?? 0
      const ids = commentIds.slice(from, limit)
      const fetchedComments = (await fetchItems(ids, aborter)) as Comment[]
      if (aborter.signal.aborted) return

      const deletedIds = new Set<ItemId>()
      const validComments = fetchedComments.filter((comment) => {
        const deleted = !isValid(comment)
        if (deleted) {
          deletedIds.add(comment.id)
        }
        return !deleted
      })

      setCommentIds((ids) => ids?.filter((id) => !deletedIds.has(id)))
      setComments((prev) => (!prev ? validComments : [...prev, ...validComments]))
    })().catch(ignoreAbortError)

    return () => {
      aborter.abort()
    }
  }, [commentIds, comments?.length, limit])

  const loadMore = useCallback((lastIndex: number, n: number) => {
    setLimit(lastIndex + n + 1)
  }, [])

  const refetch = useCallback(async () => {
    if (commentIds) {
      await db.items.bulkDelete(commentIds)
    }
    setLimit(initial)
  }, [commentIds, initial])

  const hasMore = (commentIds?.length ?? 0) > (comments ?? []).length

  return { comments, hasMore, loadMore, refetch }
}
