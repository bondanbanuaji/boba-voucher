'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  CheckCircle2,
  Clock,
  Ban,
  Copy,
  Download,
  X,
} from 'lucide-react';
import { claimCard } from '@/lib/storage';
import { getTemplate } from '@/lib/templates';
import { toPng } from 'html-to-image';
import type { Card } from '@/types';

type ClaimStep = 'view' | 'confirm' | 'loading' | 'success';

function AnimatedTitle({ text, delay }: { text: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <h1 className="aqsa-title-text">
      {text.split('').map((char, i) => (
        <span
          key={i}
          style={{ animationDelay: `${delay + i * 0.08}s` }}
          className={visible ? 'aqsa-letter-visible' : 'aqsa-letter-hidden'}
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
    <div className="aqsa-rotating-circle-wrapper">
      <div className="aqsa-rotating-circle">
        {chars.map((char, i) => (
          <span
            key={i}
            className="aqsa-circle-char"
            style={{ transform: `rotate(${deg * (i + 1)}deg) translateY(-42px)` }}
          >
            {char}
          </span>
        ))}
      </div>
      <div className="aqsa-circle-heart">&#10084;</div>
    </div>
  );
}

export default function AqsaCardView({ card }: { card: Card }) {
  const [step, setStep] = useState<ClaimStep>('view');
  const [downloading, setDownloading] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
        pixelRatio: 2,
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

  function handleClaim() {
    setShowModal(true);
    setStep('confirm');
  }

  async function handleConfirmClaim() {
    setStep('loading');
    try {
      const res = await fetch(`/api/cards/${card.token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'claim' }),
      });
      if (res.ok) {
        claimCard(card.token);
        setStep('success');
      } else {
        setStep('view');
        setShowModal(false);
      }
    } catch {
      const success = claimCard(card.token);
      if (success) {
        setStep('success');
      } else {
        setStep('view');
        setShowModal(false);
      }
    }
  }

  function handleCloseModal() {
    setShowModal(false);
    setStep('view');
  }

  const titleWords = card.title.split(' ');
  const line1 = titleWords.slice(0, Math.ceil(titleWords.length / 2)).join(' ');
  const line2 = titleWords.slice(Math.ceil(titleWords.length / 2)).join(' ');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;700&family=Poppins:wght@400;600;700&family=Coiny&family=Titan+One&family=Nerko+One&family=Sriracha&display=swap');

        .aqsa-page {
          --aqsa-pink: ${tpl.accentColor};
          --aqsa-pink-light: ${tpl.gradient.includes('#fce4ec') ? '#feecea' : tpl.gradient.includes('#efebe9') ? '#efebe9' : tpl.gradient.includes('#fff8e1') ? '#fff8e1' : tpl.gradient.includes('#e8eaf6') ? '#e8eaf6' : '#fce4ec'};
          --aqsa-pink-text: ${tpl.textColor};
          --aqsa-white: #fff;
          --aqsa-black: #333;
          --aqsa-heart: ${tpl.accentColor};
          position: relative;
          min-height: 100vh;
          width: 100%;
          background: var(--aqsa-pink-light);
          overflow: hidden;
          font-family: 'Poppins', sans-serif;
        }

        .aqsa-wrapper {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background-image:
            linear-gradient(0deg, transparent 24%, rgba(255,255,255,1) 25%, rgba(255,255,255,1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,1) 75%, rgba(255,255,255,1) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(255,255,255,1) 25%, rgba(255,255,255,1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,1) 75%, rgba(255,255,255,1) 76%, transparent 77%, transparent);
          background-size: 80px 80px;
          z-index: 1;
        }

        /* ── Flags ── */
        .aqsa-flags {
          display: flex;
          justify-content: space-between;
          transform: translateY(-200px);
          animation: aqsa-flag-in 1.5s 2s forwards;
          pointer-events: none;
        }
        @keyframes aqsa-flag-in {
          to { transform: translateY(-10px); }
        }
        .aqsa-flag {
          font-size: 60px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
        .aqsa-flag-left { transform: rotate(-10deg) translate(-20px, 30px); }
        .aqsa-flag-right { transform: rotate(10deg) translate(20px, 30px) scaleX(-1); }

        /* ── Content layout ── */
        .aqsa-content {
          width: 100%;
          position: relative;
          display: flex;
          padding: 3rem 1rem 2rem;
          max-width: 1100px;
          margin: 0 auto;
        }
        .aqsa-left, .aqsa-right {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .aqsa-left { width: 45%; }
        .aqsa-right { width: 55%; }

        /* ── Title ── */
        .aqsa-title {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
          font-family: 'Titan One', sans-serif;
          font-size: 2.8rem;
          flex-direction: column;
          perspective: 1000px;
        }
        .aqsa-title-text {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
        }
        .aqsa-title-text span {
          display: inline-block;
          text-shadow: 3px 3px var(--aqsa-black),
                       -3px 3px var(--aqsa-black),
                       3px -3px var(--aqsa-black),
                       -3px -3px var(--aqsa-black),
                       3px 6px 0 var(--aqsa-black);
          font-weight: bold;
        }
        .aqsa-letter-hidden {
          transform: translateY(50px);
          opacity: 0;
          visibility: hidden;
        }
        .aqsa-letter-visible {
          animation: aqsa-txt-up 0.5s forwards;
        }
        @keyframes aqsa-txt-up {
          100% { transform: translateY(0); opacity: 1; visibility: visible; }
        }
        .aqsa-title-line1 { color: var(--aqsa-white); }
        .aqsa-title-line2 { color: var(--aqsa-pink); }

        /* ── Hat ── */
        .aqsa-hat {
          position: absolute;
          right: 40px;
          top: -80px;
          font-size: 70px;
          transform: rotate(-40deg);
          z-index: -1;
          animation: aqsa-top-hat 4s 7s forwards ease;
        }
        @keyframes aqsa-top-hat {
          20%, 30% { top: -10px; transform-origin: left; transform: rotate(-40deg); }
          35%, 100% { top: -10px; transform: rotate(0deg); }
        }

        /* ── Date pill ── */
        .aqsa-date-pill {
          display: flex;
          justify-content: space-around;
          align-items: center;
          background: var(--aqsa-pink);
          border-radius: 50px;
          margin-top: 20px;
          font-family: 'Sriracha', cursive;
          border: 3px solid var(--aqsa-black);
          position: relative;
          transform: translateY(-100px);
          z-index: -1;
          opacity: 0;
          visibility: hidden;
          width: 0;
          height: 0;
          animation: aqsa-date-expand 5s 9s forwards;
        }
        @keyframes aqsa-date-expand {
          20%, 40% { width: 0; height: 0; transform: translateY(0); opacity: 1; visibility: visible; }
          45% { transform: translateY(0); opacity: 1; visibility: visible; width: 280px; height: 0; }
          50%, 100% { transform: translateY(0); opacity: 1; visibility: visible; width: 280px; height: 48px; }
        }
        .aqsa-date-pill span {
          font-weight: bold;
          margin: 0 30px;
          font-size: 1.1rem;
          color: var(--aqsa-white);
        }

        /* ── Name pill ── */
        .aqsa-name-pill {
          display: flex;
          justify-content: space-around;
          align-items: center;
          background: var(--aqsa-pink);
          border-radius: 50px;
          margin-top: 20px;
          font-family: 'Dancing Script', cursive;
          border: 3px solid var(--aqsa-black);
          padding: 0 20px;
          position: relative;
          animation: aqsa-pill-in 1s 10s forwards ease;
          opacity: 0;
          transform: scale(0);
        }
        @keyframes aqsa-pill-in {
          0% { opacity: 0; transform: scale(0); }
          60% { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        .aqsa-name-pill span {
          font-weight: bold;
          margin: 0 15px;
          font-size: 1.5rem;
          color: var(--aqsa-white);
        }
        .aqsa-name-pill .aqsa-heart-icon {
          color: var(--aqsa-white);
          filter: drop-shadow(0 0 3px var(--aqsa-heart));
          animation: aqsa-scale-heart 1s infinite linear;
        }
        @keyframes aqsa-scale-heart {
          50% { transform: scale(1.2); }
        }

        /* ── Claim button ── */
        .aqsa-claim-btn-wrapper {
          transform: scale(0);
          animation: aqsa-scale-btn 2s 12s forwards ease-in-out;
        }
        @keyframes aqsa-scale-btn {
          0% { transform: scale(0); }
          10% { transform: scale(1.3); }
          20% { transform: scale(0.7); }
          30%, 100% { transform: scale(1); }
        }
        .aqsa-claim-btn {
          position: relative;
          margin-top: 30px;
          background: var(--aqsa-pink);
          outline: none;
          padding: 10px 28px;
          font-size: 1.1rem;
          border-radius: 50px;
          border: 3px solid var(--aqsa-black);
          font-family: 'Sriracha', cursive;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 2;
          color: var(--aqsa-white);
          transition: all 0.3s ease-in-out;
        }
        .aqsa-claim-btn:hover {
          background: var(--aqsa-black);
          color: var(--aqsa-white);
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        }
        .aqsa-claim-btn:active { transform: scale(0.9); }
        .aqsa-claim-btn i { margin-left: 5px; }

        /* ── Right: Image circle ── */
        .aqsa-image-box {
          position: relative;
          transform: translateY(700px);
          animation: aqsa-img-up 8s 5s forwards ease-in;
        }
        @keyframes aqsa-img-up {
          to { transform: translateY(0); }
        }
        .aqsa-image-circle {
          position: relative;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 6px solid var(--aqsa-black);
          background: var(--aqsa-pink-light);
        }
        .aqsa-image-emoji {
          font-size: 120px;
          line-height: 1;
          animation: aqsa-emoji-float 3s ease-in-out infinite;
        }
        @keyframes aqsa-emoji-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        /* ── Balloons ── */
        .aqsa-balloon-1 {
          position: absolute;
          top: -50px;
          left: -60px;
          font-size: 60px;
          animation: aqsa-balloon1 2s infinite linear;
        }
        @keyframes aqsa-balloon1 {
          0%, 50%, 100% { transform-origin: bottom right; transform: rotate(0deg); }
          25% { transform-origin: bottom right; transform: rotate(3deg); }
          75% { transform-origin: bottom right; transform: rotate(-3deg); }
        }
        .aqsa-balloon-2 {
          position: absolute;
          top: 120px;
          right: -50px;
          font-size: 55px;
          z-index: -1;
          transform: rotate(10deg);
          animation: aqsa-balloon2 2s infinite linear;
        }
        @keyframes aqsa-balloon2 {
          0%, 50%, 100% { transform-origin: bottom left; transform: rotate(10deg); }
          25% { transform-origin: bottom left; transform: rotate(7deg); }
          75% { transform-origin: bottom left; transform: rotate(13deg); }
        }

        /* ── Rotating circle ── */
        .aqsa-rotating-circle-wrapper {
          position: absolute;
          top: 20px;
          right: -30px;
          display: flex;
          justify-content: center;
          align-items: center;
          transform: scale(0);
          animation: aqsa-scale-circle 3s 11s forwards ease-in-out;
        }
        @keyframes aqsa-scale-circle {
          0% { transform: scale(0); }
          10% { transform: scale(1.3); }
          20% { transform: scale(0.7); }
          30%, 100% { transform: scale(1); }
        }
        .aqsa-rotating-circle {
          width: 90px;
          height: 90px;
          background: var(--aqsa-pink);
          border-radius: 50%;
          border: 4px solid var(--aqsa-black);
          display: flex;
          justify-content: center;
          align-items: center;
          animation: aqsa-rotate-circle 5s linear infinite;
          position: relative;
        }
        @keyframes aqsa-rotate-circle {
          to { transform: rotate(360deg); }
        }
        .aqsa-circle-char {
          position: absolute;
          top: 0;
          left: 50%;
          color: var(--aqsa-black);
          font-family: 'Sriracha', cursive;
          text-transform: uppercase;
          font-size: 0.6rem;
          transform-origin: 0 40px;
        }
        .aqsa-circle-heart {
          position: absolute;
          color: var(--aqsa-heart);
          filter: drop-shadow(0 0 3px var(--aqsa-heart));
          animation: aqsa-scale-heart 1s infinite linear;
          font-size: 16px;
          z-index: 2;
        }

        /* ── Stars ── */
        .aqsa-star {
          position: absolute;
          background: var(--aqsa-black);
          clip-path: polygon(0 50%, 35% 35%, 50% 0, 65% 35%, 100% 50%, 65% 65%, 50% 100%, 35% 65%);
          animation: aqsa-scale-btn 3s var(--t) forwards, aqsa-pulse-star 2s 14s infinite ease-in-out;
          transform: scale(0);
          pointer-events: none;
        }
        @keyframes aqsa-pulse-star {
          25% { transform: scale(0.8); }
          50% { transform: scale(1.1); }
        }
        .aqsa-star-1 { width: 18px; height: 18px; top: 80px; left: 15%; --t: 13s; }
        .aqsa-star-2 { width: 14px; height: 14px; top: 40px; right: 20%; --t: 13.2s; }
        .aqsa-star-3 { width: 12px; height: 12px; top: 50%; left: 40%; --t: 13.4s; }
        .aqsa-star-4 { width: 16px; height: 16px; bottom: 20%; left: 10%; --t: 13.6s; }
        .aqsa-star-5 { width: 14px; height: 14px; bottom: 30%; right: 15%; --t: 13.8s; }

        /* ── Flowers ── */
        .aqsa-flower {
          position: absolute;
          font-size: 18px;
          transform: scale(0);
          animation: aqsa-scale-btn 3s var(--t) forwards ease-in-out;
          pointer-events: none;
        }
        .aqsa-flower-1 { top: 40%; left: 8%; --t: 13s; }
        .aqsa-flower-2 { top: 35%; right: 8%; --t: 13.3s; }
        .aqsa-flower-3 { top: 25%; right: 25%; --t: 13.6s; }

        /* ── Bottom decoration ── */
        .aqsa-bottom-deco {
          position: absolute;
          right: 0;
          bottom: 0;
          font-size: 60px;
          opacity: 0.3;
          pointer-events: none;
        }

        /* ── Smiley ── */
        .aqsa-smiley {
          position: absolute;
          bottom: 15%;
          left: 50%;
          font-size: 50px;
          transform: scale(0);
          animation: aqsa-scale-btn 3s 14s forwards ease-in-out;
          pointer-events: none;
        }

        /* ── Modal overlay ── */
        .aqsa-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s;
        }
        .aqsa-modal-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        .aqsa-modal-card {
          position: relative;
          width: 90vw;
          max-width: 600px;
          min-height: 400px;
          background: var(--aqsa-pink);
          border-radius: 20px;
          overflow: hidden;
          transform: scale(0.8) translateY(30px);
          transition: transform 0.5s ease;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .aqsa-modal-overlay.active .aqsa-modal-card {
          transform: scale(1) translateY(0);
        }
        .aqsa-modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--aqsa-white);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transition: transform 0.2s;
        }
        .aqsa-modal-close:hover { transform: scale(1.1); }
        .aqsa-modal-header {
          padding: 40px 30px 20px;
          text-align: center;
          color: var(--aqsa-white);
        }
        .aqsa-modal-header h2 {
          font-family: 'Dancing Script', cursive;
          font-size: 2rem;
          margin-bottom: 8px;
          text-shadow: 0 0 10px rgba(255,255,255,0.5);
        }
        .aqsa-modal-header p {
          font-family: 'Poppins', sans-serif;
          opacity: 0.9;
          font-size: 0.95rem;
        }
        .aqsa-modal-body {
          background: var(--aqsa-white);
          margin: 0 12px 12px;
          border-radius: 14px;
          padding: 30px 24px;
          text-align: center;
        }
        .aqsa-modal-emoji {
          font-size: 60px;
          margin-bottom: 16px;
          animation: aqsa-emoji-float 2s ease-in-out infinite;
        }
        .aqsa-modal-title {
          font-family: 'Titan One', sans-serif;
          font-size: 1.3rem;
          color: var(--aqsa-pink-text);
          margin-bottom: 12px;
        }
        .aqsa-modal-message {
          font-family: 'Dancing Script', cursive;
          font-size: 1.1rem;
          color: #555;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .aqsa-modal-value {
          font-family: 'Titan One', sans-serif;
          font-size: 1.5rem;
          color: var(--aqsa-pink);
          margin-bottom: 20px;
        }
        .aqsa-modal-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 20px;
          text-align: left;
        }
        .aqsa-modal-info-item {
          background: var(--aqsa-pink-light);
          border-radius: 10px;
          padding: 10px 14px;
        }
        .aqsa-modal-info-item label {
          font-family: 'Poppins', sans-serif;
          font-size: 0.7rem;
          text-transform: uppercase;
          color: #999;
          display: block;
          margin-bottom: 2px;
        }
        .aqsa-modal-info-item span {
          font-family: 'Sriracha', cursive;
          font-size: 0.95rem;
          color: var(--aqsa-black);
        }
        .aqsa-modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        .aqsa-modal-btn {
          flex: 1;
          padding: 12px;
          border-radius: 50px;
          border: 3px solid var(--aqsa-black);
          font-family: 'Sriracha', cursive;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .aqsa-modal-btn-primary {
          background: var(--aqsa-pink);
          color: var(--aqsa-white);
        }
        .aqsa-modal-btn-primary:hover {
          background: var(--aqsa-black);
        }
        .aqsa-modal-btn-secondary {
          background: var(--aqsa-white);
          color: var(--aqsa-black);
        }
        .aqsa-modal-btn-secondary:hover {
          background: #f0f0f0;
        }

        /* ── Loading ── */
        .aqsa-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 30px;
        }
        .aqsa-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e0e0e0;
          border-top-color: var(--aqsa-pink);
          border-radius: 50%;
          animation: aqsa-spin 0.8s linear infinite;
        }
        @keyframes aqsa-spin { to { transform: rotate(360deg); } }

        /* ── Success ── */
        .aqsa-success {
          text-align: center;
          padding: 20px;
        }
        .aqsa-success-icon {
          width: 60px;
          height: 60px;
          background: #dcfce7;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          animation: aqsa-scale-btn 0.6s forwards;
        }
        .aqsa-success h3 {
          font-family: 'Titan One', sans-serif;
          color: #16a34a;
          margin-bottom: 6px;
        }
        .aqsa-success p {
          color: #666;
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem;
          margin-bottom: 20px;
        }
        .aqsa-success-share {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .aqsa-success-share button {
          padding: 8px 16px;
          border-radius: 50px;
          border: 2px solid #ddd;
          background: white;
          font-family: 'Poppins', sans-serif;
          font-size: 0.8rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
        }
        .aqsa-success-share button:hover {
          background: #f5f5f5;
        }

        /* ── Status badge ── */
        .aqsa-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          border-radius: 50px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          border: 2px solid;
          margin-top: 16px;
        }

        /* ── Footer info ── */
        .aqsa-footer-info {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(0,0,0,0.1);
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 100;
          font-family: 'Poppins', sans-serif;
        }
        .aqsa-footer-info span {
          font-size: 0.75rem;
          color: #888;
        }

        /* ── Mobile responsive ── */
        @media (max-width: 768px) {
          .aqsa-content {
            flex-direction: column;
            padding: 2rem 1rem;
            gap: 30px;
          }
          .aqsa-left, .aqsa-right {
            width: 100%;
          }
          .aqsa-title {
            font-size: 1.6rem;
            letter-spacing: 4px;
          }
          .aqsa-image-circle {
            width: 180px;
            height: 180px;
          }
          .aqsa-image-emoji {
            font-size: 80px;
          }
          .aqsa-balloon-1 {
            top: -30px;
            left: -40px;
            font-size: 40px;
          }
          .aqsa-balloon-2 {
            top: 80px;
            right: -30px;
            font-size: 35px;
          }
          .aqsa-rotating-circle-wrapper {
            right: -10px;
            top: 10px;
          }
          .aqsa-rotating-circle {
            width: 70px;
            height: 70px;
          }
          .aqsa-circle-char {
            font-size: 0.5rem;
            transform-origin: 0 30px;
          }
          .aqsa-hat {
            font-size: 45px;
            right: 10px;
          }
          .aqsa-flag {
            font-size: 40px;
          }
          .aqsa-modal-card {
            min-height: auto;
          }
          .aqsa-modal-header h2 {
            font-size: 1.5rem;
          }
          .aqsa-modal-info {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .aqsa-title {
            font-size: 1.3rem;
          }
          .aqsa-image-circle {
            width: 150px;
            height: 150px;
          }
          .aqsa-image-emoji {
            font-size: 65px;
          }
        }
      `}</style>

      <div className="aqsa-page" ref={containerRef}>
        <div className="aqsa-wrapper">
          {/* Flags */}
          <div className="aqsa-flags">
            <span className="aqsa-flag aqsa-flag-left">{tpl.emoji}</span>
            <span className="aqsa-flag aqsa-flag-right">{tpl.emoji}</span>
          </div>

          {/* Content */}
          <div className="aqsa-content">
            {/* Left */}
            <div className="aqsa-left">
              <div className="aqsa-title">
                <AnimatedTitle text={line1} delay={3500} />
                {line2 && <AnimatedTitle text={line2} delay={4500} />}
                <div className="aqsa-hat">🎉</div>
              </div>

              <div className="aqsa-date-pill">
                <span>{expiry}</span>
              </div>

              <div className="aqsa-name-pill">
                <span className="aqsa-heart-icon">&#10084;</span>
                <span>Dear {card.recipientName}</span>
                <span className="aqsa-heart-icon">&#10084;</span>
              </div>

              {canClaim && (
                <div className="aqsa-claim-btn-wrapper">
                  <button className="aqsa-claim-btn" onClick={handleClaim}>
                    Buka Card
                    <span style={{ marginLeft: 6 }}>&#9993;</span>
                  </button>
                </div>
              )}

              {currentStatus === 'CLAIMED' && (
                <div className="aqsa-status-badge" style={{ color: statusInfo.color, borderColor: statusInfo.border, background: statusInfo.bg }}>
                  <StatusIcon size={14} />
                  Card sudah diklaim
                </div>
              )}
              {currentStatus === 'EXPIRED' && (
                <div className="aqsa-status-badge" style={{ color: statusInfo.color, borderColor: statusInfo.border, background: statusInfo.bg }}>
                  <Clock size={14} />
                  Card sudah kadaluarsa
                </div>
              )}
              {currentStatus === 'CANCELLED' && (
                <div className="aqsa-status-badge" style={{ color: '#dc2626', borderColor: '#dc2626', background: '#fee2e2' }}>
                  <Ban size={14} />
                  Card sudah dibatalkan
                </div>
              )}
            </div>

            {/* Right */}
            <div className="aqsa-right">
              <div className="aqsa-image-box">
                <div className="aqsa-image-circle">
                  <span className="aqsa-image-emoji">{tpl.emoji}</span>
                </div>
                <div className="aqsa-balloon-1">🎈</div>
                <div className="aqsa-balloon-2">🎈</div>
                <RotatingCircle text="happy-voucher-day-" />
              </div>
            </div>
          </div>

          {/* Decorations */}
          <div className="aqsa-star aqsa-star-1" />
          <div className="aqsa-star aqsa-star-2" />
          <div className="aqsa-star aqsa-star-3" />
          <div className="aqsa-star aqsa-star-4" />
          <div className="aqsa-star aqsa-star-5" />

          <div className="aqsa-flower aqsa-flower-1">🌸</div>
          <div className="aqsa-flower aqsa-flower-2">🌸</div>
          <div className="aqsa-flower aqsa-flower-3">🌸</div>

          <div className="aqsa-bottom-deco">🎁</div>
          <div className="aqsa-smiley">😊</div>
        </div>

        {/* Footer */}
        <div className="aqsa-footer-info">
          <span>Dari {card.creatorName} &middot; {createdDate}</span>
          <span>{card.currency}{card.value.toLocaleString('id-ID')}</span>
        </div>
      </div>

      {/* Modal */}
      <div
        className={`aqsa-modal-overlay ${showModal ? 'active' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleCloseModal();
        }}
      >
        <div className="aqsa-modal-card" ref={cardRef}>
          <button className="aqsa-modal-close" onClick={handleCloseModal}>
            <X size={16} />
          </button>

          <div className="aqsa-modal-header" style={{ background: tpl.gradient }}>
            <h2>Dear {card.recipientName} &#10084;</h2>
            <p>Ada card spesial buat kamu</p>
          </div>

          <div className="aqsa-modal-body">
            {step === 'confirm' && (
              <>
                <div className="aqsa-modal-emoji">{tpl.emoji}</div>
                <div className="aqsa-modal-title">{card.title}</div>
                {card.message && (
                  <div className="aqsa-modal-message">{card.message}</div>
                )}
                {card.value > 0 && (
                  <div className="aqsa-modal-value">
                    {card.currency}{card.value.toLocaleString('id-ID')}
                  </div>
                )}
                <div className="aqsa-modal-info">
                  <div className="aqsa-modal-info-item">
                    <label>Dari</label>
                    <span>{card.creatorName}</span>
                  </div>
                  <div className="aqsa-modal-info-item">
                    <label>Berlaku Hingga</label>
                    <span>{expiry}</span>
                  </div>
                </div>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.85rem', color: '#888', marginBottom: 16 }}>
                  Yakin ingin mengklaim card ini?
                </p>
                <div className="aqsa-modal-actions">
                  <button className="aqsa-modal-btn aqsa-modal-btn-secondary" onClick={handleCloseModal}>
                    Batal
                  </button>
                  <button className="aqsa-modal-btn aqsa-modal-btn-primary" onClick={handleConfirmClaim}>
                    Ya, Klaim! &#10084;
                  </button>
                </div>
              </>
            )}

            {step === 'loading' && (
              <div className="aqsa-loading">
                <div className="aqsa-spinner" />
                <p style={{ fontFamily: "'Sriracha', cursive", color: '#888' }}>Memproses...</p>
              </div>
            )}

            {step === 'success' && (
              <div className="aqsa-success">
                <div className="aqsa-success-icon">
                  <CheckCircle2 size={30} color="#16a34a" />
                </div>
                <h3>Klaim Berhasil!</h3>
                <p>Card berhasil diklaim. Selamat menikmati!</p>

                <div
                  style={{
                    background: tpl.gradient,
                    borderRadius: 12,
                    padding: 20,
                    marginBottom: 20,
                    color: tpl.textColor,
                  }}
                >
                  <div style={{ fontSize: 40, marginBottom: 8 }}>{tpl.emoji}</div>
                  <div style={{ fontFamily: "'Titan One', sans-serif", fontSize: '0.9rem' }}>{card.title}</div>
                  {card.value > 0 && (
                    <div style={{ fontFamily: "'Titan One', sans-serif", fontSize: '1.2rem', marginTop: 6, color: tpl.accentColor }}>
                      {card.currency}{card.value.toLocaleString('id-ID')}
                    </div>
                  )}
                </div>

                <div className="aqsa-success-share">
                  <button onClick={handleShareWhatsApp}>📱 WhatsApp</button>
                  <button onClick={handleShareTelegram}>✈ Telegram</button>
                  <button onClick={handleCopyLink}>🔗 Salin Link</button>
                  <button onClick={handleDownload} disabled={downloading}>
                    📥 {downloading ? 'Download...' : 'Download PNG'}
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
