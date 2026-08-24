'use client';

import { use, useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  Gift,
  Calendar,
  CheckCircle2,
  Clock,
  Ban,
  AlertCircle,
  Download,
  Copy,
  ArrowLeft,
} from 'lucide-react';
import { getCardByToken, claimCard } from '@/lib/storage';
import { getTemplate } from '@/lib/templates';
import { DeveloperBadge } from '@/components/developer-badge';
import { toPng } from 'html-to-image';

type ClaimStep = 'view' | 'confirm' | 'loading' | 'success';

export default function CardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [mounted, setMounted] = useState(false);
  const [card, setCard] = useState<ReturnType<typeof getCardByToken> | null>(undefined as any);

  useEffect(() => {
    setCard(getCardByToken(token));
    setMounted(true);
  }, [token]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center bg-retro-cream">
        <div className="crt-overlay" />
        <div className="flex flex-col items-center gap-5 px-4 text-center">
          <div className="size-8 animate-spin rounded-full border-2 border-retro-dark border-t-transparent" />
          <p className="font-pixel text-xs sm:text-sm text-retro-dark/70">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center bg-retro-cream">
        <div className="crt-overlay" />
        <div className="flex flex-col items-center gap-5 px-4 text-center">
          <div className="pixel-border-dark flex size-16 items-center justify-center bg-retro-dark">
            <AlertCircle className="size-7 text-retro-cream" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h1 className="font-pixel text-lg sm:text-xl text-retro-dark">
              Card Tidak Ditemukan
            </h1>
            <p className="text-sm md:text-base text-retro-dark/70">
              Card dengan token ini tidak ada atau sudah tidak berlaku.
            </p>
          </div>
          <Link href="/">
            <button className="pixel-btn">
              <ArrowLeft className="size-4 mr-1.5 inline" />
              Kembali
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return <CardDetail card={card} />;
}

