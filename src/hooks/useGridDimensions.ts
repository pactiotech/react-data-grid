import { useRef, useState } from 'react';
import { useLayoutEffect } from './useLayoutEffect';

export function useGridDimensions(
  setFlexColumnWidths: React.Dispatch<React.SetStateAction<ReadonlyMap<string, number>>>
): [
  ref: React.RefObject<HTMLDivElement>,
  width: number,
  height: number,
  areDimensionsInitialized: boolean
] {
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridWidth, setGridWidth] = useState(1);
  const [gridHeight, setGridHeight] = useState(1);
  const [isInitialized, setInitialized] = useState(false);
  const prevGridWidth = useRef(gridWidth);

  useLayoutEffect(() => {
    const { ResizeObserver } = window;

    // don't break in Node.js (SSR), jest/jsdom, and browsers that don't support ResizeObserver
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (ResizeObserver == null) return;

    const resizeObserver = new ResizeObserver(() => {
      // Get dimensions without scrollbars.
      // The dimensions given by the callback entries in Firefox do not substract the scrollbar sizes.
      const { clientWidth, clientHeight } = gridRef.current!;
      // TODO: remove once fixed upstream
      // we reduce width by 1px here to avoid layout issues in Chrome
      // https://bugs.chromium.org/p/chromium/issues/detail?id=1206298
      const newWidth = clientWidth - (devicePixelRatio % 1 === 0 ? 0 : 1);
      setGridWidth(newWidth);
      setGridHeight(clientHeight);
      if (prevGridWidth.current !== newWidth) {
        prevGridWidth.current = newWidth;
        // Clear existing widths. This will trigger recalculation of visible flex columns again
        setFlexColumnWidths((widths) => (widths.size > 0 ? new Map() : widths));
      }
      setInitialized(true);
    });

    resizeObserver.observe(gridRef.current!);

    return () => {
      resizeObserver.disconnect();
    };
  }, [setFlexColumnWidths]);

  return [gridRef, gridWidth, gridHeight, isInitialized];
}
