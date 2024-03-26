import { memo, useLayoutEffect } from 'react';
import { css } from '@linaria/core';

import { createCellEvent, getCellClassname, getCellStyle, isCellEditableUtil } from './utils';
import type { CellRendererProps } from './types';

const cellCopied = css`
  @layer rdg.Cell {
    background-color: #ccccff;
  }
`;

const cellCopiedClassname = `rdg-cell-copied ${cellCopied}`;

const cellDraggedOver = css`
  @layer rdg.Cell {
    background-color: #ccccff;

    &.${cellCopied} {
      background-color: #9999ff;
    }
  }
`;

const cellDraggedOverClassname = `rdg-cell-dragged-over ${cellDraggedOver}`;

function Cell<R, SR>({
  column,
  colSpan,
  isCellSelected,
  isCopied,
  isDraggedOver,
  tempClassname,
  row,
  rowIdx,
  onClick,
  onDoubleClick,
  onContextMenu,
  onRowChange,
  selectCell,
  onPaste,
  ...props
}: CellRendererProps<R, SR>) {
  const { cellClass, cellDataAttributes } = column;
  className = getCellClassname(
    column,
    {
      [cellCopiedClassname]: isCopied,
      [cellDraggedOverClassname]: isDraggedOver,
      ...(tempClassname
        ? {
            [tempClassname]: true
          }
        : {})
    },
    typeof cellClass === 'function' ? cellClass(row) : cellClass
  );
  const isEditable = isCellEditableUtil(column, row);

  const dataAttributes =
    typeof cellDataAttributes === 'function' ? cellDataAttributes(row) : cellDataAttributes;

  function selectCellWrapper(openEditor?: boolean) {
    selectCell({ rowIdx, idx: column.idx }, openEditor);
  }

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    if (onClick) {
      const cellEvent = createCellEvent(event);
      onClick({ row, column, selectCell: selectCellWrapper }, cellEvent);
      if (cellEvent.isGridDefaultPrevented()) return;
    }
    selectCellWrapper();
  }

  function handleContextMenu(event: React.MouseEvent<HTMLDivElement>) {
    if (onContextMenu) {
      const cellEvent = createCellEvent(event);
      onContextMenu({ row, column, selectCell: selectCellWrapper }, cellEvent);
      if (cellEvent.isGridDefaultPrevented()) return;
    }
    selectCellWrapper();
  }

  function handleDoubleClick(event: React.MouseEvent<HTMLDivElement>) {
    if (onDoubleClick) {
      const cellEvent = createCellEvent(event);
      onDoubleClick({ row, column, selectCell: selectCellWrapper }, cellEvent);
      if (cellEvent.isGridDefaultPrevented()) return;
    }
    selectCellWrapper(true);
  }

  function handleRowChange(newRow: R) {
    onRowChange(column, newRow);
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
      aria-colspan={colSpan}
      aria-selected={isCellSelected}
      aria-readonly={!isEditable || undefined}
      tabIndex={tabIndex}
      className={className}
      style={getCellStyle(column, colSpan)}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      tabIndex={isCellSelected ? 0 : -1}
      onPaste={onPaste}
      {...dataAttributes}
      onFocus={onFocus}
      {...props}
    >
      {column.renderCell({
        column,
        row,
        rowIdx,
        isCellEditable: isEditable,
        tabIndex: childTabIndex,
        onRowChange: handleRowChange
      })}
    </div>
  );
}

export default memo(Cell) as <R, SR>(props: CellRendererProps<R, SR>) => JSX.Element;
