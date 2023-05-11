import { Box, List, ListDivider, ListItem, ListItemContent, Typography } from '@mui/joy'
import { Fragment } from 'react'
import { CommentTree } from '~/api/comments'

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
          <Box
            sx={(theme) => {
              const { body2, body3, body4 } = theme.typography
              return {
                ...body2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                '& a': body3,
                '& pre': {
                  overflowX: 'auto',
                  backgroundColor: theme.palette.neutral.softBg,
                },
                '& code': { ...body4, fontFamily: 'monospace' },
              }
            }}
            dangerouslySetInnerHTML={{ __html: commentTree.text }}
          />
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
