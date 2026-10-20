// PROHAIR 2027 narxlari va hisoblash. Narxlar manbai: src/data/prohair-2027-pricing.json
// (server.cjs ham aynan shu fayldan o'qiydi — narxni faqat o'sha yerda o'zgartiring).
import pricing from '../data/prohair-2027-pricing.json';

export type Residency = 'resident' | 'non_resident';
export type TicketCategory = 'member' | 'non_member' | 'one_day' | 'student' | 'roiv';
export type PeriodId = 'early' | 'standard' | 'late';

export const PRICING = pricing;
export const BASE_CATEGORIES = ['member', 'non_member', 'one_day', 'student'] as const;
export const CONGRESS_DAYS = [pricing.startDate, pricing.endDate] as const;

// Bugungi sana Toshkent vaqti bo'yicha (YYYY-MM-DD) — server bilan bir xil hisoblash uchun
export function todayInTashkent(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tashkent' }).format(now);
}

export function getPeriodIndex(today: string): number {
  return pricing.periods.findIndex((p) => !('until' in p) || !p.until || today <= p.until);
}

export function getPeriodId(today: string): PeriodId {
  return (pricing.periods[getPeriodIndex(today)]?.id ?? 'late') as PeriodId;
}

export function isRoivAvailable(today: string): boolean {
  return today <= pricing.roiv.until;
}

// Gala-ужин bron qilish kongress boshlanishidan 5 kun oldin yopiladi
export function galaDeadline(): string {
  const d = new Date(`${pricing.startDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - pricing.galaDinner.closesDaysBefore);
  return d.toISOString().slice(0, 10);
}

export function isGalaAvailable(today: string): boolean {
  return today < galaDeadline();
}

export function ticketPrice(residency: Residency, category: TicketCategory, today: string): number | null {
  if (category === 'roiv') return isRoivAvailable(today) ? pricing.roiv.price : null;
  const row = pricing.prices[residency][category];
  return row[getPeriodIndex(today)] ?? null;
}

export function formatDayMonth(iso: string): string {
  const [, m, d] = iso.split('-');
  return `${d}.${m}`;
}
