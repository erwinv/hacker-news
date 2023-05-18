import { Stack, Typography } from '@mui/joy'
import { PropsWithChildren } from 'react'
import { Comment } from '~/api/common'
import InlineHtmlText from './InlineHtmlText'

interface CommentProps {
  comment: Comment
}

export default function Comment({ comment, children }: PropsWithChildren<CommentProps>) {
  return (
    <>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography level="body3" sx={{ fontWeight: 'lg' }}>
          {comment.by}
        </Typography>
        {children}
      </Stack>
      <InlineHtmlText text={comment.text} />
    </>
  )
}
