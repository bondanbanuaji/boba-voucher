'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Gift,
  Download,
  FileImage,
  Trash2,
  ExternalLink,
  Clock,
  CheckCircle2,
  X,
} from 'lucide-react';
import { getTemplate } from '@/lib/templates';
import { getCardsFromHistory, deleteCardFromHistory } from '@/lib/storage';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import AqsaCardView from '@/components/aqsa-card-view';
import type { Card } from '@/types';

export default function HistoryPage() {
  const [cards, setCards] = useState<Card[]>(() => {
    if (typeof window === 'undefined') return [];
    return getCardsFromHistory();
  });
  const [mounted, setMounted] = useState(false);
  const [showPreview, setShowPreview] = useState<Card | null>(null);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleDelete(token: string) {
    deleteCardFromHistory(token);
    setCards((prev) => prev.filter((c) => c.token !== token));
  }

  const handleDownloadPng = useCallback(async (card: Card) => {
    if (!previewRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: undefined,
      });
      const link = document.createElement('a');
      link.download = `card-${card.title.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download PNG failed:', err);
    } finally {
      setDownloading(false);
    }
  }, [downloading]);

  const handleDownloadPdf = useCallback(async (card: Card) => {
    if (!previewRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: '#ffffff',
      });
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });
      const pdf = new jsPDF({
        orientation: img.width > img.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [img.width / 3, img.height / 3],
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, img.width / 3, img.height / 3);
      pdf.save(`card-${card.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } catch (err) {
      console.error('Download PDF failed:', err);
    } finally {
      setDownloading(false);
    }
  }, [downloading]);

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

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-retro-cream">
      <div className="crt-overlay" />

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
            History
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-start justify-center px-4 py-8 sm:items-center sm:py-12 md:py-16">
        <div className="mx-auto w-full max-w-2xl space-y-5 sm:space-y-6">
          <div>
            <h1 className="font-pixel text-lg sm:text-xl md:text-2xl text-retro-dark">History Card</h1>
            <p className="text-sm md:text-base text-retro-dark/70">
              Card ucapan yang sudah kamu buat. Bisa di-download ulang atau dikirim lagi.
            </p>
          </div>

          {cards.length === 0 ? (
            <div className="pixel-border bg-white p-8 text-center">
              <p className="font-pixel text-sm text-retro-dark/50">Belum ada card yang dibuat.</p>
              <Link href="/create">
                <button className="pixel-btn mt-4">Buat Card Sekarang</button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {cards.map((card) => (
                <CardHistoryItem
                  key={card.id}
                  card={card}
                  onDelete={handleDelete}
                  onPreview={setShowPreview}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPreview(null);
          }}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white pixel-border">
            <button
              onClick={() => setShowPreview(null)}
              className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center bg-white pixel-border text-retro-dark hover:bg-retro-cream"
            >
              <X className="size-4" />
            </button>
            <div ref={previewRef}>
              <AqsaCardView card={showPreview} staticView={true} />
            </div>
            <div className="flex flex-col gap-2 p-4 sm:flex-row sm:justify-center">
              <button
                onClick={() => handleDownloadPng(showPreview)}
                disabled={downloading}
                className="pixel-border flex items-center justify-center gap-2 bg-white px-4 py-2.5 font-pixel text-xs sm:text-sm text-retro-dark disabled:opacity-50"
              >
                <FileImage className="size-4" />
                {downloading ? 'Downloading...' : 'Download PNG'}
              </button>
              <button
                onClick={() => handleDownloadPdf(showPreview)}
                disabled={downloading}
                className="pixel-border flex items-center justify-center gap-2 bg-white px-4 py-2.5 font-pixel text-xs sm:text-sm text-retro-dark disabled:opacity-50"
              >
                <Download className="size-4" />
                {downloading ? 'Downloading...' : 'Export PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CardHistoryItem({
  card,
  onDelete,
  onPreview,
}: {
  card: Card;
  onDelete: (token: string) => void;
  onPreview: (card: Card) => void;
}) {
  const tpl = getTemplate(card.templateId);
  const isExpired = new Date(card.expiresAt) < new Date();
  const status = isExpired ? 'EXPIRED' : card.status;
  const expiry = new Date(card.expiresAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const created = new Date(card.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="pixel-border bg-white p-4">
      <div className="flex items-start gap-3">
        <div
          className="flex size-12 shrink-0 items-center justify-center pixel-render sm:size-14"
          style={{ background: tpl.gradient }}
        >
          <span className="text-2xl">{tpl.emoji}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-pixel text-xs sm:text-sm text-retro-dark">{card.title}</h3>
            {status === 'ACTIVE' && (
              <span className="flex shrink-0 items-center gap-1 px-2 py-0.5 font-pixel text-[10px] text-green-700 bg-green-100 border border-green-300">
                <CheckCircle2 size={10} />
                Aktif
              </span>
            )}
            {status === 'CLAIMED' && (
              <span className="flex shrink-0 items-center gap-1 px-2 py-0.5 font-pixel text-[10px] text-blue-700 bg-blue-100 border border-blue-300">
                <CheckCircle2 size={10} />
                Diklaim
              </span>
            )}
            {isExpired && (
              <span className="flex shrink-0 items-center gap-1 px-2 py-0.5 font-pixel text-[10px] text-amber-700 bg-amber-100 border border-amber-300">
                <Clock size={10} />
                Kadaluarsa
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-retro-dark/50">
            Untuk {card.recipientName} · Dari {card.creatorName}
          </p>
          <p className="mt-0.5 text-xs text-retro-dark/50">
            {card.currency}{card.value.toLocaleString('id-ID')} · Berlaku hingga {expiry}
          </p>
          <p className="mt-0.5 text-[10px] text-retro-dark/40">
            Dibuat {created}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 border-t border-retro-dark/10 pt-3">
        <button
          onClick={() => onPreview(card)}
          className="pixel-border flex items-center gap-1 bg-white px-3 py-1.5 font-pixel text-[10px] sm:text-xs text-retro-dark hover:bg-retro-cream"
        >
          <ExternalLink className="size-3" />
          Lihat & Download
        </button>
        <Link href={`/v/${card.token}`}>
          <button className="pixel-border flex items-center gap-1 bg-white px-3 py-1.5 font-pixel text-[10px] sm:text-xs text-retro-dark hover:bg-retro-cream">
            <ExternalLink className="size-3" />
            Buka Card
          </button>
        </Link>
        <button
          onClick={() => {
            if (confirm('Yakin hapus card ini dari history?')) {
              onDelete(card.token);
            }
          }}
          className="pixel-border flex items-center gap-1 bg-white px-3 py-1.5 font-pixel text-[10px] sm:text-xs text-red-500 hover:bg-red-50"
        >
          <Trash2 className="size-3" />
          Hapus
        </button>
      </div>
    </div>
  );
}
