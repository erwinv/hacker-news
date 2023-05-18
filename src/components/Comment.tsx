import { North, NorthWest, South } from '@mui/icons-material'
import { Link, Typography } from '@mui/joy'
import { Comment, ItemId } from '~/api/common'
import InlineHtmlText from './InlineHtmlText'

interface CommentProps {
  comment: Comment
  hideParentLink?: boolean
  prev?: ItemId
  next?: ItemId
}

export default function Comment({ comment, hideParentLink = false, prev, next }: CommentProps) {
  const parentLink = hideParentLink ? null : (
    <Link href={`#${comment.parent}`} endDecorator={<NorthWest />} color="neutral" />
  )
  const prevLink = !prev ? null : (
    <Link href={`#${prev}`} endDecorator={<North />} color="neutral" />
  )
  const nextLink = !next ? null : (
    <Link href={`#${next}`} endDecorator={<South />} color="neutral" />
  )

  return (
    <>
      <Typography level="body3" sx={{ fontWeight: 'lg', mb: 1 }}>
        {comment.by} {parentLink} {prevLink} {nextLink}
      </Typography>
      <InlineHtmlText text={comment.text} />
    </>
  )
}
