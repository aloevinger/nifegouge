import { useRef, useEffect, useCallback } from 'react';

export function useVarRowsScale() {
  const wrapperRef = useRef(null);
  const innerRef = useRef(null);

  const updateScale = useCallback(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;
    const available = wrapper.offsetWidth;
    const scrollW = inner.scrollWidth;
    // inner uses justify-content:center so columns overflow symmetrically.
    // scrollWidth captures only right-side overflow; full content width = 2*scrollW - available.
    if (scrollW > available) {
      const naturalWidth = 2 * scrollW - available;
      const scale = available / naturalWidth;
      inner.style.transform = `scale(${scale})`;
      inner.style.transformOrigin = 'top center';
      wrapper.style.height = `${inner.offsetHeight * scale}px`;
    } else {
      inner.style.transform = '';
      wrapper.style.height = '';
    }
  }, []);

  useEffect(() => {
    const obs = new ResizeObserver(() => requestAnimationFrame(updateScale));
    if (wrapperRef.current) obs.observe(wrapperRef.current);
    return () => obs.disconnect();
  }, [updateScale]);

  return { wrapperRef, innerRef, updateScale };
}
