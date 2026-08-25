'use client';

import Link from 'next/link';

function Footer() {
  return (
    <footer
      className="w-full border-t py-4 px-4 text-center"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--paper)',
      }}
    >
      <p className="text-xs" style={{ color: 'var(--muted-craft)' }}>
        Dibuat oleh{' '}
        <a
          href="https://github.com/bondanbanuaji"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-70 transition-opacity"
          style={{ color: 'var(--ink)' }}
        >
          Bondan Banuaji
        </a>
        {' '}&middot;{' '}
        <Link href="/" className="underline hover:opacity-70 transition-opacity" style={{ color: 'var(--ink)' }}>
          Boba Card
        </Link>
      </p>
    </footer>
  );
}

export { Footer };
