import { Link } from '@mui/joy'

interface UserLinkProps {
  username: string
}

export default function UserLink({ username }: UserLinkProps) {
  const href = `https://news.ycombinator.com/user?id=${username}`
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener"
      onClick={(ev) => {
        ev.stopPropagation()
        ev.preventDefault()
        window.open(href, '_blank', 'noopener')
      }}
    >
      {username}
    </Link>
  )
}
