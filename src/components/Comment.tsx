import { Stack, Tooltip, Typography } from '@mui/joy'
import { PropsWithChildren } from 'react'
import { isDeletedComment, type Comment } from '~/api/hackerNews'
import InlineHtmlText from '~/components/InlineHtmlText'
import { toTime } from '~/fns'

interface CommentProps {
  comment: Comment
  hideContent?: boolean
}

export default function Comment({
  comment,
  hideContent = false,
  children,
}: PropsWithChildren<CommentProps>) {
  const time = toTime(comment.time)

  const isDeleted = isDeletedComment(comment)

  return (
    <>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography level="body2" sx={{ fontWeight: 'lg' }}>
          {isDeleted ? '-' : comment.by}
          <Tooltip title={time.format()}>
            <Typography sx={{ ml: 2, fontWeight: 'md' }}>{time.fromNow()}</Typography>
          </Tooltip>
        </Typography>
        {children}
      </Stack>
      {hideContent ? null : <InlineHtmlText text={isDeleted ? '[deleted]' : comment.text} />}
    </>
  )
}
