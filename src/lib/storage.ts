const STORAGE_KEY = 'boba-cards';

function isClient() {
  return typeof window !== 'undefined';
}

export function getCards(): Record<string, unknown>[] {
  if (!isClient()) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
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
