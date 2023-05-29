import { Card, CardContent, CardOverflow, Link, Stack, Tooltip, Typography } from '@mui/joy'
import { PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'
import { Comment } from '~/api/hackerNews'
import InlineHtmlText from '~/components/InlineHtmlText'
import useStoryKind from '~/contexts/hooks/useStoryKind'
import { toTime } from '~/fns'

interface CommentCardProps {
  comment: Comment
}

export default function CommentCard({ comment }: PropsWithChildren<CommentCardProps>) {
  const navigate = useNavigate()
  const kind = useStoryKind()
  const time = toTime(comment.time)

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardOverflow>
        <Stack
          direction="row"
          sx={{ pt: 1.5, pb: 0.5, justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography level="body2" sx={{ fontWeight: 'lg' }}>
            {comment.by}
            <Tooltip title={time.format()}>
              <Typography sx={{ fontWeight: 'md', ml: 2 }}>{time.fromNow()}</Typography>
            </Tooltip>
          </Typography>
        </Stack>
      </CardOverflow>
      <CardContent>
        <InlineHtmlText text={comment.text} />
      </CardContent>
      {!comment.kids?.length ? null : (
        <CardOverflow>
          <Stack direction="row-reverse" sx={{ py: 1.5 }}>
            <Typography level="body2" sx={{ fontWeight: 'lg' }}>
              <Link overlay onClick={() => navigate(`/item/${comment.id}?list=${kind}`)}>
                {comment.kids.length} comments
              </Link>
            </Typography>
          </Stack>
        </CardOverflow>
      )}
    </Card>
  )
}
