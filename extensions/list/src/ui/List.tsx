import { useMemo } from 'react'
import { Box } from '@fower/react'
import { Path } from 'slate'
import { useEditor, useEditorStatic } from '@penx/editor-common'
import { findNodePath, getNodeByPath } from '@penx/editor-queries'
import { ElementProps } from '@penx/extension-typings'
import { isListContentElement } from '../guard'
import { ListElement } from '../types'

export const List = ({
  attributes,
  children,
  element,
  nodeProps,
}: ElementProps<ListElement>) => {
  const editor = useEditor()
  const path = findNodePath(editor, element)!

  const collapsed = useMemo(() => {
    if (path.length === 1) return false
    const prevPath = Path.previous(path)
    const node = getNodeByPath(editor, prevPath)!
    if (isListContentElement(node)) return node.collapsed
    return false
  }, [path, editor])

  return (
    <Box
      data-type="list"
      {...attributes}
      m0
      pl8
      {...nodeProps}
      bgRed100={collapsed}
    >
      <Box hidden={collapsed}>{children}</Box>
    </Box>
  )
}
