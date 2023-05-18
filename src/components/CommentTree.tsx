import { CircularProgress, List, ListDivider, ListItem, ListItemContent } from '@mui/joy'
import { Fragment, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { CommentTree } from '~/api/common'
import Comment from '~/components/Comment'

interface CommentTreeProps {
  commentTree: CommentTree
  isRoot?: boolean
  prev?: CommentTree | null
  next?: CommentTree | null
}

export default function CommentTree({ commentTree, isRoot = false, prev, next }: CommentTreeProps) {
  const ref = useRef<HTMLLIElement>(null)

  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash || !ref.current) return

    const id = Number(hash.slice(1))
    if (id === commentTree.id) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [pathname, hash, commentTree.id])

  const childComments = commentTree.commentTrees

  return (
    <>
      <ListItem id={`${commentTree.id}`} ref={ref}>
        <ListItemContent>
          <Comment comment={commentTree} hideParentLink={isRoot} prev={prev?.id} next={next?.id} />
        </ListItemContent>
      </ListItem>
      {childComments.length < 1 ? null : (
        <>
          <ListDivider inset="gutter" />
          <ListItem nested>
            <List>
              {childComments.map((childComment, i) => {
                const prev = i === 0 ? null : childComments[i - 1]
                const next = i === childComments.length - 1 ? null : childComments[i + 1]
                return (
                  <Fragment key={childComment.id}>
                    {i === 0 ? null : <ListDivider inset="gutter" />}
                    <CommentTree commentTree={childComment} prev={prev} next={next} />
                  </Fragment>
                )
              })}
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
        commentTrees.map((commentTree, i) => {
          const prev = i === 0 ? null : commentTrees[i - 1]
          const next = i === commentTrees.length - 1 ? null : commentTrees[i + 1]
          return (
            <Fragment key={commentTree.id}>
              {i === 0 ? null : <ListDivider inset="gutter" />}
              <CommentTree commentTree={commentTree} isRoot prev={prev} next={next} />
            </Fragment>
          )
        })
      )}
    </List>
  )
}
