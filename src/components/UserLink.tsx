import { Link } from '@mui/joy'

interface UserLinkProps {
  username: string
}

export default function UserLink({ username }: UserLinkProps) {
  // TODO
  return (
    <Link
      color="neutral"
      target="_blank"
      rel="noopener"
      onClick={(ev) => {
        ev.stopPropagation()
        ev.preventDefault()
        window.open(`https://news.ycombinator.com/user?id=${username}`, '_blank', 'noopener')
      }}
    >
      {username}
    </Link>
  )
}
