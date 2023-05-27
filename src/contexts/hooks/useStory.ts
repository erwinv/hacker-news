import { useCallback, useEffect, useState } from 'react'
import { Item, fetchOrGetItemFromDB } from '~/api/hackerNews'
import db from '~/db'
import { ignoreAbortError } from '~/fns'

export default function useItem<T extends Item = Item>(id: number) {
  const [item, setItem] = useState<T>()

  useEffect(() => {
    if (!Number.isFinite(id)) return
    if (item?.id === id) return

    const aborter = new AbortController()

    fetchOrGetItemFromDB(id, aborter)
      .then((story) => {
        if (!aborter.signal.aborted) {
          setItem(story as T)
        }
      })
      .catch(ignoreAbortError)

    return () => {
      aborter.abort()
    }
  }, [id, item])

  const refetch = useCallback(async () => {
    await db.items.delete(id)
    setItem(undefined)
  }, [id])

  return { item, refetch }
}
