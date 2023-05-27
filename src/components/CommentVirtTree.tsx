import { CircularProgress } from '@mui/joy'
import { useCallback, useRef } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { TreeWalkerValue } from 'react-vtree'
import { NodeComponentProps, TreeWalker } from 'react-vtree/dist/es/Tree'
import {
  VariableSizeNodeData,
  VariableSizeNodePublicState,
  VariableSizeTree,
} from 'react-vtree/dist/es/VariableSizeTree'
import { CommentTree } from '~/api/hackerNews'
import Comment from '~/components/Comment'

interface CommentVirtTreesProps {
  commentTrees?: CommentTree[]
}

export default function CommentVirtTrees({ commentTrees }: CommentVirtTreesProps) {
  const treeRef = useRef<VariableSizeTree<ExtendedData>>(null)

  const treeWalker = useCallback(
    function* (): ReturnType<TreeWalker<ExtendedData, NodeMeta>> {
      if (!commentTrees) return

      for (const rootNode of commentTrees) {
        yield getNodeData(rootNode, 0)
      }

      let parentMeta = yield
      do {
        for (const childNode of parentMeta.node.commentTrees ?? []) {
          if (childNode) {
            yield getNodeData(childNode, parentMeta.nestingLevel + 1)
          }
        }
        parentMeta = yield
      } while (parentMeta)
    },
    [commentTrees]
  )

  if (!commentTrees) return <CircularProgress />

  return (
    <AutoSizer disableWidth>
      {({ height }) => (
        <VariableSizeTree ref={treeRef} treeWalker={treeWalker} height={height} width="100%">
          {Node}
        </VariableSizeTree>
      )}
    </AutoSizer>
  )
}

type TreeNode = Readonly<CommentTree>
type NodeMeta = Readonly<{
  nestingLevel: number
  node: TreeNode
}>
type ExtendedData = VariableSizeNodeData &
  Readonly<
    {
      isLeaf: boolean
      nestingLevel: number
    } & Omit<CommentTree, 'id'>
  >

function getNodeData(
  node: TreeNode,
  nestingLevel: number
): TreeWalkerValue<ExtendedData, NodeMeta> {
  return {
    data: {
      ...node,
      defaultHeight: 120,
      id: `${node.id}`,
      isLeaf: (node.commentTrees ?? []).length === 0,
      isOpenByDefault: true,
      nestingLevel,
    },
    nestingLevel,
    node,
  }
}

type NodeProps = NodeComponentProps<ExtendedData, VariableSizeNodePublicState<ExtendedData>>

function Node({
  // height,
  data: { defaultHeight, id, isLeaf, isOpenByDefault, nestingLevel, ...comment },
  isOpen,
  // resize,
  style,
  setOpen,
}: // treeData,
NodeProps) {
  // TODO FIXME recalculate and set variable height based on comment length

  return (
    <div style={{ ...style, display: 'flex', gap: 4, marginLeft: nestingLevel * 40 }}>
      {isLeaf ? null : (
        <div>
          <button type="button" onClick={() => setOpen(!isOpen)}>
            {isOpen ? '-' : '+'}
          </button>
        </div>
      )}
      <div>
        <Comment comment={{ ...comment, id: Number(id) }} />
      </div>
    </div>
  )
}
