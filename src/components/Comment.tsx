import { Typography } from '@mui/joy'
import { Comment } from '~/api/common'
import InlineHtmlText from './InlineHtmlText'

interface CommentProps {
  comment: Comment
}

export default function Comment({ comment }: CommentProps) {
  return (
    <>
      <Typography level="body3" sx={{ fontWeight: 'lg', mb: 1 }}>
        {comment.by}
      </Typography>
      <InlineHtmlText text={comment.text} />
    </>
  )
}
