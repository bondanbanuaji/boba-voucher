import { eq } from 'drizzle-orm';
import { db } from './index';
import { cards } from './schema';
import type { Card } from '@/types';

function rowToCard(row: typeof cards.$inferSelect): Card {
  return {
    id: row.id,
    token: row.token,
    title: row.title,
    message: row.message,
    recipientName: row.recipientName,
    creatorName: row.creatorName,
    value: row.value,
    currency: row.currency,
    giftEmoji: row.giftEmoji,
    templateId: row.templateId,
    status: row.status as Card['status'],
    startsAt: row.startsAt,
    expiresAt: row.expiresAt,
    createdAt: row.createdAt,
  };
}

export async function saveCardToDb(card: Card): Promise<void> {
  await db.insert(cards).values({
    id: card.id,
    token: card.token,
    title: card.title,
    message: card.message,
    recipientName: card.recipientName,
    creatorName: card.creatorName,
    value: card.value,
    currency: card.currency,
    giftEmoji: card.giftEmoji,
    templateId: card.templateId,
    status: card.status,
    startsAt: card.startsAt,
    expiresAt: card.expiresAt,
    createdAt: card.createdAt,
  });
}

export async function getCardByTokenFromDb(token: string): Promise<Card | undefined> {
  const row = await db.select().from(cards).where(eq(cards.token, token)).get();
  return row ? rowToCard(row) : undefined;
}

export async function claimCardInDb(token: string): Promise<boolean> {
  const row = await db.select().from(cards).where(eq(cards.token, token)).get();
  if (!row) return false;
  if (row.status !== 'ACTIVE') return false;
  if (new Date(row.expiresAt) < new Date()) return false;

  await db.update(cards).set({ status: 'CLAIMED' }).where(eq(cards.token, token));
  return true;
}

export async function updateCardInDb(
  id: string,
  updates: Partial<Card>
): Promise<Card | undefined> {
  const row = await db.select().from(cards).where(eq(cards.id, id)).get();
  if (!row) return undefined;

  const setValues: Record<string, unknown> = {};
  if (updates.title !== undefined) setValues.title = updates.title;
  if (updates.message !== undefined) setValues.message = updates.message;
  if (updates.recipientName !== undefined) setValues.recipientName = updates.recipientName;
  if (updates.creatorName !== undefined) setValues.creatorName = updates.creatorName;
  if (updates.value !== undefined) setValues.value = updates.value;
  if (updates.currency !== undefined) setValues.currency = updates.currency;
  if (updates.giftEmoji !== undefined) setValues.giftEmoji = updates.giftEmoji;
  if (updates.templateId !== undefined) setValues.templateId = updates.templateId;
  if (updates.status !== undefined) setValues.status = updates.status;
  if (updates.startsAt !== undefined) setValues.startsAt = updates.startsAt;
  if (updates.expiresAt !== undefined) setValues.expiresAt = updates.expiresAt;

  if (Object.keys(setValues).length === 0) return rowToCard(row);

  await db.update(cards).set(setValues).where(eq(cards.id, id));
  const updated = await db.select().from(cards).where(eq(cards.id, id)).get();
  return updated ? rowToCard(updated) : undefined;
}
