import { CircularProgress, LinearProgress, List, ListItem } from '@mui/joy'
import { forwardRef } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { StoryKind, isLoaded } from '~/api/common'
import { StoryListItem } from '~/components/StoryListItem'
import useStories from '~/contexts/hooks/stories'

interface StoriesProps<K extends StoryKind> {
  kind: K
}

export default function Stories<K extends StoryKind>({ kind }: StoriesProps<K>) {
  const stories = useStories(kind)

  if (!stories) return <LinearProgress color="neutral" />

  return (
    <Virtuoso
      style={{ height: '100%' }}
      components={{
        List: forwardRef(({ children, style }, ref) => (
          <List component="div" style={style} ref={ref}>
            {children}
          </List>
        )),
      }}
      data={stories}
      computeItemKey={(_, storyOrId) => (isLoaded(storyOrId) ? storyOrId.id : storyOrId)}
      itemContent={(_, story) => {
        return !isLoaded(story) ? (
          <ListItem>
            <CircularProgress color="neutral" />
          </ListItem>
        ) : (
          <StoryListItem story={story} />
        )
      }}
    />
  )
}
