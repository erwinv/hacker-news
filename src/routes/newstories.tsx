import { CircularProgress, List } from '@mui/joy'
import { forwardRef } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { isMissing } from '~/api/common'
import { StoryListItem } from '~/components/StoryList'
import useNewStories from '~/contexts/hooks/stories'

export default function NewStories() {
  const newStories = useNewStories()

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
      data={newStories}
      itemContent={(_, story) => {
        return isMissing(story) ? (
          <CircularProgress color="neutral" size="sm" />
        ) : (
          <StoryListItem key={story.id} story={story} />
        )
      }}
    />
  )
}
