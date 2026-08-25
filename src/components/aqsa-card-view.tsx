'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  CheckCircle2,
  Clock,
  Ban,
  X,
} from 'lucide-react';
import { getTemplate } from '@/lib/templates';
import { toPng } from 'html-to-image';
import type { Card } from '@/types';

type ClaimStep = 'view' | 'confirm' | 'loading' | 'success';

function AnimatedTitle({ text, delay, instant }: { text: string; delay: number; instant?: boolean }) {
  const [visible, setVisible] = useState(instant || false);
  useEffect(() => {
    if (instant) {
      setVisible(true);
      return;
    }
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay, instant]);

  return (
    <h1 className="boba-title-text">
      {text.split('').map((char, i) => (
        <span
          key={i}
          style={instant ? { animationDelay: '0s' } : { animationDelay: `${delay + i * 0.08}s` }}
          className={visible ? 'boba-letter-visible' : 'boba-letter-hidden'}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </h1>
  );
}

function RotatingCircle({ text }: { text: string }) {
  const chars = text.split('');
  const deg = 360 / chars.length;
  return (
    <div className="boba-rotating-circle-wrapper">
      <div className="boba-rotating-circle">
        {chars.map((char, i) => (
          <span
            key={i}
            className="boba-circle-char"
            style={{ transform: `rotate(${deg * (i + 1)}deg) translateY(-38px)` }}
          >
            {char}
          </span>
        ))}
      </div>
      <div className="boba-circle-heart">&#10084;</div>
    </div>
  );
}

export default function AqsaCardView({ card, staticView = false }: { card: Card; staticView?: boolean }) {
  const [step, setStep] = useState<ClaimStep>('view');
  const [downloading, setDownloading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMail, setShowMail] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const tpl = getTemplate(card.templateId);
  const isExpired = new Date(card.expiresAt) < new Date();
  const canClaim = card.status === 'ACTIVE' && !isExpired;

  const currentStatus = isExpired ? 'EXPIRED' : card.status;

  const expiry = new Date(card.expiresAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const [dateText, setDateText] = useState(staticView ? expiry : '');

  const createdDate = new Date(card.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const statusConfig: Record<string, { label: string; icon: typeof CheckCircle2; color: string; bg: string; border: string }> = {
    ACTIVE: { label: 'Aktif', icon: CheckCircle2, color: '#16a34a', bg: '#dcfce7', border: '#16a34a' },
    CLAIMED: { label: 'Sudah Diklaim', icon: CheckCircle2, color: '#2563eb', bg: '#dbeafe', border: '#2563eb' },
  };
  if (isExpired) {
    statusConfig.EXPIRED = { label: 'Kadaluarsa', icon: Clock, color: '#d97706', bg: '#fef3c7', border: '#d97706' };
  }
  const statusInfo = statusConfig[currentStatus] || statusConfig.ACTIVE;
  const StatusIcon = statusInfo.icon;

  useEffect(() => {
    if (staticView) return;
    const datetxt = expiry;
    let currentIndex = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex < datetxt.length) {
          setDateText(datetxt.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }, 12000);
    return () => clearTimeout(timer);
  }, [expiry, staticView]);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
  }

  function handleShareWhatsApp() {
    const isClaimed = currentStatus === 'CLAIMED' || step === 'success';
    const text = isClaimed
      ? `Yeayyy! Aku udah baca card ucapan spesial ini 🎁✨\n\nMakasih banyak ya! Card-nya manis banget 💕\n\nCoba buka juga: ${window.location.href}`
      : `Hay! Ada card ucapan spesial nih buat kamu 🎁\n\nKlaim sekarang ya: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  function handleShareTelegram() {
    const isClaimed = currentStatus === 'CLAIMED' || step === 'success';
    const text = isClaimed
      ? `Yeayyy! Aku udah baca card ucapan spesial ini 🎁✨\n\nMakasih banyak ya!`
      : `Hay! Ada card ucapan spesial nih buat kamu 🎁`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`, '_blank');
  }

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: undefined,
      });
      const link = document.createElement('a');
      link.download = `card-${card.title.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  }, [downloading, card.title]);

  async function handleConfirmClaim() {
    setStep('loading');
    try {
      const res = await fetch(`/api/cards/${card.token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'claim' }),
      });
      if (res.ok) {
        setStep('success');
      } else {
        setStep('view');
        setShowModal(false);
      }
    } catch {
      setStep('view');
      setShowModal(false);
    }
  }

  function handleCloseModal() {
    setShowModal(false);
    setStep('view');
  }

  function handleOpenMail() {
    setShowMail(true);
  }

  function handleCloseMail() {
    setShowMail(false);
  }

  const titleWords = card.title.split(' ');
  const line1 = titleWords.slice(0, Math.ceil(titleWords.length / 2)).join(' ');
  const line2 = titleWords.slice(Math.ceil(titleWords.length / 2)).join(' ');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;700&family=Poppins:wght@400;600;700&family=Nunito:wght@400;600;700;800&family=Fredoka:wght@400;500;600;700&display=swap');

        .boba-card {
          --card-accent: ${tpl.accentColor};
          --card-bg: #fdf6f0;
          --card-bg-warm: #fef9f4;
          --card-text: ${tpl.textColor};
          --card-white: #fff;
          --card-dark: #3d3229;
          --card-muted: #8b7e74;
          --card-heart: ${tpl.accentColor};
          --card-border: #e8ddd4;
          position: relative;
          width: 100%;
          background: linear-gradient(160deg, var(--card-bg) 0%, var(--card-bg-warm) 50%, #fef5ee 100%);
          overflow: hidden;
          font-family: 'Nunito', sans-serif;
        }

        ${staticView ? `
        .boba-card .boba-flags,
        .boba-card .boba-image-box,
        .boba-card .boba-hat,
        .boba-card .boba-date-pill,
        .boba-card .boba-name-pill,
        .boba-card .boba-claim-btn-wrapper,
        .boba-card .boba-rotating-circle-wrapper,
        .boba-card .boba-star,
        .boba-card .boba-flower,
        .boba-card .boba-smiley {
          animation: none !important;
          transform: none !important;
          opacity: 1 !important;
          visibility: visible !important;
          width: auto !important;
          height: auto !important;
          scale: 1 !important;
        }
        .boba-card .boba-flags {
          transform: translateY(-10px) !important;
        }
        .boba-card .boba-image-box {
          transform: translateY(0) !important;
        }
        .boba-card .boba-date-pill {
          width: 260px !important;
          height: 44px !important;
        }
        .boba-card .boba-name-pill {
          transform: scale(1) !important;
        }
        .boba-card .boba-claim-btn-wrapper {
          transform: scale(1) !important;
        }
        .boba-card .boba-rotating-circle-wrapper {
          transform: scale(1) !important;
        }
        .boba-card .boba-star {
          transform: scale(1) !important;
        }
        .boba-card .boba-flower {
          transform: scale(1) !important;
        }
        .boba-card .boba-smiley {
          transform: scale(1) !important;
        }
        ` : ''}

        .boba-card-inner {
          position: relative;
          width: 100%;
          background-image:
            radial-gradient(circle at 20% 30%, rgba(184, 92, 58, 0.04) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(184, 92, 58, 0.03) 0%, transparent 50%);
          overflow: hidden;
          z-index: 1;
        }

        /* ── Flags ── */
        .boba-flags {
          display: flex;
          justify-content: space-between;
          transform: translateY(-200px);
          animation: boba-flag-in 1.5s 2s forwards;
          pointer-events: none;
        }
        @keyframes boba-flag-in {
          to { transform: translateY(-10px); }
        }
        .boba-flag {
          width: 280px;
          object-fit: contain;
          opacity: 0.9;
        }
        .boba-flag-left { transform: rotate(-10deg) translate(-20px, 30px); }
        .boba-flag-right { transform: rotate(10deg) translate(20px, 30px) scaleX(-1); }

        /* ── Content layout ── */
        .boba-content {
          width: 100%;
          position: relative;
          display: flex;
          padding: 3rem 2rem 4rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        .boba-left, .boba-right {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .boba-left { width: 42%; }
        .boba-right { width: 58%; }

        /* ── Title ── */
        .boba-title {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
          font-family: 'Fredoka', sans-serif;
          font-size: 2.6rem;
          flex-direction: column;
          perspective: 1000px;
        }
        .boba-title-text {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
        }
        .boba-title-text span {
          display: inline-block;
          color: #ffffff;
          text-shadow: 3px 3px 0 var(--card-dark),
                       -2px 3px 0 var(--card-dark),
                       3px -2px 0 var(--card-dark),
                       -2px -2px 0 var(--card-dark);
          font-weight: 700;
        }
        .boba-letter-hidden {
          transform: translateY(50px);
          opacity: 0;
          visibility: hidden;
        }
        .boba-letter-visible {
          animation: boba-txt-up 0.5s forwards;
        }
        @keyframes boba-txt-up {
          100% { transform: translateY(0); opacity: 1; visibility: visible; }
        }
        .boba-title-line1 { color: #ffffff; }
        .boba-title-line2 { color: #ffffff; }

        /* ── Hat ── */
        .boba-hat {
          position: absolute;
          right: 40px;
          top: -320px;
          width: 110px;
          transform: rotate(-40deg);
          z-index: -1;
          animation: boba-top-hat 4s 7s forwards ease;
        }
        @keyframes boba-top-hat {
          20%, 30% { top: -20px; transform-origin: left; transform: rotate(-40deg); }
          35%, 100% { top: -20px; transform: rotate(0deg); }
        }

        /* ── Date pill ── */
        .boba-date-pill {
          display: flex;
          justify-content: space-around;
          align-items: center;
          background: var(--card-accent);
          border-radius: 50px;
          margin-top: 20px;
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          border: 3px solid var(--card-dark);
          position: relative;
          transform: translateY(-100px);
          z-index: -1;
          opacity: 0;
          visibility: hidden;
          width: 0;
          height: 0;
          animation: boba-date-expand 5s 9s forwards;
        }
        @keyframes boba-date-expand {
          20%, 40% { width: 0; height: 0; transform: translateY(0); opacity: 1; visibility: visible; }
          45% { transform: translateY(0); opacity: 1; visibility: visible; width: 260px; height: 0; }
          50%, 100% { transform: translateY(0); opacity: 1; visibility: visible; width: 260px; height: 44px; }
        }
        .boba-date-pill span {
          font-weight: 700;
          margin: 0 30px;
          font-size: 1rem;
          color: var(--card-white);
        }
        .boba-date-pill .boba-star-icon {
          color: var(--card-white);
          margin: 0 5px;
          font-size: 0.8rem;
        }

        /* ── Name pill ── */
        .boba-name-pill {
          display: flex;
          justify-content: space-around;
          align-items: center;
          background: var(--card-accent);
          border-radius: 50px;
          margin-top: 16px;
          font-family: 'Dancing Script', cursive;
          border: 3px solid var(--card-dark);
          padding: 0 18px;
          position: relative;
          animation: boba-pill-in 1s 10s forwards ease;
          opacity: 0;
          transform: scale(0);
        }
        @keyframes boba-pill-in {
          0% { opacity: 0; transform: scale(0); }
          60% { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        .boba-name-pill span {
          font-weight: 700;
          margin: 0 12px;
          font-size: 1.5rem;
          color: var(--card-white);
        }
        .boba-name-pill .boba-heart-icon {
          color: var(--card-white);
          filter: drop-shadow(0 0 4px var(--card-heart));
          animation: boba-scale-heart 1s infinite linear;
        }
        @keyframes boba-scale-heart {
          50% { transform: scale(1.2); }
        }

        /* ── Claim button ── */
        .boba-claim-btn-wrapper {
          transform: scale(0);
          animation: boba-scale-btn 2s 14s forwards ease-in-out;
        }
        @keyframes boba-scale-btn {
          0% { transform: scale(0); }
          10% { transform: scale(1.3); }
          20% { transform: scale(0.7); }
          30%, 100% { transform: scale(1); }
        }
        .boba-claim-btn {
          position: relative;
          margin-top: 24px;
          background: var(--card-accent);
          outline: none;
          padding: 8px 20px;
          font-size: 0.95rem;
          border-radius: 50px;
          border: 3px solid var(--card-dark);
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 2;
          color: var(--card-white);
          transition: all 0.3s ease;
        }
        .boba-claim-btn:active { transform: scale(0.9); }
        .boba-claim-btn i { margin-left: 5px; }
        .boba-claim-btn:hover {
          background: var(--card-dark);
          border-color: var(--card-dark);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* ── Right: Image circle ── */
        .boba-image-box {
          position: relative;
          transform: translateY(500px);
          animation: boba-img-up 8s 5s forwards ease-in;
        }
        @keyframes boba-img-up {
          to { transform: translateY(0); }
        }
        .boba-image-circle {
          position: relative;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 5px solid var(--card-dark);
          background: var(--card-bg);
          box-shadow: 0 8px 32px rgba(61, 50, 41, 0.12);
        }
        .boba-image-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* ── Balloons ── */
        .boba-balloon-1 {
          position: absolute;
          top: -60px;
          left: -50px;
          animation: boba-balloon1 2s infinite linear;
        }
        .boba-balloon-1 img { width: 80px; }
        @keyframes boba-balloon1 {
          0%, 50%, 100% { transform-origin: bottom right; transform: rotate(0deg); }
          25% { transform-origin: bottom right; transform: rotate(3deg); }
          75% { transform-origin: bottom right; transform: rotate(-3deg); }
        }
        .boba-balloon-2 {
          position: absolute;
          top: 140px;
          right: -50px;
          z-index: -1;
          transform: rotate(10deg);
          animation: boba-balloon2 2s infinite linear;
        }
        .boba-balloon-2 img { width: 80px; }
        @keyframes boba-balloon2 {
          0%, 50%, 100% { transform-origin: bottom left; transform: rotate(10deg); }
          25% { transform-origin: bottom left; transform: rotate(7deg); }
          75% { transform-origin: bottom left; transform: rotate(13deg); }
        }

        /* ── Rotating circle ── */
        .boba-rotating-circle-wrapper {
          position: absolute;
          top: 20px;
          right: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          transform: scale(0);
          animation: boba-scale-circle 3s 13s forwards ease-in-out;
        }
        @keyframes boba-scale-circle {
          0% { transform: scale(0); }
          10% { transform: scale(1.3); }
          20% { transform: scale(0.7); }
          30%, 100% { transform: scale(1); }
        }
        .boba-rotating-circle {
          width: 90px;
          height: 90px;
          background: var(--card-accent);
          border-radius: 50%;
          border: 4px solid var(--card-dark);
          display: flex;
          justify-content: center;
          align-items: center;
          animation: boba-rotate-circle 5s linear infinite;
          position: relative;
        }
        @keyframes boba-rotate-circle {
          to { transform: rotate(360deg); }
        }
        .boba-circle-char {
          position: absolute;
          top: 0;
          left: 50%;
          color: var(--card-white);
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.6rem;
          transform-origin: 0 40px;
        }
        .boba-circle-heart {
          position: absolute;
          color: var(--card-white);
          filter: drop-shadow(0 0 4px var(--card-heart));
          animation: boba-scale-heart 1s infinite linear;
          font-size: 16px;
          z-index: 2;
          transform: scale(0.85);
        }

        /* ── Name pill (in right section) ── */
        .boba-name-pill-right {
          position: absolute;
          padding: 0 18px;
          bottom: -16px;
          border: 3px solid var(--card-dark);
          font-family: 'Dancing Script', cursive;
          display: flex;
          justify-content: space-around;
          align-items: center;
          background: var(--card-accent);
          border-radius: 50px;
          box-shadow: 0 4px 12px rgba(61, 50, 41, 0.1);
        }
        .boba-name-pill-right span {
          font-weight: 700;
          margin: 0 12px;
          font-size: 1.4rem;
          color: var(--card-white);
        }
        .boba-name-pill-right .boba-heart-icon {
          color: var(--card-white);
          filter: drop-shadow(0 0 4px var(--card-heart));
          animation: boba-scale-heart 1s infinite linear;
        }

        /* ── Stars ── */
        .boba-star {
          position: absolute;
          background: var(--card-dark);
          opacity: 0.6;
          clip-path: polygon(0 50%, 35% 35%, 50% 0, 65% 35%, 100% 50%, 65% 65%, 50% 100%, 35% 65%);
          animation: boba-scale-btn 3s var(--t) forwards, boba-pulse-star 2s 14s infinite ease-in-out;
          transform: scale(0);
          pointer-events: none;
        }
        @keyframes boba-pulse-star {
          25% { transform: scale(0.8); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }
        .boba-star-1 { width: 16px; height: 16px; top: 80px; left: 15%; --t: 13s; }
        .boba-star-2 { width: 12px; height: 12px; top: 40px; right: 20%; --t: 13.2s; }
        .boba-star-3 { width: 10px; height: 10px; top: 50%; left: 40%; --t: 13.4s; }
        .boba-star-4 { width: 14px; height: 14px; bottom: 20%; left: 10%; --t: 13.6s; }
        .boba-star-5 { width: 12px; height: 12px; bottom: 30%; right: 15%; --t: 13.8s; }

        /* ── Flowers ── */
        .boba-flower {
          position: absolute;
          font-size: 16px;
          transform: scale(0);
          animation: boba-scale-btn 3s var(--t) forwards ease-in-out;
          pointer-events: none;
          opacity: 0.7;
        }
        .boba-flower-1 { top: 40%; left: 8%; --t: 13s; }
        .boba-flower-2 { top: 35%; right: 8%; --t: 13.3s; }
        .boba-flower-3 { top: 25%; right: 25%; --t: 13.6s; }

        /* ── Bottom decoration ── */
        .boba-bottom-deco {
          position: absolute;
          right: 0;
          bottom: 0;
          font-size: 50px;
          opacity: 0.25;
          pointer-events: none;
        }

        /* ── Smiley ── */
        .boba-smiley {
          position: absolute;
          bottom: 15%;
          left: 50%;
          font-size: 40px;
          transform: scale(0);
          animation: boba-scale-btn 3s 14s forwards ease-in-out;
          pointer-events: none;
          opacity: 0.6;
        }

        /* ── Mail Modal ── */
        .boba-mail-overlay {
          position: fixed;
          background: rgba(45, 50, 41, 0.85);
          width: 100%;
          height: 100%;
          opacity: 0;
          top: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          transform: scale(0.3);
          visibility: hidden;
          transition: all 0.5s;
          z-index: 10000;
          backdrop-filter: blur(4px);
        }
        .boba-mail-overlay.active {
          opacity: 1;
          visibility: visible;
          transform: scale(1);
        }
        .boba-mail-close {
          position: fixed;
          top: 12px;
          right: 12px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          color: white;
          z-index: 100000;
          background: rgba(255,255,255,0.15);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .boba-mail-close:hover { background: rgba(255,255,255,0.25); }
        .boba-mail-container {
          position: absolute;
          width: 680px;
          height: 450px;
          display: flex;
          margin: 0;
          transform: scale(0.9);
          perspective: 2000px;
          transition: all 0.5s;
        }
        .boba-mail-container:hover {
          transform: rotate(-5deg) scale(0.9);
          filter: drop-shadow(0 0 20px rgba(184, 92, 58, 0.3));
        }
        .boba-mail-card {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 16px;
          overflow: hidden;
        }
        .boba-mail-card1 {
          z-index: 1;
          width: 50%;
          background: linear-gradient(135deg, var(--card-accent), #e8756a);
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          transform-style: preserve-3d;
          transform-origin: left;
          transition: all 1s ease-in-out;
        }
        .boba-mail-container:hover .boba-mail-card1 {
          transform: translate(-170px, -220px) rotateY(-140deg);
        }
        .boba-mail-user-img {
          position: relative;
          width: 72px;
          height: 72px;
          background-color: white;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid white;
          cursor: pointer;
          margin-bottom: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .boba-mail-user-img img {
          position: absolute;
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
        .boba-mail-card1 h3 {
          font-family: 'Fredoka', sans-serif;
          font-size: 32px;
          text-transform: uppercase;
          width: 80%;
          text-align: center;
          line-height: 1.4;
          letter-spacing: 3px;
          transform: rotate(-5deg);
          text-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .boba-mail-card2 {
          position: relative;
          width: 50%;
          background: linear-gradient(to right, #f0ebe6, #ffffff 30%);
          transform-style: preserve-3d;
          transform-origin: left;
          transition: all 1s;
        }
        .boba-mail-card2-content {
          width: 100%;
          height: 100%;
          position: relative;
          background: linear-gradient(135deg, var(--card-accent), #e8756a);
          transition: all 1s;
          overflow: hidden;
          font-family: 'Dancing Script', cursive;
          color: #fff;
        }
        .boba-mail-container:hover .boba-mail-card2-content {
          transform: translate(16px, 16px);
          box-shadow: -2px -2px 8px rgba(0, 0, 0, 0.2);
        }
        .boba-mail-card2 h3 {
          font-family: 'Fredoka', sans-serif;
          padding: 20px 0px 10px 50px;
          opacity: 0;
          visibility: hidden;
          font-size: 22px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .boba-mail-container:hover .boba-mail-card2 h3 {
          animation: boba-mail-text-h3 3s forwards;
          animation-delay: 2s;
          transition: 1s;
        }
        @keyframes boba-mail-text-h3 {
          0% { opacity: 1; visibility: visible; padding: 20px 0px 10px 50px; }
          100% { opacity: 1; visibility: visible; padding: 20px 0px 10px 130px; }
        }
        .boba-mail-card2 h2 {
          font-family: 'Dancing Script', cursive;
          padding: 0px 18px;
          text-indent: 18px;
          font-size: 20px;
          opacity: 0;
          line-height: 1.5;
        }
        .boba-mail-container:hover .boba-mail-card2 h2 {
          animation: boba-mail-text-h2 2s forwards;
          animation-delay: 4s;
          transition: 1s;
        }
        @keyframes boba-mail-text-h2 {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .boba-mail-cute2 {
          position: absolute;
          top: 5px;
          left: 18px;
          opacity: 0;
          transition: 1s;
        }
        .boba-mail-container:hover .boba-mail-cute2 {
          animation: boba-mail-cute-wiggle 1s linear infinite, boba-mail-cute-move 3s 2s forwards;
          animation-delay: 2s;
          transition: 1s;
        }
        @keyframes boba-mail-cute-wiggle {
          0% { opacity: 1; transform: rotate(0deg); }
          25% { opacity: 1; transform: rotate(5deg); }
          50% { opacity: 1; transform: rotate(0deg); }
          75% { opacity: 1; transform: rotate(-5deg); }
          100% { opacity: 1; transform: rotate(0deg); }
        }
        @keyframes boba-mail-cute-move {
          0% { left: 18px; }
          100% { left: 90px; }
        }
        .boba-mail-cute2 img { width: 36px; }

        /* ── Status badge ── */
        .boba-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 50px;
          font-family: 'Nunito', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          border: 2px solid;
          margin-top: 14px;
        }

        /* ── Footer info ── */
        .boba-footer-info {
          position: relative;
          left: 0;
          right: 0;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(8px);
          border-top: 1px solid var(--card-border);
          padding: 10px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 100;
          font-family: 'Nunito', sans-serif;
        }
        .boba-footer-info span {
          font-size: 0.7rem;
          color: var(--card-muted);
        }

        /* ── Modal overlay ── */
        .boba-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(45, 50, 41, 0.75);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1001;
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s;
          backdrop-filter: blur(4px);
        }
        .boba-modal-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        .boba-modal-card {
          position: relative;
          width: 90vw;
          max-width: 520px;
          min-height: 380px;
          background: var(--card-white);
          border-radius: 20px;
          overflow: hidden;
          transform: scale(0.85) translateY(20px);
          transition: transform 0.4s ease;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        }
        .boba-modal-overlay.active .boba-modal-card {
          transform: scale(1) translateY(0);
        }
        .boba-modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--card-white);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          transition: transform 0.2s;
        }
        .boba-modal-close:hover { transform: scale(1.1); }
        .boba-modal-header {
          padding: 32px 24px 18px;
          text-align: center;
          color: var(--card-white);
        }
        .boba-modal-header h2 {
          font-family: 'Fredoka', sans-serif;
          font-size: 1.6rem;
          margin-bottom: 6px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .boba-modal-header p {
          font-family: 'Nunito', sans-serif;
          opacity: 0.9;
          font-size: 0.9rem;
        }
        .boba-modal-body {
          background: var(--card-white);
          margin: 0 10px 10px;
          border-radius: 14px;
          padding: 24px 20px;
          text-align: center;
        }
        .boba-modal-emoji {
          font-size: 52px;
          margin-bottom: 14px;
          animation: boba-emoji-float 2s ease-in-out infinite;
        }
        @keyframes boba-emoji-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .boba-modal-title {
          font-family: 'Fredoka', sans-serif;
          font-size: 1.2rem;
          color: var(--card-text);
          margin-bottom: 10px;
        }
        .boba-modal-message {
          font-family: 'Dancing Script', cursive;
          font-size: 1.05rem;
          color: var(--card-muted);
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .boba-modal-value {
          font-family: 'Fredoka', sans-serif;
          font-size: 1.4rem;
          color: var(--card-accent);
          margin-bottom: 16px;
        }
        .boba-modal-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 16px;
          text-align: left;
        }
        .boba-modal-info-item {
          background: var(--card-bg);
          border-radius: 10px;
          padding: 10px 12px;
        }
        .boba-modal-info-item label {
          font-family: 'Nunito', sans-serif;
          font-size: 0.65rem;
          text-transform: uppercase;
          color: var(--card-muted);
          display: block;
          margin-bottom: 2px;
          font-weight: 700;
        }
        .boba-modal-info-item span {
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--card-dark);
        }
        .boba-modal-actions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }
        .boba-modal-btn {
          flex: 1;
          padding: 10px;
          border-radius: 50px;
          border: 2px solid var(--card-dark);
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .boba-modal-btn-primary {
          background: var(--card-accent);
          color: var(--card-white);
          border-color: var(--card-accent);
        }
        .boba-modal-btn-primary:hover {
          background: var(--card-dark);
          border-color: var(--card-dark);
        }
        .boba-modal-btn-secondary {
          background: var(--card-white);
          color: var(--card-dark);
        }
        .boba-modal-btn-secondary:hover {
          background: var(--card-bg);
        }

        /* ── Loading ── */
        .boba-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 30px;
        }
        .boba-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid var(--card-border);
          border-top-color: var(--card-accent);
          border-radius: 50%;
          animation: boba-spin 0.8s linear infinite;
        }
        @keyframes boba-spin { to { transform: rotate(360deg); } }

        /* ── Success ── */
        .boba-success {
          text-align: center;
          padding: 20px;
        }
        .boba-success-icon {
          width: 56px;
          height: 56px;
          background: #dcfce7;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
          animation: boba-scale-btn 0.6s forwards;
        }
        .boba-success h3 {
          font-family: 'Fredoka', sans-serif;
          color: #16a34a;
          margin-bottom: 6px;
          font-size: 1.2rem;
        }
        .boba-success p {
          color: var(--card-muted);
          font-family: 'Nunito', sans-serif;
          font-size: 0.85rem;
          margin-bottom: 16px;
        }
        .boba-success-share {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .boba-success-share button {
          padding: 7px 14px;
          border-radius: 50px;
          border: 1px solid var(--card-border);
          background: white;
          font-family: 'Nunito', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
          color: var(--card-dark);
        }
        .boba-success-share button:hover {
          background: var(--card-bg);
          border-color: var(--card-dark);
        }

        /* ── Mobile responsive ── */
        @media (max-width: 658px) {
          .boba-content {
            flex-direction: column;
            padding: 2rem 1rem 3rem;
            gap: 25px;
          }
          .boba-left, .boba-right { width: 100%; }
          .boba-title { font-size: 1.4rem; letter-spacing: 6px; }
          .boba-image-circle { width: 200px; height: 200px; }
          .boba-hat { width: 70px; right: -80px; top: -40px !important; }
          .boba-flag { width: 160px; }
          .boba-flag-left { transform: rotate(-10deg) translate(-100px, 3px); }
          .boba-flag-right { transform: rotate(10deg) translate(-90px, 30px) scaleX(-1); }
          .boba-rotating-circle-wrapper { right: -40px; top: 10px; }
          .boba-rotating-circle { width: 65px; height: 65px; }
          .boba-circle-char { font-size: 0.45rem; transform-origin: 0 28px; }
          .boba-name-pill-right { padding: 0 10px; bottom: -6px; }
          .boba-name-pill-right span { font-size: 0.9rem; }
          .boba-balloon-1 { top: 5px; left: -60px; }
          .boba-balloon-1 img { width: 60px; }
          .boba-mail-container { width: 90vw; height: 300px; }
          .boba-mail-card1 h3 { font-size: 24px; }
          .boba-mail-card2 h3 { font-size: 1.2rem; }
          .boba-mail-card2 h2 { font-size: 0.75rem; padding: 0px 12px; }
        }
      `}</style>

      <div className="boba-card" ref={containerRef}>
        <div className="boba-card-inner">
          {/* Flags */}
          <div className="boba-flags">
            <img src="/aqsa/1.png" alt="" className="boba-flag boba-flag-left" />
            <img src="/aqsa/1.png" alt="" className="boba-flag boba-flag-right" />
          </div>

          {/* Content */}
          <div className="boba-content">
            {/* Left */}
            <div className="boba-left">
              <div className="boba-title">
                <AnimatedTitle text={line1} delay={3500} instant={staticView} />
                {line2 && <AnimatedTitle text={line2} delay={4500} instant={staticView} />}
                <div className="boba-hat">
                  <img src="/aqsa/hat.png" alt="" width="110" />
                </div>
              </div>

              <div className="boba-date-pill">
                <span className="boba-star-icon">&#9733;</span>
                <span>{dateText || '\u00A0'}</span>
                <span className="boba-star-icon">&#9733;</span>
              </div>

              <div className="boba-name-pill">
                <span className="boba-heart-icon">&#10084;</span>
                <span>Dear {card.recipientName}</span>
                <span className="boba-heart-icon">&#10084;</span>
              </div>

              {canClaim && (
                <div className="boba-claim-btn-wrapper">
                  <button className="boba-claim-btn" onClick={handleOpenMail}>
                    Buka Card
                    <span style={{ marginLeft: 5 }}>&#9993;</span>
                  </button>
                </div>
              )}

              {currentStatus === 'CLAIMED' && (
                <div className="boba-status-badge" style={{ color: statusInfo.color, borderColor: statusInfo.border, background: statusInfo.bg }}>
                  <StatusIcon size={12} />
                  Card sudah diklaim
                </div>
              )}
              {currentStatus === 'EXPIRED' && (
                <div className="boba-status-badge" style={{ color: statusInfo.color, borderColor: statusInfo.border, background: statusInfo.bg }}>
                  <Clock size={12} />
                  Card sudah kadaluarsa
                </div>
              )}
              {currentStatus === 'CANCELLED' && (
                <div className="boba-status-badge" style={{ color: '#dc2626', borderColor: '#dc2626', background: '#fee2e2' }}>
                  <Ban size={12} />
                  Card sudah dibatalkan
                </div>
              )}
            </div>

            {/* Right */}
            <div className="boba-right">
              <div className="boba-image-box">
                <div className="boba-image-circle">
                  <img src="/img/kitten.webp" alt={card.recipientName} />
                </div>
                <div className="boba-name-pill-right">
                  <span className="boba-heart-icon">&#10084;</span>
                  <span>Dear {card.recipientName}</span>
                  <span className="boba-heart-icon">&#10084;</span>
                </div>
                <div className="boba-balloon-1">
                  <img src="/aqsa/balloon1.png" alt="" />
                </div>
                <div className="boba-balloon-2">
                  <img src="/aqsa/balloon2.png" alt="" />
                </div>
                <RotatingCircle text="happy-birthday-" />
              </div>
            </div>
          </div>

          {/* Decorations */}
          <div className="boba-star boba-star-1" />
          <div className="boba-star boba-star-2" />
          <div className="boba-star boba-star-3" />
          <div className="boba-star boba-star-4" />
          <div className="boba-star boba-star-5" />

          <div className="boba-flower boba-flower-1">&#127800;</div>
          <div className="boba-flower boba-flower-2">&#127800;</div>
          <div className="boba-flower boba-flower-3">&#127800;</div>

          <div className="boba-bottom-deco">&#127873;</div>
          <div className="boba-smiley">&#128522;</div>
        </div>

        {/* Footer */}
        <div className="boba-footer-info">
          <span>Dari {card.creatorName} &middot; {createdDate}</span>
          <span>{card.currency}{card.value.toLocaleString('id-ID')}</span>
        </div>
      </div>

      {/* Mail Modal */}
      <div className={`boba-mail-overlay ${showMail ? 'active' : ''}`}>
        <button className="boba-mail-close" onClick={handleCloseMail}>
          <X size={22} />
        </button>
        <div className="boba-mail-container">
          <div className="boba-mail-card boba-mail-card1">
            <div className="boba-mail-user-img">
              <img src="/img/kitten.webp" alt="" />
            </div>
            <h4 style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.1rem', marginBottom: 8 }}>
              To: {card.recipientName} &#128150;
            </h4>
            <h3>{card.title}</h3>
          </div>
          <div className="boba-mail-card boba-mail-card2">
            <div className="boba-mail-card2-content">
              <h3>To You!</h3>
              <h2>{card.message || card.title}</h2>
              <div className="boba-mail-cute2">
                <img src="/aqsa/love.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      <div
        className={`boba-modal-overlay ${showModal ? 'active' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleCloseModal();
        }}
      >
        <div className="boba-modal-card" ref={cardRef}>
          <button className="boba-modal-close" onClick={handleCloseModal}>
            <X size={16} />
          </button>

          <div className="boba-modal-header" style={{ background: tpl.gradient }}>
            <h2>Dear {card.recipientName} &#10084;</h2>
            <p>Ada card spesial buat kamu</p>
          </div>

          <div className="boba-modal-body">
            {step === 'confirm' && (
              <>
                <div className="boba-modal-emoji">{tpl.emoji}</div>
                <div className="boba-modal-title">{card.title}</div>
                {card.message && (
                  <div className="boba-modal-message">{card.message}</div>
                )}
                {card.value > 0 && (
                  <div className="boba-modal-value">
                    {card.currency}{card.value.toLocaleString('id-ID')}
                  </div>
                )}
                <div className="boba-modal-info">
                  <div className="boba-modal-info-item">
                    <label>Dari</label>
                    <span>{card.creatorName}</span>
                  </div>
                  <div className="boba-modal-info-item">
                    <label>Berlaku Hingga</label>
                    <span>{expiry}</span>
                  </div>
                </div>
                <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.8rem', color: 'var(--card-muted)', marginBottom: 14 }}>
                  Yakin ingin mengklaim card ini?
                </p>
                <div className="boba-modal-actions">
                  <button className="boba-modal-btn boba-modal-btn-secondary" onClick={handleCloseModal}>
                    Batal
                  </button>
                  <button className="boba-modal-btn boba-modal-btn-primary" onClick={handleConfirmClaim}>
                    Ya, Klaim! &#10084;
                  </button>
                </div>
              </>
            )}

            {step === 'loading' && (
              <div className="boba-loading">
                <div className="boba-spinner" />
                <p style={{ fontFamily: "'Nunito', sans-serif", color: 'var(--card-muted)', fontSize: '0.85rem' }}>Memproses...</p>
              </div>
            )}

            {step === 'success' && (
              <div className="boba-success">
                <div className="boba-success-icon">
                  <CheckCircle2 size={28} color="#16a34a" />
                </div>
                <h3>Klaim Berhasil!</h3>
                <p>Card berhasil diklaim. Selamat menikmati!</p>

                <div
                  style={{
                    background: tpl.gradient,
                    borderRadius: 12,
                    padding: 18,
                    marginBottom: 16,
                    color: tpl.textColor,
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 6 }}>{tpl.emoji}</div>
                  <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '0.85rem' }}>{card.title}</div>
                  {card.value > 0 && (
                    <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.1rem', marginTop: 4, color: tpl.accentColor }}>
                      {card.currency}{card.value.toLocaleString('id-ID')}
                    </div>
                  )}
                </div>

                <div className="boba-success-share">
                  <button onClick={handleShareWhatsApp}>WhatsApp</button>
                  <button onClick={handleShareTelegram}>Telegram</button>
                  <button onClick={handleCopyLink}>Salin Link</button>
                  <button onClick={handleDownload} disabled={downloading}>
                    {downloading ? 'Download...' : 'Download PNG'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
