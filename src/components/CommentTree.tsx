import { CircularProgress, List, ListDivider, ListItem, ListItemContent } from '@mui/joy'
import { Fragment } from 'react'
import { CommentTree } from '~/api/common'
import Comment from '~/components/Comment'

interface CommentTreeProps {
  commentTree: CommentTree
}

export default function CommentTree({ commentTree }: CommentTreeProps) {
  const childComments = commentTree.commentTrees

  return (
    <>
      <ListItem>
        <ListItemContent>
          <Comment comment={commentTree} />
        </ListItemContent>
      </ListItem>
      {childComments.length < 1 ? null : (
        <>
          <ListDivider inset="gutter" />
          <ListItem nested>
            <List>
              {childComments.map((childComment, i) => (
                <Fragment key={childComment.id}>
                  {i === 0 ? null : <ListDivider inset="gutter" />}
                  <CommentTree commentTree={childComment} />
                </Fragment>
              ))}
            </List>
          </ListItem>
        </>
      )}
    </>
  )
}

interface CommentTreesProps {
  commentTrees?: CommentTree[]
}

export function CommentTrees({ commentTrees }: CommentTreesProps) {
  return (
    <List
      sx={{
        '--List-nestedInsetStart': {
          xs: '1rem',
          sm: '2rem',
        },
      }}
    >
      {!commentTrees ? (
        <ListItem>
          <CircularProgress color="neutral" />
        </ListItem>
      ) : (
        commentTrees.map((commentTree, i) => (
          <Fragment key={commentTree.id}>
            {i === 0 ? null : <ListDivider inset="gutter" />}
            <CommentTree commentTree={commentTree} />
          </Fragment>
        ))
      )}
    </List>
  )
}
