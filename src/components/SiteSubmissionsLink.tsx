import { Launch } from '@mui/icons-material'
import { Link } from '@mui/joy'

interface SiteSubmissionsLinkProps {
  site: string
}

export default function SiteSubmissionsLink({ site }: SiteSubmissionsLinkProps) {
  return (
    <Link
      href={`https://news.ycombinator.com/from?site=${site}`}
      variant="soft"
      level="body2"
      target="_blank"
      rel="noopener"
      endDecorator={<Launch />}
      onClick={(ev) => {
        ev.stopPropagation()
        ev.preventDefault()
        window.open(`https://news.ycombinator.com/from?site=${site}`, '_blank', 'noopener')
      }}
    >
      {site}
    </Link>
  )
}
