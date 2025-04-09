import type { CSSProperties } from 'react'
import type { Row } from '@tanstack/react-table'

import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { flexRender } from '@tanstack/react-table'
import { Button, TableCell, TableRow } from '@tinkerbells/xenon-ui'

import type { TableConstructorItemType } from '../../../../../types/tableProps'
import type { ConstructorAttributeType } from '../../../../../types/olapReportPage'

import { DragAndDropButton } from '../../../../../assets/Icons'

export function RowDragHandleCell({ rowId }: { rowId: string }) {
  const { attributes, listeners } = useSortable({
    id: rowId,
  })
  return (
    <Button {...attributes} {...listeners} variant="link" style={{ padding: '0px' }}>
      <DragAndDropButton />
    </Button>
  )
}

export function DraggableRow({ row }: { row: Row<ConstructorAttributeType | TableConstructorItemType> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.attributeId,
  })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform), // let dnd-kit do its thing
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
    pointerEvents: isDragging ? 'none' : 'auto',
    // height:"30px"
  }
  return (
    // connect row ref to dnd-kit, apply important styles
    <TableRow ref={setNodeRef} style={style}>
      {row.getVisibleCells().map(cell => (
        <TableCell
          // size={size}
          key={cell.id}
          style={{
            width: cell.column.getSize(),
            pointerEvents: isDragging ? 'none' : 'auto',
          }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}
