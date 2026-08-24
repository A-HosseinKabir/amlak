// src/utils/validators.ts

/**
 * اعتبارسنجی شماره موبایل ایران
 * الگو: ۰۹۱۲۳۴۵۶۷۸۹
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  return /^09[0-9]{9}$/.test(phone);
};

/**
 * اعتبارسنجی کد تایید (۶ رقمی)
 */
export const isValidOtp = (otp: string): boolean => {
  return /^[0-9]{6}$/.test(otp);
};

/**
 * اعتبارسنجی ایمیل (ساده)
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * اعتبارسنجی خالی نبودن
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};