import { Refresh } from '@mui/icons-material'
import { IconButton, LinearProgress, List, ListItem } from '@mui/joy'
import { forwardRef, useRef } from 'react'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import { StoryKind } from '~/api/common'
import { StoryListItem } from '~/components/StoryListItem'
import useStories from '~/contexts/hooks/useStories'

interface StoriesProps<K extends StoryKind> {
  kind: K
}

export default function Stories<K extends StoryKind>({ kind }: StoriesProps<K>) {
  const { stories, hasMore, loadMore, reload, reloadingStoryIds } = useStories(kind, 20)
  const virtualListRef = useRef<VirtuosoHandle>(null)

  if (!stories) return <LinearProgress />

  return (
    <Virtuoso
      ref={virtualListRef}
      style={{ height: '100%' }}
      components={{
        // TODO pull-to-reload
        Header: () => (
          <ListItem>
            <IconButton variant="plain" sx={{ mx: 'auto' }} onClick={() => reload()}>
              <Refresh />
            </IconButton>
          </ListItem>
        ),
        List: forwardRef(({ children, style }, ref) => (
          <List component="div" style={style} ref={ref}>
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
      itemContent={(_, story) => (
        <StoryListItem
          story={story}
          // reload={() => reload(story.id, i)}
          isReloading={reloadingStoryIds.has(story.id)}
        />
      )}
      endReached={(i) => hasMore && loadMore(i, 20)}
    />
  )
}
