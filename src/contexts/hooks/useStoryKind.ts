import { useLocation, useSearchParams } from 'react-router-dom'
import { StoryKind } from '~/api/hackerNews'

export function useStoryKind(defaultKind: StoryKind = 'top') {
  const location = useLocation()
  const [params] = useSearchParams()

  const [, , maybeListKind] = location.pathname.split('/')
  const id = params.get('list') ?? maybeListKind

  switch (id) {
    case 'top':
      return 'top'
    case 'new':
      return 'new'
    case 'best':
      return 'best'
    case 'ask':
      return 'ask'
    case 'show':
      return 'show'
    case 'job':
      return 'job'
    default:
      return defaultKind
  }
}
