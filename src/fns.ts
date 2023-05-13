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
  return n < Infinity ? [..._take(xs, n)] : xs
}

export function extractSite(href: string) {
  const url = new URL(href)

  const [tld, host] = url.hostname.split('.').reverse()
  const domain = `${host}.${tld}`

  switch (domain) {
    case 'github.com':
    case 'twitter.com':
      return domain + '/' + url.pathname.split('/')[1]?.toLowerCase()
    case 'fly.dev':
    case 'github.io':
    case 'google.com':
    case 'netlify.app':
      return url.hostname
    default:
      return domain
  }
}

export function ignoreAbortError(error: Error) {
  const isAbortError = error instanceof DOMException && error.name === 'AbortError'
  if (!isAbortError) throw error
}
