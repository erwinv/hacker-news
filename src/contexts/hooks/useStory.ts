import { useCallback, useEffect, useState } from 'react'
import { Item, fetchOrGetItemFromDB } from '~/api/hackerNews'
import db from '~/db'
import { ignoreAbortError } from '~/fns'

export default function useItem<T extends Item = Item>(id: number) {
  const [item, setItem] = useState<T>()
  const [refetchHack, setRefetchHack] = useState(false)

  useEffect(() => {
    if (!Number.isFinite(id)) return

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
      setItem(undefined)
    }
  }, [id, refetchHack])

  const refetch = useCallback(async () => {
    await db.items.delete(id)
    setRefetchHack((x) => !x)
  }, [id])

  return { item, refetch }
}
