import { useEffect, useState } from 'react'
import fetchCommentTrees from '~/api/comments'
import { CommentTree, Story } from '~/api/common'
import { CommentTrees } from '~/components/CommentTree'
import { ignoreAbortError } from '~/fns'
import CommentVirtTrees from './CommentVirtTree'

interface StoryDiscussionProps {
  story: Story
  virtual?: boolean
  lazy?: boolean
}

export default function StoryDiscussion({
  story,
  virtual = false,
  lazy = false,
}: StoryDiscussionProps) {
  const [commentTrees, setCommentTrees] = useState<CommentTree[]>()

  useEffect(() => {
    if (!story || lazy) return

    let aborted = false
    const aborter = new AbortController()

    fetchCommentTrees(story, aborter, virtual || story.descendants <= 100 ? Infinity : 10)
      .then((comments) => {
        if (!aborted) {
          setCommentTrees(comments)
        }
      })
      .catch(ignoreAbortError)

    return () => {
      aborted = true
      aborter.abort()
    }
  }, [story, virtual, lazy])

  return virtual ? (
    <CommentVirtTrees commentTrees={commentTrees} />
  ) : (
    <CommentTrees commentTrees={commentTrees} />
  )
}
