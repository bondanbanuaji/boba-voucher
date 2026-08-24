'use client';

import { useEffect } from 'react';

export function SmoothScroll() {
  useEffect(() => {
    // Only on pointer devices with fine pointer
    if (!window.matchMedia) return;
    if (matchMedia('(hover: none)').matches) return;
    if (matchMedia('(pointer: coarse)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let target = window.scrollY || 0;
    let cur = target;
    let raf = 0;

    function maxY() {
      return Math.max(0, document.documentElement.scrollHeight - innerHeight);
    }

    function run() {
      const d = target - cur;
      if (Math.abs(d) < 0.4) {
        cur = target;
        window.scrollTo({ top: cur, behavior: 'instant' });
        raf = 0;
        return;
      }
      cur += d * 0.18;
      window.scrollTo({ top: cur, behavior: 'instant' });
      raf = requestAnimationFrame(run);
    }

    function onWheel(e: WheelEvent) {
      if (e.ctrlKey || e.defaultPrevented) return;
      if (!raf) {
        cur = target = window.scrollY;
      }
      const dy =
        e.deltaY *
        (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1);
      target = Math.max(0, Math.min(maxY(), target + dy));
      if (!raf) raf = requestAnimationFrame(run);
      e.preventDefault();
    }

    function onKey() {
      if (!raf) {
        cur = target = window.scrollY;
      }
    }

    function onResize() {
      cur = target = window.scrollY;
    }

    addEventListener('wheel', onWheel, { passive: false });
    addEventListener('keydown', onKey);
    addEventListener('resize', onResize);

    return () => {
      removeEventListener('wheel', onWheel);
      removeEventListener('keydown', onKey);
      removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
