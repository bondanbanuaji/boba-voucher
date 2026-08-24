'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, Share2, Copy, CheckCircle2, Clock, Ban, Gift } from 'lucide-react';
import AqsaCardView from '@/components/aqsa-card-view';
import { getTemplate } from '@/lib/templates';
import type { Card } from '@/types';

export default function CardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [mounted, setMounted] = useState(false);
  const [card, setCard] = useState<Card | null>(undefined as unknown as null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchCard() {
      try {
        const res = await fetch(`/api/cards/${token}`);
        if (res.ok) {
          const serverCard: Card = await res.json();
          setCard(serverCard);
        } else {
          setCard(null);
        }
      } catch {
        setCard(null);
      }
      setMounted(true);
    }
    fetchCard();
  }, [token]);

  function handleCopyShareLink() {
    const url = `${window.location.origin}/share/${token}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShareWhatsApp() {
    const url = `${window.location.origin}/share/${token}`;
    const text = `Hay! Ada card ucapan spesial nih buat kamu 🎁\n\nBuka link ini ya: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  function handleShareTelegram() {
    const url = `${window.location.origin}/share/${token}`;
    const text = `Hay! Ada card ucapan spesial nih buat kamu 🎁`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center" style={{ background: 'var(--paper)' }}>
        <div className="flex flex-col items-center gap-5 px-4 text-center">
          <div className="size-8 animate-spin rounded-full border-2 border-[var(--ink)] border-t-transparent" />
          <p className="font-pixel text-sm" style={{ color: 'var(--muted-craft)' }}>Memuat...</p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center" style={{ background: 'var(--paper)' }}>
        <div className="flex flex-col items-center gap-5 px-4 text-center">
          <div
            className="flex items-center justify-center"
            style={{
              width: 64,
              height: 64,
              background: 'var(--ink)',
              clipPath: 'polygon(6px 0, calc(100% - 6px) 0, calc(100% - 6px) 3px, calc(100% - 3px) 3px, calc(100% - 3px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 3px) calc(100% - 6px), calc(100% - 3px) calc(100% - 3px), calc(100% - 6px) calc(100% - 3px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 3px), 3px calc(100% - 3px), 3px calc(100% - 6px), 0 calc(100% - 6px), 0 6px, 3px 6px, 3px 3px, 6px 3px, 6px 0)',
            }}
          >
            <AlertCircle size={28} color="var(--paper)" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h1 className="font-pixel text-base" style={{ color: 'var(--ink)' }}>
              Card Tidak Ditemukan
            </h1>
            <p className="text-sm" style={{ color: 'var(--muted-craft)' }}>
              Card dengan token ini tidak ada atau sudah tidak berlaku.
            </p>
          </div>
          <Link href="/" className="pixel-btn flex items-center gap-2">
            <ArrowLeft size={16} />
            Kembali
          </Link>
        </div>
      </div>
    );
  }

  const tpl = getTemplate(card.templateId);
  const isExpired = new Date(card.expiresAt) < new Date();
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

  return (
    <div className="flex min-h-screen flex-1 flex-col" style={{ background: 'var(--paper)' }}>
      {/* Header */}
      <header className="masthead" style={{ background: 'var(--paper)', borderBottom: '1px solid var(--line)' }}>
        <div className="mh-l">
          <Link href="/" className="font-pixel text-xs sm:text-sm tracking-wider uppercase" style={{ color: 'var(--ink)' }}>
            ← Beranda
          </Link>
        </div>
        <Link href="/" className="mh-c">
          <div className="wlogo">
            <div
              className="flex size-[34px] items-center justify-center"
              style={{
                background: 'var(--ink)',
                clipPath: 'polygon(6px 0, calc(100% - 6px) 0, calc(100% - 6px) 3px, calc(100% - 3px) 3px, calc(100% - 3px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 3px) calc(100% - 6px), calc(100% - 3px) calc(100% - 3px), calc(100% - 6px) calc(100% - 3px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 3px), 3px calc(100% - 3px), 3px calc(100% - 6px), 0 calc(100% - 6px), 0 6px, 3px 6px, 3px 3px, 6px 3px, 6px 0)',
              }}
            >
              <Gift className="size-5" style={{ color: 'var(--paper)' }} />
            </div>
          </div>
        </Link>
        <div className="mh-r">
          <span className="font-pixel text-xs sm:text-sm tracking-wider uppercase" style={{ color: 'var(--muted-craft)' }}>
            Card Saya
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center px-4 py-6 sm:py-8">
        <div className="w-full max-w-4xl space-y-5">
          {/* Card Preview */}
          <AqsaCardView card={card} />

          {/* Card Info Panel */}
          <div className="pixel-border bg-white p-4 sm:p-5 space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between">
              <h2 className="font-pixel text-sm" style={{ color: 'var(--ink)' }}>Detail Card</h2>
              <div
                className="flex items-center gap-1.5 px-3 py-1 font-pixel text-xs"
                style={{ color: statusInfo.color, borderColor: statusInfo.border, background: statusInfo.bg, border: `2px solid ${statusInfo.border}` }}
              >
                <StatusIcon size={12} />
                {statusInfo.label}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="pixel-border bg-[var(--paper)] p-3">
                <p className="font-pixel text-xs" style={{ color: 'var(--muted-craft)' }}>Penerima</p>
                <p className="font-pixel text-sm mt-1" style={{ color: 'var(--ink)' }}>{card.recipientName}</p>
              </div>
              <div className="pixel-border bg-[var(--paper)] p-3">
                <p className="font-pixel text-xs" style={{ color: 'var(--muted-craft)' }}>Pembuat</p>
                <p className="font-pixel text-sm mt-1" style={{ color: 'var(--ink)' }}>{card.creatorName}</p>
              </div>
              <div className="pixel-border bg-[var(--paper)] p-3">
                <p className="font-pixel text-xs" style={{ color: 'var(--muted-craft)' }}>Nilai</p>
                <p className="font-pixel text-sm mt-1" style={{ color: 'var(--ink)' }}>
                  {card.currency}{card.value.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="pixel-border bg-[var(--paper)] p-3">
                <p className="font-pixel text-xs" style={{ color: 'var(--muted-craft)' }}>Berlaku Hingga</p>
                <p className="font-pixel text-sm mt-1" style={{ color: 'var(--ink)' }}>{expiry}</p>
              </div>
            </div>

            {/* Created Date */}
            <div className="text-center">
              <p className="text-xs" style={{ color: 'var(--muted-craft)' }}>
                Dibuat pada {createdDate}
              </p>
            </div>
          </div>

          {/* Share Section */}
          <div className="pixel-border bg-white p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Share2 size={16} style={{ color: 'var(--ink)' }} />
              <h3 className="font-pixel text-sm" style={{ color: 'var(--ink)' }}>Bagikan Card</h3>
            </div>
            <p className="text-xs" style={{ color: 'var(--muted-craft)' }}>
              Bagikan link ini ke penerima card. Mereka bisa melihat card tanpa harus login.
            </p>
            
            {/* Share Link Display */}
            <div className="pixel-border bg-[var(--paper)] p-3 flex items-center justify-between gap-2">
              <p className="truncate text-xs sm:text-sm font-pixel" style={{ color: 'var(--ink)' }}>
                {typeof window !== 'undefined'
                  ? `${window.location.origin}/share/${token}`
                  : `/share/${token}`}
              </p>
              <button
                onClick={handleCopyShareLink}
                className="shrink-0 flex items-center gap-1 px-3 py-1.5 font-pixel text-xs transition-all"
                style={{
                  background: copied ? '#16a34a' : 'var(--ink)',
                  color: 'var(--paper)',
                  clipPath: 'polygon(4px 0, calc(100% - 4px) 0, calc(100% - 4px) 2px, calc(100% - 2px) 2px, calc(100% - 2px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 2px) calc(100% - 4px), calc(100% - 2px) calc(100% - 2px), calc(100% - 4px) calc(100% - 2px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 2px), 2px calc(100% - 2px), 2px calc(100% - 4px), 0 calc(100% - 4px), 0 4px, 2px 4px, 2px 2px, 4px 2px, 4px 0)',
                }}
              >
                {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                {copied ? 'Tersalin!' : 'Salin'}
              </button>
            </div>

            {/* Share Buttons */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={handleShareWhatsApp}
                className="pixel-btn flex-1 flex items-center justify-center gap-2"
                style={{ background: '#25D366' }}
              >
                Share WhatsApp
              </button>
              <button
                onClick={handleShareTelegram}
                className="pixel-btn flex-1 flex items-center justify-center gap-2"
                style={{ background: '#0088cc' }}
              >
                Share Telegram
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
