import { css } from '@linaria/core';

// height: var(--row-height);

export const row = css`
  @layer rdg.Row {
    display: contents;
    line-height: var(--rdg-row-height);
    background-color: var(--rdg-background-color);

    &:hover {
      background-color: var(--rdg-row-hover-background-color);
    }

    &[aria-selected='true'] {
      background-color: var(--rdg-row-selected-background-color);

      &:hover {
        background-color: var(--rdg-row-selected-hover-background-color);
      }
    }
  }
`;

export const rowClassname = `rdg-row ${row}`;

// const summaryRow = css`
//   position: sticky;
//   z-index: 3;
//   grid-template-rows: var(--summary-row-height);
//   height: var(--summary-row-height);
//   line-height: var(--summary-row-height);

//   > .${cell} {
//     border-top: 2px solid var(--summary-border-color);
//   }
// `;

export const rowSelected = css`
  @layer rdg.FocusSink {
    outline: 2px solid var(--rdg-selection-color);
    outline-offset: -2px;
  }
`;

export const rowSelectedClassname = 'rdg-row-selected';

export const rowSelectedWithFrozenCell = css`
  @layer rdg.FocusSink {
    &::before {
      content: '';
      display: inline-block;
      height: 100%;
      position: sticky;
      inset-inline-start: 0;
      border-inline-start: 2px solid var(--rdg-selection-color);
    }
  }
`;

export const topSummaryRowClassname = 'rdg-top-summary-row';

export const bottomSummaryRowClassname = 'rdg-bottom-summary-row';
