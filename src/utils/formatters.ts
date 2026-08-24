// src/utils/formatters.ts

/**
 * فرمت‌کننده قیمت به تومان
 * مثال: 1,500,000,000 → ۱.۵ میلیارد تومان
 */
export const formatPrice = (price: number): string => {
  if (price >= 1_000_000_000) {
    const billions = price / 1_000_000_000;
    return `${billions.toLocaleString('fa-IR')} میلیارد تومان`;
  }
  if (price >= 1_000_000) {
    const millions = price / 1_000_000;
    return `${millions.toLocaleString('fa-IR')} میلیون تومان`;
  }
  return `${price.toLocaleString('fa-IR')} تومان`;
};

/**
 * فرمت‌کننده قیمت برای نمایش روی کارت (به میلیارد)
 */
export const formatPriceShort = (price: number): string => {
  return `${(price / 1_000_000_000).toLocaleString('fa-IR')} میلیارد`;
};

/**
 * فرمت‌کننده تاریخ به فارسی
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * فرمت‌کننده زمان نسبی (مثلاً "۳ ساعت پیش")
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'لحظاتی پیش';
  if (minutes < 60) return `${minutes} دقیقه پیش`;
  if (hours < 24) return `${hours} ساعت پیش`;
  if (days < 7) return `${days} روز پیش`;
  if (days < 30) return `${Math.floor(days / 7)} هفته پیش`;
  return formatDate(timestamp);
};

/**
 * فرمت‌کننده عدد با کاما (جداکننده هزارگان)
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('fa-IR');
};