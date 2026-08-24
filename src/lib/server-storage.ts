import { promises as fs } from 'fs';
import path from 'path';
import type { Card } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const CARDS_FILE = path.join(DATA_DIR, 'cards.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readCards(): Promise<Card[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(CARDS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeCards(cards: Card[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(CARDS_FILE, JSON.stringify(cards, null, 2), 'utf-8');
}

export async function saveCardServer(card: Card): Promise<void> {
  const cards = await readCards();
  cards.push(card);
  await writeCards(cards);
}

export async function getCardByTokenServer(token: string): Promise<Card | undefined> {
  const cards = await readCards();
  return cards.find((c) => c.token === token);
}

export async function claimCardServer(token: string): Promise<boolean> {
  const cards = await readCards();
  const index = cards.findIndex((c) => c.token === token);
  if (index === -1) return false;
  if (cards[index].status !== 'ACTIVE') return false;
  if (new Date(cards[index].expiresAt) < new Date()) return false;
  cards[index].status = 'CLAIMED';
  await writeCards(cards);
  return true;
}

export async function updateCardServer(
  id: string,
  updates: Partial<Card>
): Promise<Card | undefined> {
  const cards = await readCards();
  const index = cards.findIndex((c) => c.id === id);
  if (index === -1) return undefined;
  cards[index] = { ...cards[index], ...updates };
  await writeCards(cards);
  return cards[index];
}
