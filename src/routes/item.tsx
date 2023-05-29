import { Box, LinearProgress, List, ListItem } from '@mui/joy'
import { useMediaQuery } from '@mui/material'
import { forwardRef, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import { Job, Story, isComment, isJob, isStory } from '~/api/hackerNews'
import CommentCard from '~/components/CommentCard'
import { CommentTrees } from '~/components/CommentTree'
import JobCard from '~/components/JobCard'
import StoryCard from '~/components/StoryCard'
import useCommentTrees from '~/contexts/hooks/useCommentTrees'
import useComments from '~/contexts/hooks/useComments'
import useDescendants from '~/contexts/hooks/useDescendants'
import useItem from '~/contexts/hooks/useStory'
import theme from '~/theme'

export default function Item() {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  return isMobile ? <MobileItem /> : <DesktopItem />
}

function MobileItem() {
  const { itemId } = useParams()
  const { item, refetch: refetchStory } = useItem(Number(itemId))
  const { comments, refetch: refetchComments } = useComments(item)
  const virtualListRef = useRef<VirtuosoHandle>(null)

  if (!item || !comments) return <LinearProgress />

  const parentCard = isJob(item) ? (
    <JobCard job={item} />
  ) : isStory(item) ? (
    <StoryCard
      story={item}
      reload={async () => {
        await refetchStory()
        await refetchComments()
      }}
    />
  ) : isComment(item) ? (
    <CommentCard comment={item} />
  ) : null

  return (
    <Virtuoso
      ref={virtualListRef}
      style={{ height: '100%' }}
      components={{
        Header: () => <Box sx={{ px: 1.5, py: 0.5 }}>{parentCard}</Box>,
        List: forwardRef(({ children, style }, ref) => (
          <List component="div" style={style} sx={{ ml: 1.5 }} ref={ref}>
            {children}
          </List>
        )),
      }}
      data={comments}
      computeItemKey={(_, item) => item.id}
      itemContent={(_, item) => (
        <ListItem>
          <CommentCard comment={item} />
        </ListItem>
      )}
    ></Virtuoso>
  )
}

function DesktopItem() {
  const { itemId } = useParams()
  const { item: story, refetch } = useItem<Job | Story>(Number(itemId))
  const { descendants, invalidateCache } = useDescendants(story)
  const commentTrees = useCommentTrees(story, descendants)

  if (!story) return <LinearProgress />

  const card = isJob(story) ? (
    <JobCard job={story} />
  ) : (
    <StoryCard
      story={story}
      reload={async () => {
        await invalidateCache()
        await refetch()
      }}
    />
  )

  return (
    <List>
      <ListItem>{card}</ListItem>
      <ListItem nested>
        <CommentTrees commentTrees={commentTrees} />
      </ListItem>
    </List>
  )
}
