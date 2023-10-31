import { memo } from 'react'
import { Box } from '@fower/react'
import { Editor, Node } from 'slate'
import { useEditor, useEditorStatic } from '@penx/editor-common'
import { listSchema } from '../listSchema'
import { ListContentElement } from '../types'

interface BulletContentProps {
  collapsed?: boolean
  nodeId?: string
}

const BulletContent = memo(
  function BulletContent({ collapsed, nodeId }: BulletContentProps) {
    const editor = useEditorStatic()
    return (
      <Box
        className="bullet"
        square-15
        bgTransparent
        bgGray200--hover
        bgGray200={collapsed}
        toCenter
        roundedFull
        cursorPointer
        flexShrink-1
        onClick={() => {
          editor.onClickBullet(nodeId)
        }}
      >
        <Box
          square-5
          bgGray400
          roundedFull
          transitionCommon
          scale-130--$bullet--hover
        />
      </Box>
    )
  },
  (prev, next) =>
    prev.nodeId === next.nodeId && prev.collapsed === next.collapsed,
)

interface Props {
  element: ListContentElement
}

export const Bullet = ({ element }: Props) => {
  const editor = useEditor()
  const { collapsed = false } = element
  const str = Node.string(element)

  const currentElement = (() => {
    if (!editor.selection) return null
    const res = Editor.nodes(editor, {
      mode: 'lowest',
      at: editor.selection,
      match: listSchema.isListItemTextNode,
    })

    const licEntries = Array.from(res)
    if (!licEntries.length) return null
    return licEntries[0][0]
  })()

  const isFocused = currentElement === element
  const isBulletVisible = !!str || isFocused

  if (!isBulletVisible) return null

  return <BulletContent collapsed={collapsed} nodeId={element.id} />
}
