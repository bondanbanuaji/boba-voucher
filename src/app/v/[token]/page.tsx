'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { Gift, AlertCircle, ArrowLeft } from 'lucide-react';
import { getCardByToken } from '@/lib/storage';
import AqsaCardView from '@/components/aqsa-card-view';
import { DeveloperBadge } from '@/components/developer-badge';
import type { Card } from '@/types';

export default function CardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [mounted, setMounted] = useState(false);
  const [card, setCard] = useState<Card | null>(undefined as unknown as null);

  useEffect(() => {
    async function fetchCard() {
      try {
        const res = await fetch(`/api/cards/${token}`);
        if (res.ok) {
          const serverCard: Card = await res.json();
          setCard(serverCard);
        } else {
          const localCard = getCardByToken(token);
          setCard(localCard || null);
        }
      } catch {
        const localCard = getCardByToken(token);
        setCard(localCard || null);
      }
      setMounted(true);
    }
    fetchCard();
  }, [token]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center" style={{ background: '#feecea' }}>
        <div className="flex flex-col items-center gap-5 px-4 text-center">
          <div className="size-8 animate-spin rounded-full border-2 border-[#333] border-t-transparent" />
          <p style={{ fontFamily: "'Sriracha', cursive", color: '#666' }}>Memuat...</p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center" style={{ background: '#feecea' }}>
        <div className="flex flex-col items-center gap-5 px-4 text-center">
          <div
            style={{
              width: 64,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#333',
              borderRadius: 4,
            }}
          >
            <AlertCircle size={28} color="#fff" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h1 style={{ fontFamily: "'Titan One', sans-serif", fontSize: '1.3rem', color: '#333' }}>
              Card Tidak Ditemukan
            </h1>
            <p style={{ fontFamily: "'Poppins', sans-serif", color: '#888' }}>
              Card dengan token ini tidak ada atau sudah tidak berlaku.
            </p>
          </div>
          <Link href="/">
            <button
              style={{
                fontFamily: "'Sriracha', cursive",
                padding: '10px 24px',
                borderRadius: 50,
                border: '3px solid #333',
                background: '#333',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '1rem',
              }}
            >
              <ArrowLeft size={16} />
              Kembali
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <AqsaCardView card={card} />
      {/* Minimal footer with developer badge */}
      <div style={{ position: 'fixed', bottom: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 50 }}>
        <DeveloperBadge compact />
      </div>
    </>
  );
}