function CardDetail({
  card,
}: {
  card: NonNullable<ReturnType<typeof getCardByToken>>;
}) {
  const [step, setStep] = useState<ClaimStep>('view');
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const tpl = getTemplate(card.templateId);
  const isExpired = new Date(card.expiresAt) < new Date();
  const canClaim = card.status === 'ACTIVE' && !isExpired;

  const expiry = new Date(card.expiresAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const statusConfig: Record<string, { label: string; icon: typeof CheckCircle2; color: string; bg: string }> = {
    ACTIVE: { label: 'Aktif', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    CLAIMED: { label: 'Sudah Diklaim', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
  };

  if (isExpired) {
    statusConfig.EXPIRED = { label: 'Kadaluarsa', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' };
  }

  const currentStatus = isExpired
    ? 'EXPIRED'
    : card.status;
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
    setStep('confirm');
  }

  function handleConfirmClaim() {
    setStep('loading');
    setTimeout(() => {
      const success = claimCard(card.token);
      if (success) {
        setStep('success');
      } else {
        setStep('view');
      }
    }, 1500);
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
        <div className="mh-r" />
      </header>

      {/* Main */}
      <main className="flex flex-1 items-start justify-center px-4 py-8 sm:items-center sm:py-12 md:py-16">
        <div className="mx-auto w-full max-w-md">
          {/* Card */}
          <div ref={cardRef} className="pixel-border bg-white overflow-hidden">
            {/* Header */}
            <div
              className="relative overflow-hidden p-5 sm:p-6 md:p-8"
              style={{ background: tpl.gradient }}
            >
              <div className="absolute inset-0" style={{ background: tpl.pattern }} />
              <div className="relative flex flex-col items-center gap-3 text-center">
                <div className="animate-bounce-in text-4xl sm:text-5xl">{tpl.emoji}</div>
                <h1
                  className="animate-slide-up font-pixel text-lg sm:text-xl font-bold"
                  style={{ color: tpl.textColor }}
                >
                  {card.title}
                </h1>
                {card.message && (
                  <p
                    className="animate-slide-up-delay max-w-sm text-sm md:text-base leading-relaxed opacity-80"
                    style={{ color: tpl.textColor }}
                  >
                    {card.message}
                  </p>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-4 bg-white p-4 sm:p-5 md:p-6">
              {/* Status */}
              <div className="flex justify-center">
                <span
                  className={`pixel-border inline-flex items-center gap-1.5 px-3 py-1 text-xs sm:text-sm font-medium ${statusInfo.color} ${statusInfo.bg}`}
                >
                  <StatusIcon className="size-3.5" />
                  {statusInfo.label}
                </span>
              </div>

              {/* Recipient */}
              <div className="animate-slide-up-delay-2 pixel-border-dark flex flex-col items-center gap-1 bg-retro-dark p-3 sm:p-4">
                <span className="font-pixel text-xs uppercase tracking-wider text-retro-cream/60">
                  Dipersembahkan untuk
                </span>
                <span
                  className="font-pixel text-sm sm:text-base font-bold"
                  style={{ color: tpl.accentColor }}
                >
                  {card.recipientName}
                </span>
              </div>

              {/* Creator */}
              {card.creatorName && (
                <div className="flex justify-center">
                  <p className="font-pixel text-xs sm:text-sm text-retro-dark/60">
                    Dari {card.creatorName}
                  </p>
                </div>
              )}

              {/* Value */}
              {card.value > 0 && (
                <div className="flex justify-center">
                  <div className="pixel-border bg-retro-cream px-5 sm:px-6 py-3">
                    <span className="font-pixel text-xs text-retro-dark/60">Nilai Gift</span>
                    <p className="font-pixel text-base sm:text-lg text-retro-dark">
                      {card.currency}{card.value.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="pixel-border bg-retro-cream p-3">
                  <span className="font-pixel text-xs uppercase tracking-wider text-retro-dark/50">
                    Berlaku Hingga
                  </span>
                  <span className="flex items-center gap-1 text-sm sm:text-base text-retro-dark">
                    <Calendar className="size-3 text-retro-dark/50" />
                    {expiry}
                  </span>
                </div>
                <div className="pixel-border bg-retro-cream p-3">
                  <span className="font-pixel text-xs uppercase tracking-wider text-retro-dark/50">
                    Dibuat
                  </span>
                  <span className="flex items-center gap-1 text-sm sm:text-base text-retro-dark">
                    <Calendar className="size-3 text-retro-dark/50" />
                    {new Date(card.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                {canClaim && step === 'view' && (
                  <button onClick={handleClaim} className="pixel-btn w-full bg-retro-accent">
                    Klaim Card
                  </button>
                )}

                {step === 'confirm' && (
                  <div className="space-y-2">
                    <p className="text-center text-sm md:text-base text-retro-dark/70">
                      Yakin ingin mengklaim card ini?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setStep('view')}
                        className="pixel-border flex-1 bg-white px-4 py-2 font-pixel text-xs sm:text-sm text-retro-dark"
                      >
                        Batal
                      </button>
                      <button onClick={handleConfirmClaim} className="pixel-btn flex-1 bg-retro-dark">
                        Ya, Klaim
                      </button>
                    </div>
                  </div>
                )}

                {step === 'loading' && (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <div className="size-8 animate-spin rounded-full border-2 border-retro-dark border-t-transparent" />
                    <p className="font-pixel text-xs sm:text-sm text-retro-dark/70">Memproses...</p>
                  </div>
                )}

                {step === 'success' && (
                  <div className="space-y-4">
                    <div className="pixel-border-dark flex flex-col items-center gap-2 bg-emerald-100 p-4 text-center">
                      <CheckCircle2 className="size-8 text-emerald-600" />
                      <p className="font-pixel text-xs sm:text-sm text-emerald-700">Klaim Berhasil!</p>
                      <p className="text-sm md:text-base text-emerald-600">
                        Card berhasil diklaim. Selamat menikmati!
                      </p>
                    </div>

                    {/* Mini Card Preview */}
                    <div
                      className="pixel-border relative overflow-hidden p-4 text-center"
                      style={{ background: tpl.gradient, color: tpl.textColor }}
                    >
                      <div className="absolute inset-0" style={{ background: tpl.pattern }} />
                      <div className="relative flex flex-col items-center gap-2">
                        <span className="text-3xl">{tpl.emoji}</span>
                        <h3 className="font-pixel text-xs sm:text-sm font-bold">{card.title}</h3>
                        {card.message && (
                          <p className="max-w-xs text-xs sm:text-sm opacity-80 leading-relaxed line-clamp-3">
                            {card.message}
                          </p>
                        )}
                        {card.value > 0 && (
                          <p className="font-pixel text-base sm:text-lg font-bold" style={{ color: tpl.accentColor }}>
                            {card.currency}{card.value.toLocaleString('id-ID')}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Share Buttons */}
                    <div className="flex flex-col gap-2">
                      <p className="font-pixel text-xs text-center text-retro-dark/50">Bagikan ke teman kamu</p>
                      <div className="flex gap-2">
                        <button onClick={handleShareWhatsApp} className="pixel-btn flex-1 bg-[#25D366]">
                          Share WhatsApp
                        </button>
                        <button onClick={handleShareTelegram} className="pixel-btn flex-1 bg-[#0088cc]">
                          Share Telegram
                        </button>
                      </div>
                      <button onClick={handleCopyLink} className="pixel-border flex items-center justify-center gap-2 bg-white px-4 py-2.5 font-pixel text-xs sm:text-sm text-retro-dark">
                        <Copy className="size-4" />
                        Salin Link
                      </button>
                      <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="pixel-border flex items-center justify-center gap-2 bg-white px-4 py-2.5 font-pixel text-xs sm:text-sm text-retro-dark transition-all hover:bg-[var(--hover-bg-subtle)] disabled:opacity-50"
                      >
                        <Download className="size-4" />
                        {downloading ? 'Mendownload...' : 'Download Card (PNG)'}
                      </button>
                    </div>
                  </div>
                )}

                {currentStatus === 'CLAIMED' && (
                  <div className="space-y-3">
                    <div className="pixel-border flex items-center justify-center gap-2 bg-blue-100 p-3.5 text-sm md:text-base font-medium text-blue-600">
                      <CheckCircle2 className="size-4" />
                      Card sudah diklaim
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleShareWhatsApp} className="pixel-btn flex-1 bg-[#25D366]">
                        Share WhatsApp
                      </button>
                      <button onClick={handleShareTelegram} className="pixel-btn flex-1 bg-[#0088cc]">
                        Share Telegram
                      </button>
                    </div>
                    <button onClick={handleCopyLink} className="pixel-border flex items-center justify-center gap-2 bg-white px-4 py-2.5 font-pixel text-xs sm:text-sm text-retro-dark">
                      <Copy className="size-4" />
                      Salin Link
                    </button>
                    <button
                      onClick={handleDownload}
                      disabled={downloading}
                      className="pixel-border flex items-center justify-center gap-2 bg-white px-4 py-2.5 font-pixel text-xs sm:text-sm text-retro-dark transition-all hover:bg-[var(--hover-bg-subtle)] disabled:opacity-50"
                    >
                      <Download className="size-4" />
                      {downloading ? 'Mendownload...' : 'Download Card (PNG)'}
                    </button>
                  </div>
                )}

                {currentStatus === 'EXPIRED' && (
                  <div className="pixel-border flex items-center justify-center gap-2 bg-amber-100 p-3.5 text-sm md:text-base font-medium text-amber-600">
                    <Clock className="size-4" />
                    Card sudah kadaluarsa
                  </div>
                )}

                {currentStatus === 'CANCELLED' && (
                  <div className="pixel-border flex items-center justify-center gap-2 bg-red-100 p-3.5 text-sm md:text-base font-medium text-red-600">
                    <Ban className="size-4" />
                    Card sudah dibatalkan
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="craft-footer" style={{ height: 'auto', padding: '20px 0' }}>
        <div className="footer-inner">
          <div className="flex items-center gap-3">
            <div
              className="flex size-8 items-center justify-center"
              style={{
                background: 'var(--retro-accent)',
                clipPath: 'polygon(4px 0, calc(100% - 4px) 0, calc(100% - 4px) 2px, calc(100% - 2px) 2px, calc(100% - 2px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 2px) calc(100% - 4px), calc(100% - 2px) calc(100% - 2px), calc(100% - 4px) calc(100% - 2px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 2px), 2px calc(100% - 2px), 2px calc(100% - 4px), 0 calc(100% - 4px), 0 4px, 2px 4px, 2px 2px, 4px 2px, 4px 0)',
              }}
            >
              <Gift className="size-4" style={{ color: '#fff' }} />
            </div>
            <span className="font-pixel text-xs sm:text-sm" style={{ color: 'var(--paper)' }}>
              BOBA CARD
            </span>
          </div>
          <div className="flex items-center gap-4">
            <DeveloperBadge />
          </div>
        </div>
      </footer>
    </div>
  );
}
