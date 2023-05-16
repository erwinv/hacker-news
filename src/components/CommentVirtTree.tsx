import { CircularProgress } from '@mui/joy'
import { CommentTree } from '~/api/common'

interface CommentVirtTreesProps {
  commentTrees?: CommentTree[]
}

export default function CommentVirtTrees({ commentTrees }: CommentVirtTreesProps) {
  if (!commentTrees) return <CircularProgress color="neutral" />
  return <></>
}
