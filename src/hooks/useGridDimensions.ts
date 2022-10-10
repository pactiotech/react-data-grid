import { useLayoutEffect, useRef, useState } from 'react';

export function useGridDimensions(): [
  ref: React.RefObject<HTMLDivElement>,
  width: number,
  height: number
] {
  const gridRef = useRef<HTMLDivElement>(null);
  // keep track of the old width and the new width to avoid twitching
  const [gridWidth, setGridWidth] = useState([0, 1]);
  const [gridHeight, setGridHeight] = useState(1);

  useLayoutEffect(() => {
    const { ResizeObserver } = window;

    // don't break in Node.js (SSR), jest/jsdom, and browsers that don't support ResizeObserver
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (ResizeObserver == null) return;

    function saveDimensions() {
      // Get dimensions without scrollbars.
      // The dimensions given by the callback entries in Firefox do not substract the scrollbar sizes.
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1733042
      const { clientWidth, clientHeight } = gridRef.current!;
      // TODO: remove once fixed upstream
      // we reduce width by 1px here to avoid layout issues in Chrome
      // https://bugs.chromium.org/p/chromium/issues/detail?id=1206298
      setGridWidth((prev: number[]) => {
        const newValue = clientWidth - (devicePixelRatio % 1 === 0 ? 0 : 1);

        // If the new value is the same as the previous value, just ignore it.
        // If we change back the value to the old one, we will end up with
        // and infinite loop of twitching.
        if (prev[0] === newValue) {
          return prev;
        }

        return [prev[1], newValue];
      });
      setGridHeight(clientHeight);
    }

    saveDimensions();
    const resizeObserver = new ResizeObserver(saveDimensions);
    resizeObserver.observe(gridRef.current!);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return [gridRef, gridWidth[1], gridHeight];
}
