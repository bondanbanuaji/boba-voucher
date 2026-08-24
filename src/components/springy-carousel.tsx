'use client';

import { useEffect, useRef } from 'react';

export function SpringyCarousel() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    document.querySelectorAll<HTMLElement>('[data-slider]').forEach((sl) => {
      const track = sl.firstElementChild as HTMLElement;
      if (!track) return;

      let x = 0,
        vel = 0,
        dragging = false,
        lastX = 0,
        lastT = 0,
        maxX = 0,
        raf = 0,
        step = 0,
        target: number | null = null,
        prevB: HTMLButtonElement | null = null,
        nextB: HTMLButtonElement | null = null;
      const SNAP = !!matchMedia('(pointer:coarse)').matches;

      function bounds() {
        maxX = Math.min(0, sl.clientWidth - track.scrollWidth);
        const c = track.children;
        step =
          c.length > 1
            ? Math.abs(
                (c[1] as HTMLElement).getBoundingClientRect().left -
                  (c[0] as HTMLElement).getBoundingClientRect().left
              )
            : sl.clientWidth;
        if (!step) step = sl.clientWidth;
      }

      function snapX(px: number) {
        if (!step) return Math.max(maxX, Math.min(0, px));
        return Math.max(
          maxX,
          Math.min(0, Math.round(px / step) * step)
        );
      }

      bounds();
      addEventListener('resize', () => {
        bounds();
        clampSpring();
      });

      function apply() {
        track.style.transform = `translate3d(${x}px,0,0)`;
        if (prevB) {
          prevB.disabled = x >= -0.5;
          nextB!.disabled = x <= maxX + 0.5;
        }
      }

      function clampSpring() {
        if (x > 0) x = 0;
        if (x < maxX) x = maxX;
        apply();
      }

      function run() {
        raf = 0;
        if (dragging) {
          apply();
          return;
        }
        if (target !== null) {
          x += (target - x) * 0.18;
          if (Math.abs(target - x) < 0.3) {
            x = target;
            target = null;
            apply();
            return;
          }
          apply();
          raf = requestAnimationFrame(run);
          return;
        }
        x += vel;
        vel *= 0.94;
        if (x > 0) {
          x += (0 - x) * 0.18;
          vel *= 0.5;
        } else if (x < maxX) {
          x += (maxX - x) * 0.18;
          vel *= 0.5;
        }
        if (Math.abs(vel) > 0.06 || x > 0.5 || x < maxX - 0.5) {
          apply();
          raf = requestAnimationFrame(run);
        } else {
          x = Math.max(maxX, Math.min(0, Math.round(x / 14) * 14));
          vel = 0;
          apply();
        }
      }

      function kick() {
        if (!raf) raf = requestAnimationFrame(run);
      }

      let _sx = 0,
        _moved = false,
        _downA: HTMLAnchorElement | null = null;

      sl.addEventListener('pointerdown', (e: PointerEvent) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        e.preventDefault();
        dragging = true;
        sl.classList.add('drag');
        cancelAnimationFrame(raf);
        raf = 0;
        lastX = e.clientX;
        lastT = performance.now();
        vel = 0;
        target = null;
        _sx = e.clientX;
        _moved = false;
        _downA = e.target instanceof HTMLElement
          ? e.target.closest('a.slide')
          : null;
        try {
          sl.setPointerCapture(e.pointerId);
        } catch (_) {}
      });

      sl.addEventListener('pointermove', (e: PointerEvent) => {
        if (!dragging) return;
        const dx = e.clientX - lastX;
        const now = performance.now();
        const dt = now - lastT || 16;
        if (Math.abs(e.clientX - _sx) > 5) _moved = true;
        let nx = x + dx;
        if (nx > 0) nx = x + dx * 0.35;
        else if (nx < maxX) nx = x + dx * 0.35;
        x = nx;
        vel = (dx / dt) * 16;
        lastX = e.clientX;
        lastT = now;
        apply();
      });

      function up(nav: boolean) {
        if (!dragging) return;
        dragging = false;
        sl.classList.remove('drag');
        if (SNAP) {
          target = snapX(x + vel * 8);
          vel = 0;
        }
        kick();
        if (nav && !_moved && _downA) {
          const a = _downA;
          if (a.getAttribute('target') === '_blank') {
            window.open(a.href, '_blank', 'noopener');
          } else {
            location.href = a.href;
          }
        }
        _downA = null;
      }

      sl.addEventListener('pointerup', () => up(true));
      sl.addEventListener('pointercancel', () => up(false));

      sl.addEventListener(
        'wheel',
        (e: WheelEvent) => {
          if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
          vel = 0;
          x -= e.deltaX;
          clampSpring();
          e.preventDefault();
        },
        { passive: false }
      );

      if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
        const mkArrow = (
          cls: string,
          label: string,
          left: boolean,
          sign: number
        ) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = `sl-arrow ${cls}`;
          b.setAttribute('aria-label', label);
          b.innerHTML = left
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';
          b.addEventListener('pointerdown', (e) => e.stopPropagation());
          b.addEventListener('click', (e) => {
            e.preventDefault();
            target = snapX(x + sign * step);
            kick();
          });
          sl.appendChild(b);
          return b;
        };
        prevB = mkArrow('prev', 'Previous slides', true, 1);
        nextB = mkArrow('next', 'Next slides', false, -1);
        apply();
      }

      track.querySelectorAll('a.slide').forEach((a) => {
        a.addEventListener('click', (e) => {
          if ((e as MouseEvent).detail !== 0) e.preventDefault();
        });
      });

      // Add "view" CTA labels
      const ctaLabel = sl.closest('#lab')
        ? 'View experiment'
        : 'View case study';
      track.querySelectorAll('a.slide.cs .csm').forEach((m) => {
        const c = document.createElement('span');
        c.className = 'reveal-cta';
        m.appendChild(c);
        const clip = document.createElement('span');
        clip.className = 'rc-clip';
        const inn = document.createElement('span');
        inn.className = 'rc-i';
        inn.textContent = ctaLabel;
        clip.appendChild(inn);
        m.appendChild(clip);
      });

      bounds();
      requestAnimationFrame(() => bounds());
    });
  }, []);

  return null;
}
