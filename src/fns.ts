import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { UnixTime } from '~/api/hackerNews'

dayjs.extend(relativeTime)

export function* _take<T>(xs: Iterable<T>, n: number) {
  if (n < 1) return
  if (n >= Infinity) {
    yield* xs
    return
  }

  for (const x of xs) {
    yield x
    if (--n < 1) break
  }
}

export function take<T>(xs: T[], n: number) {
  return n < Infinity ? xs.slice(0, n) : xs
}

const countryCodeTlds = ['uk', 'au']

export function extractSite(href: string) {
  const url = new URL(href)

  const splits = url.hostname.split('.').reverse()
  const domain = countryCodeTlds.includes(splits[0])
    ? splits.slice(0, 3).reverse().join('.')
    : splits.slice(0, 2).reverse().join('.')

  switch (domain) {
    case 'github.com':
    case 'twitter.com':
      return domain + '/' + url.pathname.split('/')[1]?.toLowerCase()
    case 'medium.com':
    case 'fly.dev':
    case 'github.io':
    case 'google.com':
    case 'netlify.app':
    case 'stackexchange.com':
    case 'substack.com':
      return url.hostname
    default:
      return domain
  }
}

export function ignoreAbortError(error: Error) {
  const isAbortError = error instanceof DOMException && error.name === 'AbortError'
  if (!isAbortError) throw error
}

export function toTime(s: UnixTime) {
  return dayjs(s * 1000)
}
