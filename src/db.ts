import Dexie, { Table } from 'dexie'
import { Item } from '~/api/hackerNews'

class DB extends Dexie {
  items!: Table<Item>

  constructor() {
    super('hndb.erwinv.dev')

    this.version(1).stores({
      items: 'id, time, type',
    })
  }
}

export const db = new DB()
