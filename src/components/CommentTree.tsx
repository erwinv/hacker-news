import { ExpandMore, Link, NavigateNext, North, NorthWest, South } from '@mui/icons-material'
import {
  CircularProgress,
  IconButton,
  List,
  ListDivider,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  iconButtonClasses,
} from '@mui/joy'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CommentTree } from '~/api/common'
import Comment from '~/components/Comment'

interface CommentTreeProps {
  commentTree: CommentTree
  isRoot?: boolean
  prev?: CommentTree | null
  next?: CommentTree | null
}

export default function CommentTree({ commentTree, isRoot = false, prev, next }: CommentTreeProps) {
  const navigate = useNavigate()
  const ref = useRef<HTMLLIElement>(null)
  const { pathname, hash } = useLocation()
  const [isOpen, setOpen] = useState(true)

  const hashId = Number(hash.slice(1))

  useEffect(() => {
    if (!hashId || !ref.current) return

    if (hashId === commentTree.id) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [pathname, hashId, commentTree.id])

  const selfLink = (
    <IconButton
      size="sm"
      variant="plain"
      onClick={() => {
        const url = new URL(document.location.href)
        url.hash = `${commentTree.id}`
        navigator.clipboard.writeText(url.href)
        navigate(url.hash, { replace: true })
      }}
    >
      <Link />
    </IconButton>
  )
  const parentLink = isRoot ? null : (
    <IconButton
      size="sm"
      variant="plain"
      onClick={() => navigate(`#${commentTree.parent}`, { replace: true })}
    >
      <NorthWest />
    </IconButton>
  )
  const prevLink = !prev ? null : (
    <IconButton
      size="sm"
      variant="plain"
      onClick={() => navigate(`#${prev.id}`, { replace: true })}
    >
      <North />
    </IconButton>
  )
  const nextLink = !next ? null : (
    <IconButton
      size="sm"
      variant="plain"
      onClick={() => navigate(`#${next.id}`, { replace: true })}
    >
      <South />
    </IconButton>
  )

  const childComments = commentTree.commentTrees

  return (
    <>
      <ListItem
        ref={ref}
        sx={(theme) => ({
          alignItems: 'start',
          [`.${iconButtonClasses.root}`]: {
            color: theme.palette.neutral.softDisabledBg,
          },
          '&:hover': {
            [`.${iconButtonClasses.root}`]: {
              color: theme.palette.neutral.softColor,
              backgroundColor: 'transparent',
            },
          },
        })}
      >
        <ListItemDecorator>
          <IconButton variant="plain" size="sm" onClick={() => setOpen((x) => !x)}>
            {isOpen ? <ExpandMore /> : <NavigateNext />}
          </IconButton>
        </ListItemDecorator>
        <ListItemContent>
          <Comment comment={commentTree} hideContent={!isOpen}>
            <div>
              {selfLink} {parentLink} {prevLink} {nextLink}
            </div>
          </Comment>
        </ListItemContent>
      </ListItem>
      {childComments.length < 1 || !isOpen ? null : (
        <>
          <ListDivider inset="startContent" />
          <ListItem nested>
            <List>
              {childComments.map((childComment, i) => {
                const prev = i === 0 ? null : childComments[i - 1]
                const next = i === childComments.length - 1 ? null : childComments[i + 1]
                return (
                  <Fragment key={childComment.id}>
                    {i === 0 ? null : <ListDivider inset="startContent" />}
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
        '--ListItemDecorator-size': {
          xs: '2rem',
        },
        '--ListItem-paddingLeft': {
          xs: '0.25rem',
          sm: '0.75rem',
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
              {i === 0 ? null : <ListDivider inset="startContent" />}
              <CommentTree commentTree={commentTree} isRoot prev={prev} next={next} />
            </Fragment>
          )
        })
      )}
    </List>
  )
}
