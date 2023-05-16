import { List, ListDivider, ListItem, ListItemContent, Typography } from '@mui/joy'
import { Fragment } from 'react'
import { CommentTree } from '~/api/common'
import InlineHtmlText from './InlineHtmlText'

interface CommentThreadProps {
  commentTree: CommentTree
}

export default function CommentThread({ commentTree }: CommentThreadProps) {
  const childComments = commentTree.commentTrees

  return (
    <>
      <ListItem>
        <ListItemContent>
          <Typography level="body3" sx={{ fontWeight: 'lg', mb: 1 }}>
            {commentTree.by}
          </Typography>
          <InlineHtmlText text={commentTree.text} />
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
                  <CommentThread commentTree={childComment} />
                </Fragment>
              ))}
            </List>
          </ListItem>
        </>
      )}
    </>
  )
}
