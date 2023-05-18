import { Launch } from '@mui/icons-material'
import { Link } from '@mui/joy'

interface SiteSubmissionsLinkProps {
  site: string
}

export default function SiteSubmissionsLink({ site }: SiteSubmissionsLinkProps) {
  return (
    <Link
      variant="soft"
      level="body3"
      target="_blank"
      rel="noopener"
      endDecorator={<Launch />}
      onClick={(ev) => {
        ev.stopPropagation()
        ev.preventDefault()
        window.open(`https://news.ycombinator.com/from?site=${site}`, '_blank', 'noopener')
      }}
      sx={{ ml: 1 }}
    >
      {site}
    </Link>
  )
}
