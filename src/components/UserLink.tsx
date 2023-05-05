import { Link } from '@mui/joy'

interface UserLinkProps {
  username: string
}

export default function UserLink({ username }: UserLinkProps) {
  return (
    <Link color="neutral" href={`https://news.ycombinator.com/user?id=${username}`}>
      {username}
    </Link>
  )
}
