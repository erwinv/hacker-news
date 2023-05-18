import { Link, North, NorthWest, South } from '@mui/icons-material'
import {
  CircularProgress,
  IconButton,
  List,
  ListDivider,
  ListItem,
  ListItemContent,
  iconButtonClasses,
} from '@mui/joy'
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

  const hashId = Number(hash.slice(1))

  useEffect(() => {
    if (!hashId || !ref.current) return

    if (hashId === commentTree.id) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [pathname, hashId, commentTree.id])

  const selfLink = (
    <IconButton
      component="a"
      href={`#${commentTree.id}`}
      size="sm"
      variant="plain"
      onClick={() => {
        const url = new URL(document.location.href)
        url.hash = `${commentTree.id}`
        navigator.clipboard.writeText(url.href)
      }}
    >
      <Link />
    </IconButton>
  )
  const parentLink = isRoot ? null : (
    <IconButton component="a" href={`#${commentTree.parent}`} size="sm" variant="plain">
      <NorthWest />
    </IconButton>
  )
  const prevLink = !prev ? null : (
    <IconButton component="a" href={`#${prev.id}`} size="sm" variant="plain">
      <North />
    </IconButton>
  )
  const nextLink = !next ? null : (
    <IconButton component="a" href={`#${next.id}`} size="sm" variant="plain">
      <South />
    </IconButton>
  )

  const childComments = commentTree.commentTrees

  return (
    <>
      <ListItem
        ref={ref}
        sx={(theme) => ({
          [`a.${iconButtonClasses.root}`]: {
            color: theme.palette.primary.softDisabledBg,
          },
          '&:hover': {
            [`a.${iconButtonClasses.root}`]: {
              color: theme.palette.primary.softColor,
              backgroundColor: 'transparent',
            },
          },
        })}
      >
        <ListItemContent>
          <Comment comment={commentTree}>
            <div>
              {selfLink} {parentLink} {prevLink} {nextLink}
            </div>
          </Comment>
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
          <CircularProgress />
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
