'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gift } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Cara Kerja', href: '#how-it-works' },
  { label: 'Fitur', href: '#features' },
  { label: 'Tentang', href: '#about' },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  return (
    <>
      <style>{`
        /* ── Desktop nav ── */
        .nav-root {
          position: sticky;
          top: 0;
          z-index: 40;
          background: var(--paper);
        }
        .nav-bar {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 24px;
          padding: 12px var(--gutter);
        }
        .nav-left {
          justify-self: start;
          display: flex;
          align-items: center;
        }
        .nav-center {
          justify-self: center;
          display: flex;
        }
        .nav-right {
          justify-self: end;
          display: flex;
          align-items: center;
        }
        .nav-link {
          font-family: var(--font-pixelify), monospace;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink);
          text-decoration: none;
          transition: opacity 0.2s;
          margin-right: 24px;
        }
        .nav-link:hover {
          opacity: 0.6;
        }
        .nav-cta {
          font-family: var(--font-pixelify), monospace;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink);
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .nav-cta:hover {
          opacity: 0.6;
        }

        /* ── Logo ── */
        .nav-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          background: var(--ink);
          clip-path: polygon(
            6px 0, calc(100% - 6px) 0,
            calc(100% - 6px) 3px, calc(100% - 3px) 3px,
            calc(100% - 3px) 6px, 100% 6px,
            100% calc(100% - 6px), calc(100% - 3px) calc(100% - 6px),
            calc(100% - 3px) calc(100% - 3px), calc(100% - 6px) calc(100% - 3px),
            calc(100% - 6px) 100%, 6px 100%,
            6px calc(100% - 3px), 3px calc(100% - 3px),
            3px calc(100% - 6px), 0 calc(100% - 6px),
            0 6px, 3px 6px, 3px 3px, 6px 3px, 6px 0
          );
          transition: transform 0.3s;
        }
        .nav-logo:hover {
          transform: scale(1.05);
        }

        /* ── Hamburger ── */
        .nav-hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 34px;
          height: 34px;
          background: var(--ink);
          border: none;
          cursor: pointer;
          padding: 0;
          position: relative;
          clip-path: polygon(
            6px 0, calc(100% - 6px) 0,
            calc(100% - 6px) 3px, calc(100% - 3px) 3px,
            calc(100% - 3px) 6px, 100% 6px,
            100% calc(100% - 6px), calc(100% - 3px) calc(100% - 6px),
            calc(100% - 3px) calc(100% - 3px), calc(100% - 6px) calc(100% - 3px),
            calc(100% - 6px) 100%, 6px 100%,
            6px calc(100% - 3px), 3px calc(100% - 3px),
            3px calc(100% - 6px), 0 calc(100% - 6px),
            0 6px, 3px 6px, 3px 3px, 6px 3px, 6px 0
          );
          z-index: 50;
        }
        .nav-hamburger-line {
          display: block;
          width: 14px;
          height: 1.5px;
          background: var(--paper);
          transition: all 0.4s cubic-bezier(0.77, 0, 0.175, 1);
          transform-origin: center;
        }
        .nav-hamburger-line:nth-child(1) {
          margin-bottom: 3.5px;
        }
        .nav-hamburger-line:nth-child(2) {
          margin-bottom: 3.5px;
        }

        /* Hamburger → X animation */
        .nav-hamburger[data-open="true"] .nav-hamburger-line:nth-child(1) {
          transform: translateY(5px) rotate(45deg);
        }
        .nav-hamburger[data-open="true"] .nav-hamburger-line:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .nav-hamburger[data-open="true"] .nav-hamburger-line:nth-child(3) {
          transform: translateY(-5px) rotate(-45deg);
        }

        /* ── Mobile overlay ── */
        .nav-overlay {
          position: fixed;
          inset: 0;
          background: var(--paper);
          z-index: 45;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.4s cubic-bezier(0.77, 0, 0.175, 1),
                      visibility 0.4s;
        }
        .nav-overlay[data-open="true"] {
          opacity: 1;
          visibility: visible;
        }

        /* ── Overlay content ── */
        .nav-overlay-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }
        .nav-overlay-link {
          font-family: var(--font-pixelify), monospace;
          font-size: 28px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink);
          text-decoration: none;
          padding: 12px 0;
          position: relative;
          transform: translateY(30px);
          opacity: 0;
          transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1),
                      opacity 0.5s cubic-bezier(0.77, 0, 0.175, 1),
                      color 0.2s;
        }
        .nav-overlay[data-open="true"] .nav-overlay-link {
          transform: translateY(0);
          opacity: 1;
        }
        .nav-overlay-link:nth-child(1) { transition-delay: 0.15s; }
        .nav-overlay-link:nth-child(2) { transition-delay: 0.25s; }
        .nav-overlay-link:nth-child(3) { transition-delay: 0.35s; }
        .nav-overlay-link:nth-child(4) { transition-delay: 0.45s; }
        .nav-overlay-link:nth-child(5) { transition-delay: 0.55s; }

        .nav-overlay-link:hover {
          color: var(--muted-craft);
        }

        .nav-overlay-link::after {
          content: '';
          position: absolute;
          bottom: 6px;
          left: 50%;
          width: 0;
          height: 1.5px;
          background: var(--ink);
          transition: width 0.3s, left 0.3s;
        }
        .nav-overlay-link:hover::after {
          width: 60%;
          left: 20%;
        }

        /* ── Overlay CTA button ── */
        .nav-overlay-cta {
          margin-top: 24px;
          font-family: var(--font-pixelify), monospace;
          font-size: 14px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--paper);
          background: var(--ink);
          border: none;
          padding: 12px 32px;
          clip-path: polygon(
            6px 0, calc(100% - 6px) 0,
            calc(100% - 6px) 3px, calc(100% - 3px) 3px,
            calc(100% - 3px) 6px, 100% 6px,
            100% calc(100% - 6px), calc(100% - 3px) calc(100% - 6px),
            calc(100% - 3px) calc(100% - 3px), calc(100% - 6px) calc(100% - 3px),
            calc(100% - 6px) 100%, 6px 100%,
            6px calc(100% - 3px), 3px calc(100% - 3px),
            3px calc(100% - 6px), 0 calc(100% - 6px),
            0 6px, 3px 6px, 3px 3px, 6px 3px, 6px 0
          );
          text-decoration: none;
          cursor: pointer;
          transform: translateY(20px);
          opacity: 0;
          transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1),
                      opacity 0.5s cubic-bezier(0.77, 0, 0.175, 1),
                      background 0.2s;
          transition-delay: 0s;
        }
        .nav-overlay[data-open="true"] .nav-overlay-cta {
          transform: translateY(0);
          opacity: 1;
          transition-delay: 0.55s;
        }
        .nav-overlay-cta:hover {
          background: var(--muted-craft);
        }

        /* ── Overlay deco line ── */
        .nav-overlay-deco {
          width: 40px;
          height: 1.5px;
          background: var(--ink);
          margin: 20px 0;
          transform: scaleX(0);
          transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1);
        }
        .nav-overlay[data-open="true"] .nav-overlay-deco {
          transform: scaleX(1);
          transition-delay: 0.1s;
        }

        /* ── Responsive ── */
        @media (max-width: 680px) {
          .nav-bar {
            grid-template-columns: auto 1fr auto;
            gap: 14px 16px;
            padding: 12px 20px;
          }
          .nav-left {
            display: none;
          }
          .nav-right {
            display: none;
          }
          .nav-hamburger {
            display: flex;
            grid-column: 3;
          }
          .nav-center {
            order: -1;
            grid-column: 1;
            justify-self: start;
          }
        }
      `}</style>

      <nav className="nav-root">
        {/* Desktop + mobile bar */}
        <div className="nav-bar">
          <div className="nav-left">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </div>

          <Link href="/" className="nav-center">
            <div className="nav-logo">
              <Gift className="size-5" style={{ color: 'var(--paper)' }} />
            </div>
          </Link>

          <div className="nav-right">
            <Link href="/history" className="nav-cta" style={{ marginRight: 24 }}>
              History
            </Link>
            <Link href="/create" className="nav-cta">
              Buat Card
            </Link>
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen((o) => !o)}
            data-open={mobileOpen}
            aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
          >
            <span className="nav-hamburger-line" />
            <span className="nav-hamburger-line" />
            <span className="nav-hamburger-line" />
          </button>
        </div>

        {/* Mobile overlay */}
        <div
          className="nav-overlay"
          data-open={mobileOpen}
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileOpen(false);
          }}
        >
          <div className="nav-overlay-content">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-overlay-link"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}

            <div className="nav-overlay-deco" />

            <Link
              href="/history"
              className="nav-overlay-link"
              onClick={() => setMobileOpen(false)}
            >
              History
            </Link>

            <Link
              href="/create"
              className="nav-overlay-cta"
              onClick={() => setMobileOpen(false)}
            >
              Buat Card
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export { Navbar };
