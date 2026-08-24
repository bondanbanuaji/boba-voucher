'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Gift,
  Copy,
  ExternalLink,
  Heart,
  AlertCircle,
} from 'lucide-react';
import { templates, getTemplate } from '@/lib/templates';
import { saveCard, generateToken, generateId } from '@/lib/storage';
import type { Card, CardStatus } from '@/types';

async function saveCardToServer(card: Card): Promise<boolean> {
  try {
    const res = await fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const steps = ['Ucapan', 'Penerima', 'Template', 'Nilai', 'Preview', 'Selesai'];

interface FormData {
  title: string;
  message: string;
  recipientName: string;
  creatorName: string;
  templateId: string;
  value: string;
  currency: string;
  giftEmoji: string;
  startsAt: string;
  expiresAt: string;
}

const currencyOptions = ['🪙', '💰', '💵', '⭐', '🌟', '🧧', '🤑', '🎁'];

const initialData: FormData = {
  title: '',
  message: '',
  recipientName: '',
  creatorName: '',
  templateId: 'birthday',
  value: '',
  currency: '🪙',
  giftEmoji: '🎁',
  startsAt: '',
  expiresAt: '',
};

interface FormErrors {
  title?: string;
  message?: string;
  recipientName?: string;
  creatorName?: string;
  value?: string;
  startsAt?: string;
  expiresAt?: string;
}

function validateStep(step: number, form: FormData): FormErrors {
  const errors: FormErrors = {};
  const tpl = getTemplate(form.templateId);

  if (step === 0) {
    if (!form.title.trim()) errors.title = 'Judul card wajib diisi';
    if (!form.message.trim()) errors.message = 'Pesan ucapan wajib diisi';
  }

  if (step === 1) {
    if (!form.recipientName.trim()) errors.recipientName = 'Nama penerima wajib diisi';
    if (!form.creatorName.trim()) errors.creatorName = 'Nama pembuat wajib diisi';
  }

  if (step === 3) {
    if (!form.value || Number(form.value) <= 0) errors.value = `${tpl.suggestedGiftLabel} wajib diisi`;
    if (!form.startsAt) errors.startsAt = 'Tanggal mulai wajib diisi';
    if (!form.expiresAt) errors.expiresAt = 'Tanggal berakhir wajib diisi';
    if (form.startsAt && form.expiresAt && new Date(form.expiresAt) <= new Date(form.startsAt)) {
      errors.expiresAt = 'Tanggal berakhir harus setelah tanggal mulai';
    }
  }

  return errors;
}

export default function CreateCardPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialData);
  const [createdToken, setCreatedToken] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  function updateForm(patch: Partial<FormData>) {
    setForm((prev) => ({ ...prev, ...patch }));
    const key = Object.keys(patch)[0] as keyof FormErrors;
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function handleNext() {
    const stepErrors = validateStep(step, form);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    if (step < steps.length - 1) setStep((s) => s + 1);
  }

  function handleBack() {
    setErrors({});
    if (step > 0) setStep((s) => s - 1);
  }

  async function handleCreate() {
    const stepErrors = validateStep(step, form);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    const token = generateToken();
    const now = new Date().toISOString();

    const card: Card = {
      id: generateId(),
      token,
      title: form.title.trim(),
      message: form.message.trim(),
      recipientName: form.recipientName.trim(),
      creatorName: form.creatorName.trim(),
      value: Number(form.value),
      currency: form.currency,
      giftEmoji: form.giftEmoji,
      templateId: form.templateId,
      status: 'ACTIVE' as CardStatus,
      startsAt: form.startsAt,
      expiresAt: form.expiresAt,
      createdAt: now,
    };

    saveCard(card);
    await saveCardToServer(card);
    setCreatedToken(token);
    setStep(5);
  }

  const previewCard: Card = useMemo(() => {
    const now = new Date().toISOString();
    const tpl = getTemplate(form.templateId);
    return {
      id: 'preview',
      token: createdToken || 'preview',
      title: form.title || tpl.suggestedTitle,
      message: form.message || tpl.suggestedMessage,
      recipientName: form.recipientName || 'Teman',
      creatorName: form.creatorName || 'Teman',
      value: Number(form.value) || 0,
      currency: form.currency,
      giftEmoji: form.giftEmoji,
      templateId: form.templateId,
      status: 'ACTIVE' as CardStatus,
      startsAt: form.startsAt || now,
      expiresAt: form.expiresAt || now,
      createdAt: now,
    };
  }, [form, createdToken]);

  function handleCopyLink() {
    const url = `${window.location.origin}/v/${createdToken}`;
    navigator.clipboard.writeText(url);
  }

  function handleShareWhatsApp() {
    const url = `${window.location.origin}/v/${createdToken}`;
    const text = `Hay! Ada card ucapan spesial nih buat kamu 🎁\n\nBuka link ini ya: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  function handleShareTelegram() {
    const url = `${window.location.origin}/v/${createdToken}`;
    const text = `Hay! Ada card ucapan spesial nih buat kamu 🎁`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
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
            Buat Card
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-start justify-center px-4 py-8 sm:items-center sm:py-12 md:py-16">
        <div className="mx-auto w-full max-w-2xl space-y-5 sm:space-y-6">
          <div>
            <h1 className="font-pixel text-lg sm:text-xl md:text-2xl text-retro-dark">Buat Card Ucapan</h1>
            <p className="text-sm md:text-base text-retro-dark/70">
              Buat card ucapan personal untuk orang spesial
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div
                  className={`pixel-border-dark flex size-7 sm:size-8 shrink-0 items-center justify-center text-xs sm:text-sm font-medium ${
                    i <= step
                      ? 'bg-retro-dark text-retro-cream'
                      : 'bg-retro-cream text-retro-dark/50'
                  }`}
                >
                  {i < step ? <Check className="size-3.5" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-1 w-6 sm:w-8 ${
                      i < step ? 'bg-retro-dark' : 'bg-retro-dark/20'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="pixel-border bg-white p-4 sm:p-5 md:p-6">
            <h2 className="mb-4 font-pixel text-xs sm:text-sm text-retro-dark">
              {steps[step]}
            </h2>

            {/* Step 0: Ucapan */}
            {step === 0 && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-pixel text-xs sm:text-sm text-retro-dark">
                    Judul Card *
                  </label>
                  <input
                    required
                    placeholder="Contoh: Card Ucapan Spesial"
                    value={form.title}
                    onChange={(e) => updateForm({ title: e.target.value })}
                    className={`pixel-border w-full bg-retro-cream px-3 py-2.5 sm:py-3 text-sm sm:text-base text-retro-dark outline-none placeholder:text-retro-dark/40 ${errors.title ? 'border-2 border-red-500' : ''}`}
                  />
                  {errors.title && (
                    <p className="flex items-center gap-1 font-pixel text-xs text-red-500">
                      <AlertCircle className="size-3" />
                      {errors.title}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-pixel text-xs sm:text-sm text-retro-dark">
                    Pesan Ucapan *
                  </label>
                  <textarea
                    required
                    placeholder="Tulis ucapan dari hati kamu di sini..."
                    value={form.message}
                    onChange={(e) => updateForm({ message: e.target.value })}
                    rows={4}
                    className={`pixel-border w-full min-h-24 bg-retro-cream px-3 py-2.5 sm:py-3 text-sm sm:text-base text-retro-dark outline-none placeholder:text-retro-dark/40 ${errors.message ? 'border-2 border-red-500' : ''}`}
                  />
                  {errors.message ? (
                    <p className="flex items-center gap-1 font-pixel text-xs text-red-500">
                      <AlertCircle className="size-3" />
                      {errors.message}
                    </p>
                  ) : (
                    <p className="font-pixel text-xs text-retro-dark/50">
                      {form.message.length}/500 karakter
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 1: Penerima */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-pixel text-xs sm:text-sm text-retro-dark">
                    Nama Penerima *
                  </label>
                  <input
                    required
                    placeholder="Siapa yang mau kamu kasih card?"
                    value={form.recipientName}
                    onChange={(e) => updateForm({ recipientName: e.target.value })}
                    className={`pixel-border w-full bg-retro-cream px-3 py-2.5 sm:py-3 text-sm sm:text-base text-retro-dark outline-none placeholder:text-retro-dark/40 ${errors.recipientName ? 'border-2 border-red-500' : ''}`}
                  />
                  {errors.recipientName && (
                    <p className="flex items-center gap-1 font-pixel text-xs text-red-500">
                      <AlertCircle className="size-3" />
                      {errors.recipientName}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-pixel text-xs sm:text-sm text-retro-dark">
                    Nama Pembuat Card *
                  </label>
                  <input
                    required
                    placeholder="Siapa yang ngirim card ini?"
                    value={form.creatorName}
                    onChange={(e) => updateForm({ creatorName: e.target.value })}
                    className={`pixel-border w-full bg-retro-cream px-3 py-2.5 sm:py-3 text-sm sm:text-base text-retro-dark outline-none placeholder:text-retro-dark/40 ${errors.creatorName ? 'border-2 border-red-500' : ''}`}
                  />
                  {errors.creatorName && (
                    <p className="flex items-center gap-1 font-pixel text-xs text-red-500">
                      <AlertCircle className="size-3" />
                      {errors.creatorName}
                    </p>
                  )}
                </div>
                <div className="pixel-border-dark bg-retro-dark p-3 sm:p-4 text-sm sm:text-base text-retro-cream">
                  <Heart className="mb-1 size-4 inline" /> Nama penerima dan pembuat akan tampil di
                  card.
                </div>
              </div>
            )}

            {/* Step 2: Template */}
            {step === 2 && (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => updateForm({ templateId: tpl.id })}
                    className={`group relative overflow-hidden p-3 sm:p-4 text-left transition-all ${
                      form.templateId === tpl.id
                        ? 'pixel-border-dark bg-retro-dark'
                        : 'pixel-border bg-retro-cream hover:bg-[var(--hover-bg-subtle)]'
                    }`}
                  >
                    {form.templateId === tpl.id && (
                      <div className="absolute right-2 top-2">
                        <div className="pixel-border-dark flex size-5 items-center justify-center bg-retro-accent text-white">
                          <Check className="size-3" />
                        </div>
                      </div>
                    )}
                    <div
                      className="mb-3 flex h-14 sm:h-16 items-center justify-center pixel-render"
                      style={{ background: tpl.gradient }}
                    >
                      <span className="text-2xl sm:text-3xl">{tpl.emoji}</span>
                    </div>
                    <p className={`font-pixel text-xs sm:text-sm ${form.templateId === tpl.id ? 'text-retro-cream' : 'text-retro-dark'}`}>{tpl.name}</p>
                    <p className={`mt-0.5 text-xs sm:text-sm ${form.templateId === tpl.id ? 'text-retro-cream/60' : 'text-retro-dark/60'}`}>
                      {tpl.description}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* Step 3: Nilai */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-pixel text-xs sm:text-sm text-retro-dark">
                      {getTemplate(form.templateId).suggestedGiftLabel} *
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="50000"
                      value={form.value}
                      onChange={(e) => updateForm({ value: e.target.value })}
                      className={`pixel-border w-full bg-retro-cream px-3 py-2.5 sm:py-3 text-sm sm:text-base text-retro-dark outline-none placeholder:text-retro-dark/40 ${errors.value ? 'border-2 border-red-500' : ''}`}
                    />
                    {errors.value && (
                      <p className="flex items-center gap-1 font-pixel text-xs text-red-500">
                        <AlertCircle className="size-3" />
                        {errors.value}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-pixel text-xs sm:text-sm text-retro-dark">
                      Emoji Hadiah *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['🎁', '🎂', '☕', '💕', '🎉', '🌟', '🎵', '🍰', '🧋', '💝'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => updateForm({ giftEmoji: emoji })}
                          className={`flex size-10 items-center justify-center text-xl transition-all ${
                            form.giftEmoji === emoji
                              ? 'pixel-border-dark bg-retro-dark scale-110'
                              : 'pixel-border bg-retro-cream hover:bg-[var(--hover-bg-subtle)]'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-pixel text-xs sm:text-sm text-retro-dark">
                    Mata Uang *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {currencyOptions.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => updateForm({ currency: emoji })}
                        className={`flex size-10 items-center justify-center text-xl transition-all ${
                          form.currency === emoji
                            ? 'pixel-border-dark bg-retro-dark scale-110'
                            : 'pixel-border bg-retro-cream hover:bg-[var(--hover-bg-subtle)]'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-pixel text-xs sm:text-sm text-retro-dark">
                      Tanggal Mulai *
                    </label>
                    <input
                      required
                      type="date"
                      value={form.startsAt}
                      onChange={(e) => updateForm({ startsAt: e.target.value })}
                      className={`pixel-border w-full bg-retro-cream px-3 py-2.5 sm:py-3 text-sm sm:text-base text-retro-dark ${errors.startsAt ? 'border-2 border-red-500' : ''}`}
                    />
                    {errors.startsAt && (
                      <p className="flex items-center gap-1 font-pixel text-xs text-red-500">
                        <AlertCircle className="size-3" />
                        {errors.startsAt}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-pixel text-xs sm:text-sm text-retro-dark">
                      Tanggal Berakhir *
                    </label>
                    <input
                      required
                      type="date"
                      value={form.expiresAt}
                      onChange={(e) => updateForm({ expiresAt: e.target.value })}
                      className={`pixel-border w-full bg-retro-cream px-3 py-2.5 sm:py-3 text-sm sm:text-base text-retro-dark ${errors.expiresAt ? 'border-2 border-red-500' : ''}`}
                    />
                    {errors.expiresAt && (
                      <p className="flex items-center gap-1 font-pixel text-xs text-red-500">
                        <AlertCircle className="size-3" />
                        {errors.expiresAt}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Preview */}
            {step === 4 && (
              <div className="space-y-4">
                <CardPreview card={previewCard} />
                <div className="pixel-border bg-retro-cream p-3 sm:p-4 text-sm sm:text-base">
                  <p className="mb-2 font-pixel text-xs sm:text-sm text-retro-dark">Ringkasan</p>
                  <div className="space-y-1.5 text-retro-dark/70">
                    <p>
                      <span className="text-retro-dark/50">Judul: </span>
                      {form.title || previewCard.title}
                    </p>
                    <p>
                      <span className="text-retro-dark/50">Penerima: </span>
                      {form.recipientName || 'Teman'}
                    </p>
                    <p>
                      <span className="text-retro-dark/50">Pembuat: </span>
                      {form.creatorName || 'Teman'}
                    </p>
                    <p>
                      <span className="text-retro-dark/50">Template: </span>
                      {getTemplate(form.templateId).emoji} {getTemplate(form.templateId).name}
                    </p>
                    <p>
                      <span className="text-retro-dark/50">{getTemplate(form.templateId).suggestedGiftLabel}: </span>
                      {form.currency}{Number(form.value).toLocaleString('id-ID')}
                    </p>
                    <p>
                      <span className="text-retro-dark/50">Berlaku: </span>
                      {form.startsAt ? new Date(form.startsAt).toLocaleDateString('id-ID') : '-'} — {form.expiresAt ? new Date(form.expiresAt).toLocaleDateString('id-ID') : '-'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Success */}
            {step === 5 && (
              <div className="space-y-4 text-center">
                <div className="pixel-border-dark mx-auto flex size-14 sm:size-16 items-center justify-center bg-retro-accent">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                </div>
                <div>
                  <h2 className="font-pixel text-sm sm:text-base text-retro-dark">
                    Card Ucapan Dibuat!
                  </h2>
                  <p className="mt-1 text-sm sm:text-base text-retro-dark/70">
                    Card ucapan berhasil dibuat dan siap dikirim.
                  </p>
                </div>

                <div className="pixel-border bg-retro-cream p-3">
                  <p className="font-pixel text-xs text-retro-dark/50">Public URL</p>
                  <p className="mt-1 truncate font-pixel text-xs sm:text-sm text-retro-dark">
                    {typeof window !== 'undefined'
                      ? `${window.location.origin}/v/${createdToken}`
                      : `/v/${createdToken}`}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <button onClick={handleCopyLink} className="pixel-border flex items-center justify-center gap-2 bg-white px-4 py-2.5 font-pixel text-xs sm:text-sm text-retro-dark">
                    <Copy className="size-4" />
                    Salin Link
                  </button>
                  <button onClick={handleShareWhatsApp} className="pixel-btn flex items-center justify-center gap-2 bg-[#25D366]">
                    Share WhatsApp
                  </button>
                  <button onClick={handleShareTelegram} className="pixel-btn flex items-center justify-center gap-2 bg-[#0088cc]">
                    Share Telegram
                  </button>
                </div>

                <Link href={`/v/${createdToken}`}>
                  <button className="pixel-border mt-2 flex items-center justify-center gap-2 bg-white px-4 py-2.5 font-pixel text-xs sm:text-sm text-retro-dark">
                    <ExternalLink className="size-4" />
                    Lihat Card
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Navigation */}
          {step < 5 && (
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={step === 0}
                className="flex items-center gap-1 px-4 py-2 font-pixel text-xs sm:text-sm tracking-wider uppercase disabled:opacity-50"
                style={{ color: 'var(--ink)', background: 'transparent', border: 'none' }}
              >
                <ChevronLeft className="size-4" />
                Kembali
              </button>
              <button onClick={step === 4 ? handleCreate : handleNext} className="btn">
                {step === 4 ? 'Buat Card' : 'Selanjutnya'}
                {step < 4 && <ChevronRight className="size-4 ml-1" />}
              </button>
            </div>
          )}

          {step === 5 && (
            <div className="flex justify-center">
              <Link href="/" className="btn" style={{ textDecoration: 'none' }}>
                Kembali ke Beranda
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function CardPreview({ card }: { card: Card }) {
  const tpl = getTemplate(card.templateId);
  const expiry = new Date(card.expiresAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      className="pixel-border relative overflow-hidden p-5 sm:p-6 md:p-8"
      style={{
        background: tpl.gradient,
        color: tpl.textColor,
      }}
    >
      <div className="absolute inset-0" style={{ background: tpl.pattern }} />
      <div className="relative flex flex-col items-center text-center">
        <span className="text-4xl sm:text-5xl mb-3">{tpl.emoji}</span>
        <h3 className="font-pixel text-sm sm:text-base font-bold">{card.title}</h3>
        {card.message && (
          <p className="mt-2 max-w-sm text-sm sm:text-base opacity-80 leading-relaxed">
            {card.message}
          </p>
        )}
        <div className="mt-4 pixel-border-dark bg-white/30 px-4 py-1.5 font-pixel text-xs sm:text-sm backdrop-blur-sm">
          Untuk {card.recipientName}
        </div>
        {card.value > 0 && (
          <p className="mt-3 text-lg sm:text-xl font-bold" style={{ color: tpl.accentColor }}>
            {card.currency}{card.value.toLocaleString('id-ID')}
          </p>
        )}
        {card.value === 0 && (
          <p className="mt-3 text-xs sm:text-sm opacity-60 italic" style={{ color: tpl.accentColor }}>
            {tpl.suggestedGiftLabel}
          </p>
        )}
        {card.creatorName && (
          <p className="mt-2 text-xs sm:text-sm opacity-60">
            Dari {card.creatorName}
          </p>
        )}
        <p className="mt-2 text-xs sm:text-sm opacity-60">Berlaku hingga {expiry}</p>
      </div>
    </div>
  );
}
