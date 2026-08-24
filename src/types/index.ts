export type CardStatus = 'ACTIVE' | 'CLAIMED' | 'CANCELLED';

export interface Card {
  id: string;
  token: string;
  title: string;
  message: string;
  recipientName: string;
  creatorName: string;
  value: number;
  currency: string;
  giftEmoji: string;
  templateId: string;
  status: CardStatus;
  startsAt: string;
  expiresAt: string;
  createdAt: string;
}

export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  emoji: string;
  gradient: string;
  textColor: string;
  accentColor: string;
  pattern: string;
  suggestedTitle: string;
  suggestedMessage: string;
  suggestedGiftLabel: string;
}
