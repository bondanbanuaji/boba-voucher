import { NextRequest, NextResponse } from 'next/server';
import { saveCardServer } from '@/lib/server-storage';
import type { Card } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const card: Card = await request.json();

    if (!card.token || !card.title || !card.recipientName) {
      return NextResponse.json(
        { error: 'Invalid card data' },
        { status: 400 }
      );
    }

    await saveCardServer(card);
    return NextResponse.json({ success: true, token: card.token });
  } catch {
    return NextResponse.json(
      { error: 'Failed to save card' },
      { status: 500 }
    );
  }
}
