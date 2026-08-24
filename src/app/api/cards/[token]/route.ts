import { NextRequest, NextResponse } from 'next/server';
import { getCardByTokenServer, claimCardServer, updateCardServer } from '@/lib/server-storage';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const card = await getCardByTokenServer(token);

    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(card);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch card' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await request.json();

    if (body.action === 'claim') {
      const success = await claimCardServer(token);
      if (!success) {
        return NextResponse.json(
          { error: 'Cannot claim card' },
          { status: 400 }
        );
      }
      return NextResponse.json({ success: true });
    }

    const card = await getCardByTokenServer(token);
    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    const updated = await updateCardServer(card.id, body);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: 'Failed to update card' },
      { status: 500 }
    );
  }
}
