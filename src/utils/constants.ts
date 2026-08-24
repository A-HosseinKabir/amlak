// src/utils/constants.ts

import { Property } from '../types/property.types';

// همان MOCK_PROPERTIES که در constants.ts فعلی داری
export const MOCK_PROPERTIES: Property[] = [
  // ... همان داده‌های mock قبلی
];

// ثابت‌های فیلتر
export const DEFAULT_FILTERS = {
  minPrice: 0,
  maxPrice: 500,
  minArea: 0,
  maxArea: 2000,
  bedrooms: null,
  bathrooms: null,
  type: 'همه' as const,
  features: [] as string[],
};

// امکانات رفاهی
export const FEATURES_LIST = [
  'پارکینگ',
  'انباری',
  'آسانسور',
  'بالکن',
  'استخر',
  'سونا',
  'لابی من',
  'روف گاردن',
];

// روزهای هفته
export const WEEKDAYS = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
];