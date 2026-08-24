'use client';

import { useEffect } from 'react';

export function SplashCursor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const CELL = 6;
    let W = window.innerWidth;
    let H = window.innerHeight;

    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(W / CELL);
    canvas.height = Math.ceil(H / CELL);
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:999998;image-rendering:pixelated;image-rendering:crisp-edges;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d')!;

    document.body.style.cursor = 'none';

    const dot = document.createElement('div');
    dot.setAttribute('aria-hidden', 'true');
    dot.style.cssText =
      'position:fixed;top:0;left:0;width:10px;height:10px;background:#2d3a2e;pointer-events:none;z-index:999999;will-change:transform;transform:translate3d(-9999px,-9999px,0);';
    document.body.appendChild(dot);

    const cols = canvas.width;
    const rows = canvas.height;
    const heat = new Float32Array(cols * rows);

    let mx = -9999, my = -9999;
    let dx = 0, dy = 0;
    let lastMove = performance.now();

    function stamp(cx: number, cy: number, radius: number, val: number) {
      const cc = cx / CELL, cr = cy / CELL;
      const rad = Math.ceil(radius);
      const inv = 1 / (2 * rad * rad * 0.3);
      for (let dr = -rad; dr <= rad; dr++) {
        for (let dc = -rad; dc <= rad; dc++) {
          const c = (cc + dc) | 0, r = (cr + dr) | 0;
          if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
          const ddx = c + 0.5 - cc, ddy = r + 0.5 - cr;
          const w = Math.exp(-(ddx * ddx + ddy * ddy) * inv);
          if (w < 0.02) continue;
          const id = r * cols + c;
          let v = heat[id] + val * w;
          if (v > 1) v = 1;
          heat[id] = v;
        }
      }
    }

    function followPath(x: number, y: number, px: number, py: number, radius: number) {
      const ddx = x - px, ddy = y - py;
      const dl = Math.sqrt(ddx * ddx + ddy * ddy);
      const steps = Math.max(1, Math.min(40, Math.round(dl / (CELL * 0.6))));
      for (let s = 1; s <= steps; s++) {
        const f = s / steps;
        stamp(px + ddx * f, py + ddy * f, radius, 0.5);
      }
    }

    let pmx = -1, pmy = -1;

    function onMove(e: PointerEvent) {
      mx = e.clientX;
      my = e.clientY;
      lastMove = performance.now();

      if (pmx < 0) { pmx = mx; pmy = my; }

      dx = mx - pmx;
      dy = my - pmy;
      const speed = Math.sqrt(dx * dx + dy * dy);
      const radius = Math.min(12, 4 + speed * 0.08);
      const intensity = Math.min(0.8, 0.3 + speed * 0.004);

      followPath(mx, my, pmx, pmy, radius);
      stamp(mx, my, radius * 0.6, intensity);

      pmx = mx;
      pmy = my;
    }

    function draw() {
      ctx.clearRect(0, 0, cols, rows);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const v = heat[r * cols + c];
          if (v < 0.01) continue;

          const rr = Math.round(45 + (216 - 45) * v);
          const gg = Math.round(58 + (255 - 58) * v);
          const bb = Math.round(46 + (0 - 46) * v);
          ctx.fillStyle = `rgba(${rr},${gg},${bb},${v * 0.85})`;
          ctx.fillRect(c, r, 1, 1);
        }
      }

      for (let i = 0; i < heat.length; i++) {
        heat[i] *= 0.88;
        if (heat[i] < 0.003) heat[i] = 0;
      }
    }

    let raf = 0;
    function run() {
      dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
      draw();
      raf = requestAnimationFrame(run);
    }

    function onResize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.ceil(W / CELL);
      canvas.height = Math.ceil(H / CELL);
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('resize', onResize);
    raf = requestAnimationFrame(run);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
      canvas.remove();
      dot.remove();
      document.body.style.cursor = '';
    };
  }, []);

  return null;
}
