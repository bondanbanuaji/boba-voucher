import type { Card } from '@/types';

const STORAGE_KEY = 'boba-cards';

function isClient() {
  return typeof window !== 'undefined';
}

export function getCards(): Card[] {
  if (!isClient()) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCard(card: Card): void {
  if (!isClient()) return;
  const cards = getCards();
  cards.push(card);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

export function getCardByToken(token: string): Card | undefined {
  return getCards().find((c) => c.token === token);
}

export function updateCard(
  id: string,
  updates: Partial<Card>
): Card | undefined {
  if (!isClient()) return undefined;
  const cards = getCards();
  const index = cards.findIndex((c) => c.id === id);
  if (index === -1) return undefined;
  cards[index] = { ...cards[index], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  return cards[index];
}

export function claimCard(token: string): boolean {
  if (!isClient()) return false;
  const cards = getCards();
  const index = cards.findIndex((c) => c.token === token);
  if (index === -1) return false;
  if (cards[index].status !== 'ACTIVE') return false;
  if (new Date(cards[index].expiresAt) < new Date()) return false;
  cards[index].status = 'CLAIMED';
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  return true;
}

export function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateId(): string {
  return `crd-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
