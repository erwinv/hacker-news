import { Stack, Tooltip, Typography } from '@mui/joy'
import { PropsWithChildren } from 'react'
import { Comment } from '~/api/common'
import { toTime } from '~/fns'
import InlineHtmlText from './InlineHtmlText'

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

  return (
    <>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography level="body3" sx={{ fontWeight: 'lg' }}>
          {comment.by}
          <Tooltip title={time.format()}>
            <Typography sx={{ fontWeight: 'md', ml: 2 }}>{time.fromNow()}</Typography>
          </Tooltip>
        </Typography>
        {children}
      </Stack>
      {hideContent ? null : <InlineHtmlText text={comment.text} />}
    </>
  )
}
