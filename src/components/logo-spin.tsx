'use client';

import { useEffect } from 'react';

export function LogoSpin() {
  useEffect(() => {
    const logo = document.querySelector('.wlogo');
    if (!logo) return;

    const interval = setInterval(() => {
      logo.classList.add('spin');
      setTimeout(() => {
        logo.classList.remove('spin');
      }, 860);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
