'use client';

import { useEffect } from 'react';

export function PixelCursor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!matchMedia) return;
    if (matchMedia('(hover: none)').matches) return;
    if (matchMedia('(pointer: coarse)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const CELL = 9;
    const BRUSH = 18;
    let W = window.innerWidth;
    let H = window.innerHeight;

    // --- Canvas for pixel trail ---
    const cvs = document.createElement('canvas');
    cvs.width = Math.ceil(W / CELL);
    cvs.height = Math.ceil(H / CELL);
    Object.assign(cvs.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: '999990',
      imageRendering: 'pixelated',
    });
    const ctx = cvs.getContext('2d')!;
    document.body.appendChild(cvs);

    // --- Cursor dot (small pixel skull) ---
    const dot = document.createElement('div');
    dot.setAttribute('aria-hidden', 'true');
    Object.assign(dot.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '9px',
      height: '9px',
      background: '#2d3a2e',
      pointerEvents: 'none',
      zIndex: '999999',
      willChange: 'transform',
      transform: 'translate3d(-9999px,-9999px,0)',
      imageRendering: 'pixelated',
    });
    document.body.appendChild(dot);

    // --- Follow box (larger, lagging) ---
    const follow = document.createElement('div');
    follow.setAttribute('aria-hidden', 'true');
    Object.assign(follow.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '42px',
      height: '42px',
      border: '1px solid #2d3a2e',
      borderRadius: '0',
      pointerEvents: 'none',
      zIndex: '999998',
      willChange: 'transform',
      transform: 'translate3d(-9999px,-9999px,0)',
      transition: 'width 0.3s ease, height 0.3s ease, border-radius 0.3s ease',
    });
    document.body.appendChild(follow);

    // --- Cursor label (shows text near cursor on certain elements) ---
    const label = document.createElement('div');
    label.setAttribute('aria-hidden', 'true');
    Object.assign(label.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      pointerEvents: 'none',
      zIndex: '999997',
      willChange: 'transform',
      transform: 'translate3d(-9999px,-9999px,0)',
      fontFamily: 'var(--font-pixelify), monospace',
      fontSize: '10px',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: '#2d3a2e',
      whiteSpace: 'nowrap',
      transition: 'opacity 0.2s ease',
      opacity: '0',
    });
    document.body.appendChild(label);

    document.body.style.cursor = 'none';

    // --- State ---
    let mx = -9999, my = -9999;
    let fx = -9999, fy = -9999;
    let dotX = -9999, dotY = -9999;
    let scale = 1;
    let lastMove = performance.now() / 1000;
    let idle = false;
    let pacOn = false;
    let pacx = 0, pacy = 0, pacDir = 1, pacAge = 0;
    let pacStartX = 0;
    let hoverEl: HTMLElement | null = null;
    let cursorLabel = '';
    let animFrame = 0;

    // --- Heat map for pixel trail ---
    const cols = cvs.width;
    const rows = cvs.height;
    const heat = new Float32Array(cols * rows);

    function dep(cx: number, cy: number, amt: number, sig: number) {
      const cc = cx / CELL, cr = cy / CELL;
      const rad = Math.ceil(sig * 1.6);
      const inv = 1 / (2 * sig * sig * 0.18);
      for (let dr = -rad; dr <= rad; dr++) {
        for (let dc = -rad; dc <= rad; dc++) {
          const c = (cc + dc) | 0, r = (cr + dr) | 0;
          if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
          const dx = c + 0.5 - cc, dy = r + 0.5 - cr;
          const w = Math.exp(-(dx * dx + dy * dy) * inv);
          if (w < 0.02) continue;
          const id = r * cols + c;
          let vv = heat[id] + amt * w;
          heat[id] = vv > 1 ? 1 : vv;
        }
      }
    }

    // --- Draw pixel trail on canvas ---
    function drawHeat() {
      ctx.clearRect(0, 0, cols, rows);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const v = heat[r * cols + c];
          if (v < 0.01) continue;
          // Color: neon green (#d8ff00) → dark (#2d3a2e) based on value
          const rr = Math.round(45 + (216 - 45) * v);
          const gg = Math.round(58 + (255 - 58) * v);
          const bb = Math.round(46 + (0 - 46) * v);
          ctx.fillStyle = `rgba(${rr},${gg},${bb},${v * 0.7})`;
          ctx.fillRect(c, r, 1, 1);
        }
      }
    }

    // --- Pac-Man shape ---
    function drawPacman(cx: number, cy: number, rad: number, ang: number, mouth: number) {
      const c0 = Math.floor((cx - rad) / CELL);
      const c1 = Math.ceil((cx + rad) / CELL);
      const r0 = Math.floor((cy - rad) / CELL);
      const r1 = Math.ceil((cy + rad) / CELL);
      const rr = rad * rad;
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
          const dx = (c + 0.5) * CELL - cx;
          const dy = (r + 0.5) * CELL - cy;
          if (dx * dx + dy * dy > rr) continue;
          const da = Math.abs((((Math.atan2(dy, dx) - ang) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2) - Math.PI);
          if (da < mouth) continue;
          const id = r * cols + c;
          const v = 0.72 + 0.03 * Math.sin((c * 0.7 + r * 0.7) - performance.now() * 0.00001);
          if (v > heat[id]) heat[id] = v;
        }
      }
    }

    // --- Pac-Man wander ---
    function wander(tt: number) {
      if (!pacOn) {
        pacOn = true;
        pacDir = mx < W * 0.5 ? 1 : -1;
        pacx = mx; pacy = my;
        pacStartX = mx; pacAge = 0;
      }
      const rad = BRUSH * 3.4;
      pacAge++;
      pacx += pacDir * 2.6;
      if (pacx > W + rad + 12 || pacx < -rad - 12) {
        pacDir = Math.random() < 0.5 ? 1 : -1;
        pacy = 70 + Math.random() * (H - 140);
        pacx = pacDir > 0 ? -rad : W + rad;
        pacStartX = pacx;
        pacAge = 0;
      }
      const ang = pacDir > 0 ? 0 : Math.PI;
      const pr = Math.round(pacy / CELL);
      for (let k = 1; k <= 80; k++) {
        const px = pacStartX + pacDir * BRUSH * 3.4 * k;
        if (px < -20 || px > W + 20) continue;
        if (pacDir * (px - pacx) > rad * 0.7) {
          const pc = Math.round(px / CELL);
          if (pc >= 0 && pr >= 0 && pc < cols && pr < rows) {
            const pid = pr * cols + pc;
            if (0.72 > heat[pid]) heat[pid] = 0.72;
          }
        }
      }
      const mouth = 0.05 + 0.6 * Math.abs(Math.sin(pacAge * 0.16));
      drawPacman(pacx, pacy, rad, ang, mouth);
    }

    // --- Stamp a disk of heat ---
    function stampDisk(cx: number, cy: number, rad: number, val: number) {
      if (rad < 3) return;
      const c0 = Math.floor((cx - rad) / CELL);
      const c1 = Math.ceil((cx + rad) / CELL);
      const r0 = Math.floor((cy - rad) / CELL);
      const r1 = Math.ceil((cy + rad) / CELL);
      const rr = rad * rad;
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
          const dx = (c + 0.5) * CELL - cx;
          const dy = (r + 0.5) * CELL - cy;
          if (dx * dx + dy * dy > rr) continue;
          const id = r * cols + c;
          const v = val + 0.03 * Math.sin((c * 0.7 + r * 0.7) - performance.now() * 0.00001);
          if (v > heat[id]) heat[id] = v;
        }
      }
    }

    // --- Stamp pixel text ---
    const txtC = document.createElement('canvas');
    const txc = txtC.getContext('2d')!;
    const TXT = 'boba voucher · ';
    let txtW = 0;
    const TXH = 14;
    let txtData: Uint8ClampedArray | null = null;
    let txtScroll = 0;

    function buildTxt() {
      txc.font = '14px monospace';
      txtW = Math.max(8, Math.ceil(txc.measureText(TXT).width));
      txtC.width = txtW;
      txtC.height = TXH;
      txc.font = '14px monospace';
      txc.textBaseline = 'middle';
      txc.fillStyle = '#000';
      txc.clearRect(0, 0, txtW, TXH);
      txc.fillText(TXT, 0, TXH / 2);
      txtData = txc.getImageData(0, 0, txtW, TXH).data;
    }

    function stampText(cx: number, cy: number) {
      if (!txtData) buildTxt();
      const br = Math.round(cy / CELL) - (TXH >> 1);
      const so = Math.floor(txtScroll);
      for (let lc = 0; lc < cols; lc++) {
        const mc = ((so + lc) % txtW + txtW) % txtW;
        for (let lr = 0; lr < TXH; lr++) {
          if (txtData![(lr * txtW + mc) * 4 + 3] > 80) {
            const R = br + lr;
            if (R < 0 || R >= rows) continue;
            const id = R * cols + lc;
            const ww = 0.84 + 0.14 * Math.sin((lc * 0.6 + lr * 0.6) - performance.now() * 0.000006);
            if (ww > heat[id]) heat[id] = ww;
          }
        }
      }
    }

    // --- Follow blob along path ---
    let pmx = -1, pmy = -1;
    function followPath(x: number, y: number, sig: number) {
      if (pmx < 0) { pmx = x; pmy = y; }
      const dx = x - pmx, dy = y - pmy;
      const dl = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(1, Math.min(48, Math.round(dl / (CELL * 0.8))));
      for (let s = 1; s <= steps; s++) {
        const f = s / steps;
        dep(pmx + dx * f, pmy + dy * f, 0.16, sig);
      }
      pmx = x; pmy = y;
    }

    // --- Stamp heart pixel art ---
    const HEART = [[2,1],[3,1],[5,1],[6,1],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[2,4],[3,4],[4,4],[5,4],[6,4],[3,5],[4,5],[5,5],[4,6]];
    function stampHeart(cx: number, cy: number) {
      const S = 2;
      const bc = Math.round(cx / CELL), br = Math.round(cy / CELL);
      const o = 4 * S;
      for (const k of HEART) {
        for (let yy = 0; yy < S; yy++) {
          for (let xx = 0; xx < S; xx++) {
            const C = bc + k[0] * S + xx - o;
            const R = br + k[1] * S + yy - o;
            if (C < 0 || R < 0 || C >= cols || R >= rows) continue;
            const id = R * cols + C;
            const w = 0.86 + 0.12 * Math.sin((C * 0.6 + R * 0.6) - performance.now() * 0.000006);
            if (w > heat[id]) heat[id] = w;
          }
        }
      }
    }

    // --- Zone detection ---
    function zoneOf(el: EventTarget | null): string {
      if (!el || !(el as HTMLElement).closest) return '';
      const e = el as HTMLElement;
      if (e.closest('.cta, footer')) return 'text';
      if (e.closest('#about')) return 'heart';
      return '';
    }

    // --- Section detection for auto-blob ---
    function spans(el: HTMLElement | null, y: number) {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top < y && r.bottom > y;
    }

    // --- Interact with hover elements ---
    function findHoverEl(el: EventTarget | null): HTMLElement | null {
      if (!el || !(el as HTMLElement).closest) return null;
      const e = el as HTMLElement;
      return e.closest('a, button, .slide, .btn, [role="button"]') as HTMLElement | null;
    }

    // --- Event handlers ---
    function onMove(e: PointerEvent) {
      mx = e.clientX;
      my = e.clientY;
      lastMove = performance.now() / 1000;
      if (pacOn) pacOn = false;
      idle = false;

      const newHover = findHoverEl(e.target);
      if (newHover !== hoverEl) {
        hoverEl = newHover;
        if (hoverEl) {
          cursorLabel = hoverEl.getAttribute('data-cursor-label') || '';
          follow.style.width = '52px';
          follow.style.height = '52px';
          follow.style.borderColor = '#B85C3A';
        } else {
          cursorLabel = '';
          follow.style.width = '42px';
          follow.style.height = '42px';
          follow.style.borderColor = '#2d3a2e';
        }
      }
    }

    function onDown(e: PointerEvent) {
      if ((e.target as HTMLElement)?.closest?.('a, button, input')) return;
      scale = 0.36;
      follow.style.width = '18px';
      follow.style.height = '18px';
    }

    function onUp() {
      scale = 1;
      if (!hoverEl) {
        follow.style.width = '42px';
        follow.style.height = '42px';
        follow.style.borderColor = '#2d3a2e';
      }
    }

    function onResize() {
      W = window.innerWidth;
      H = window.innerHeight;
      cvs.width = Math.ceil(W / CELL);
      cvs.height = Math.ceil(H / CELL);
    }

    // --- Main loop ---
    function run() {
      const now = performance.now() / 1000;
      const idleTime = now - lastMove;

      // Easing
      dotX += (mx - dotX) * 0.25;
      dotY += (my - dotY) * 0.25;
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;

      // Position elements
      dot.style.transform = `translate3d(${dotX}px,${dotY}px,0)`;
      follow.style.transform = `translate3d(${fx}px,${fy}px,0) scale(${scale})`;
      label.style.transform = `translate3d(${mx + 18}px,${my - 12}px,0)`;
      label.textContent = cursorLabel;
      label.style.opacity = cursorLabel ? '1' : '0';

      // Cursor trail
      if (mx > 0 && my > 0) {
        const zone = zoneOf(document.elementFromPoint(mx, my));

        if (zone === 'heart') {
          stampHeart(mx, my);
          pmx = mx; pmy = my;
        } else if (zone === 'text') {
          followPath(mx, my, my > H * 0.7 ? BRUSH * 0.5 : BRUSH);
          txtScroll += 0.5;
          stampText(mx, my);
        } else {
          followPath(mx, my, BRUSH);
        }
      }

      // Pac-Man idle
      if (idleTime > 3 && mx > 0) {
        wander(now);
        pmx = mx; pmy = my;
      }

      // Decay heat
      for (let i = 0; i < heat.length; i++) {
        heat[i] *= 0.87;
        if (heat[i] < 0.003) heat[i] = 0;
      }

      drawHeat();
      animFrame = requestAnimationFrame(run);
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('resize', onResize);

    animFrame = requestAnimationFrame(run);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animFrame);
      cvs.remove();
      dot.remove();
      follow.remove();
      label.remove();
      document.body.style.cursor = '';
    };
  }, []);

  return null;
}
