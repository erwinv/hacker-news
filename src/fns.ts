export function* _take<T>(xs: Iterable<T>, n: number) {
  if (n < 1) return

  for (const x of xs) {
    yield x
    if (--n < 1) break
  }
}

export function take<T>(xs: Iterable<T>, n: number) {
  return [..._take(xs, n)]
}

export function extractSite(href: string) {
  const url = new URL(href)

  const [tld, host] = url.hostname.split('.').reverse()
  const domain = `${host}.${tld}`

  switch (domain) {
    case 'github.com':
    case 'twitter.com':
      return domain + '/' + url.pathname.split('/')[1]?.toLowerCase()
    case 'github.io':
      return url.hostname
    default:
      return domain
  }
}

export function ignoreAbortError(error: Error) {
  const isAbortError = error instanceof DOMException && error.name === 'AbortError'
  if (!isAbortError) throw error
}
