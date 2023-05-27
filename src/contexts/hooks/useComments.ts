import { useCallback, useEffect, useState } from 'react'
import { Comment, Item, fetchItems, isParent, isValid } from '~/api/hackerNews'
import db from '~/db'

export default function useComments(item?: Item) {
  const [comments, setComments] = useState<Comment[]>()
  const commentIds = comments?.map((c) => c.id)

  useEffect(() => {
    if (!item) {
      setComments(undefined)
      return
    }
    if (!isParent(item)) {
      setComments(undefined)
      return
    }
    if (!item.kids) {
      setComments([])
      return
    }

    if (item.kids.length === commentIds?.length) return

    const aborter = new AbortController()

    fetchItems(item.kids, aborter).then((comments) => {
      if (!aborter.signal.aborted) {
        setComments(comments.filter(isValid) as Comment[])
      }
    })

    return () => {
      aborter.abort()
    }
  }, [item, commentIds])

  const refetch = useCallback(async () => {
    if (commentIds) {
      await db.items.bulkDelete(commentIds)
    }
    setComments(undefined)
  }, [commentIds])

  return { comments, refetch }
}
