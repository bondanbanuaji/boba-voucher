import type { Card } from '@/types';

const STORAGE_KEY = 'boba-cards';

function isClient() {
  return typeof window !== 'undefined';
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

export function saveCardToHistory(card: Card): void {
  if (!isClient()) return;
  try {
    const cards = getCardsFromHistory();
    const exists = cards.findIndex((c) => c.id === card.id);
    if (exists >= 0) {
      cards[exists] = card;
    } else {
      cards.unshift(card);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch {
    // silently fail
  }
}

export function getCardsFromHistory(): Card[] {
  if (!isClient()) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getCardFromHistory(token: string): Card | undefined {
  const cards = getCardsFromHistory();
  return cards.find((c) => c.token === token);
}

export function deleteCardFromHistory(token: string): void {
  if (!isClient()) return;
  try {
    const cards = getCardsFromHistory();
    const filtered = cards.filter((c) => c.token !== token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // silently fail
  }
}
