'use client';

import { useEffect } from 'react';

export function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el, i) => {
      // Stagger among siblings
      let idx = 0;
      let prev = el.previousElementSibling;
      while (prev) {
        if (prev.classList && prev.classList.contains('reveal')) idx++;
        prev = prev.previousElementSibling;
      }
      if (idx) {
        (el as HTMLElement).style.transitionDelay = `${idx * 0.12}s`;
      }
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
