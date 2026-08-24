import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const cards = sqliteTable('cards', {
  id: text('id').primaryKey(),
  token: text('token').notNull().unique(),
  title: text('title').notNull(),
  message: text('message').notNull().default(''),
  recipientName: text('recipient_name').notNull(),
  creatorName: text('creator_name').notNull(),
  value: integer('value').notNull().default(0),
  currency: text('currency').notNull().default('🪙'),
  giftEmoji: text('gift_emoji').notNull().default('🎁'),
  templateId: text('template_id').notNull().default('birthday'),
  status: text('status').notNull().default('ACTIVE'),
  startsAt: text('starts_at').notNull(),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').notNull(),
});
