import { useCallback, useEffect, useState } from 'react'
import { Comment, Item, ItemId, fetchItems, isParent } from '~/api/hackerNews'
import db from '~/db'
import { ignoreAbortError } from '~/fns'

export default function useComments(item?: Item, initial = 20) {
  const [comments, setComments] = useState<Comment[]>()
  const [limit, setLimit] = useState(initial)
  const [commentIds, setCommentIds] = useState<ItemId[]>()

  useEffect(() => {
    if (!item) return

    setCommentIds(isParent(item) ? item.kids ?? [] : [])

    return () => {
      setCommentIds(undefined)
    }
  }, [item])

  useEffect(() => setLimit(initial), [commentIds, initial])

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
      setComments((prev) => (!prev ? fetchedComments : [...prev, ...fetchedComments]))
    })().catch(ignoreAbortError)

    return () => {
      aborter.abort()
    }
  }, [commentIds, comments?.length, limit])

  const loadMore = useCallback((lastIndex: number, n: number) => {
    setLimit(lastIndex + n + 1)
  }, [])

  const invalidateCache = useCallback(async () => {
    if (commentIds) {
      await db.items.bulkDelete(commentIds)
    }
  }, [commentIds])

  const total = commentIds?.length ?? 0
  const loaded = comments?.length ?? 0
  const hasMore = total > loaded

  return { comments, loaded, total, hasMore, loadMore, invalidateCache }
}
