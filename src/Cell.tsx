import { forwardRef, memo, useLayoutEffect } from 'react';
import type { RefAttributes } from 'react';
import { css } from '@linaria/core';

import { getCellStyle, getCellClassname, isCellEditable } from './utils';
import type { CellRendererProps } from './types';

const cellCopied = css`
  background-color: #ccccff;
`;

const cellCopiedClassname = `rdg-cell-copied ${cellCopied}`;

const cellDraggedOver = css`
  background-color: #ccccff;

  &.${cellCopied} {
    background-color: #9999ff;
  }
`;

const cellDraggedOverClassname = `rdg-cell-dragged-over ${cellDraggedOver}`;

// const cellDragHandle = css`
//   cursor: move;
//   position: absolute;
//   right: 0;
//   bottom: 0;
//   width: 8px;
//   height: 8px;
//   background-color: var(--selection-color);

//   &:hover {
//     width: 16px;
//     height: 16px;
//     border: 2px solid var(--selection-color);
//     background-color: var(--background-color);
//   }
// `;

const cellDragHandleClassname = `rdg-cell-drag-handle`;

function Cell<R, SR>(
  {
    className,
    column,
    colSpan,
    isCellSelected,
    isCopied,
    isDraggedOver,
    tempClassname,
    row,
    rowIdx,
    dragHandleProps,
    onRowClick,
    onClick,
    onDoubleClick,
    onContextMenu,
    onRowChange,
    selectCell,
    onPaste,
    ...props
  }: CellRendererProps<R, SR>,
  ref: React.Ref<HTMLDivElement>
) {
  const { cellClass } = column;
  className = getCellClassname(
    column,
    {
      [cellCopiedClassname]: isCopied,
      [cellDraggedOverClassname]: isDraggedOver,
      ...(
        tempClassname ? {
          [tempClassname]: true,
        } : {}
      )
    },
    typeof cellClass === 'function' ? cellClass(row) : cellClass,
    className
  );

  function selectCellWrapper(openEditor?: boolean | null) {
    selectCell({ idx: column.idx, rowIdx }, openEditor);
  }

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    selectCellWrapper(column.editorOptions?.editOnClick);
    onRowClick?.(rowIdx, row, column);
    onClick?.(event);
  }

  function handleContextMenu(event: React.MouseEvent<HTMLDivElement>) {
    selectCellWrapper();
    onContextMenu?.(event);
  }

  function handleDoubleClick(event: React.MouseEvent<HTMLDivElement>) {
    selectCellWrapper(true);
    onDoubleClick?.(event);
  }

  function handleRowChange(newRow: R) {
    onRowChange(rowIdx, newRow);
  }

  useLayoutEffect(() => {
    if (!isCellSelected) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    (ref as { current: { focus: ({ preventScroll }: Record<string, boolean>) => void } })?.current
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      ?.focus?.({ preventScroll: true });
  }, [isCellSelected, ref]);

  return (
    <div
      role="gridcell"
      aria-colindex={column.idx + 1} // aria-colindex is 1-based
      aria-selected={isCellSelected}
      aria-colspan={colSpan}
      aria-readonly={!isCellEditable(column, row) || undefined}
      ref={ref}
      className={className}
      style={getCellStyle(column, colSpan)}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      tabIndex={isCellSelected ? 0 : -1}
      onPaste={onPaste}
      {...props}
    >
      {!column.rowGroup && (
        <>
          <column.formatter
            column={column}
            rowIdx={rowIdx}
            row={row}
            isCellSelected={isCellSelected}
            onRowChange={handleRowChange}
          />
          {dragHandleProps && <div className={cellDragHandleClassname} {...dragHandleProps} />}
        </>
      )}
    </div>
  );
}

export default memo(forwardRef(Cell)) as <R, SR>(
  props: CellRendererProps<R, SR> & RefAttributes<HTMLDivElement>
) => JSX.Element;
