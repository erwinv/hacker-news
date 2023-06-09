import { Refresh } from '@mui/icons-material'
import { IconButton, LinearProgress, List, ListItem } from '@mui/joy'
import { forwardRef, useEffect, useRef } from 'react'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import { StoryListItem } from '~/components/StoryListItem'
import useStories from '~/contexts/hooks/useStories'
import useStoryKind from '~/contexts/hooks/useStoryKind'
import useStoryListItemIds from '~/contexts/hooks/useStoryListItemIds'
import theme from '~/theme'

export default function Stories() {
  const kind = useStoryKind()
  const { storyIds, refetch } = useStoryListItemIds(kind)
  const { stories, hasMore, loaded, total, loadMore, invalidateCache } = useStories(storyIds, 20)
  const virtualListRef = useRef<VirtuosoHandle>(null)

  useEffect(() => console.debug(loaded, '/', total), [loaded, total])
  if (!stories) return <LinearProgress sx={{ maxWidth: 'sm', mx: 'auto' }} />

  return (
    <Virtuoso
      ref={virtualListRef}
      style={{ height: '100%', maxWidth: theme.breakpoints.values.sm, margin: '0 auto' }}
      components={{
        // TODO pull-to-reload
        Header: () => (
          <ListItem>
            <IconButton
              variant="plain"
              sx={{ mx: 'auto' }}
              onClick={async () => {
                await invalidateCache()
                refetch()
              }}
            >
              <Refresh />
            </IconButton>
          </ListItem>
        ),
        List: forwardRef(({ children, style }, ref) => (
          <List component="div" style={style} sx={{ gap: 0.5 }} ref={ref}>
            {children}
          </List>
        )),
        // TODO FIXME this footer casuses endReached callback to be called repeatedly
        // Footer: hasMore
        //   ? () => (
        //       <ListItem>
        //         {isFetching ? (
        //           <CircularProgress sx={{ mx: 'auto' }} />
        //         ) : (
        //           <ListItemButton onClick={() => loadMore(stories.length - 1, 20)}>
        //             <IconButton variant="plain" sx={{ mx: 'auto' }}>
        //               <Refresh />
        //             </IconButton>
        //           </ListItemButton>
        //         )}
        //       </ListItem>
        //     )
        //   : undefined,
      }}
      data={stories}
      computeItemKey={(_, story) => story.id}
      itemContent={(_, story) => <StoryListItem story={story} />}
      endReached={(i) => hasMore && loadMore(i, 20)}
    />
  )
}
