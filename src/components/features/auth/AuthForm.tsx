// src/components/features/auth/AuthForm.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, User, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { Button, Input } from '../../common';
import { isValidPhoneNumber, isValidOtp } from '../../../utils/validators';
import { cn } from '../../../utils/cn';

interface AuthFormProps {
  onClose?: () => void;
}

type Step = 'phone' | 'otp' | 'register';

export const AuthForm: React.FC<AuthFormProps> = ({ onClose }) => {
  const { sendOtp, login, updateProfile, user, isLoading } = useAuth();
  const [step, setStep] = useState<Step>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState('');

  const handleSendOtp = async () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      setError('شماره موبایل نامعتبر است (مثلاً ۰۹۱۲۳۴۵۶۷۸۹)');
      return;
    }
    setError('');
    try {
      const session = await sendOtp(phoneNumber);
      setSessionId(session);
      setStep('otp');
    } catch {
      setError('خطا در ارسال کد تایید');
    }
  };

  const handleVerifyOtp = async () => {
    if (!isValidOtp(otp)) {
      setError('کد تایید ۶ رقمی است');
      return;
    }
    setError('');
    try {
      await login(phoneNumber, otp);
      if (user && !user.displayName) {
        setStep('register');
      } else {
        onClose?.();
      }
    } catch {
      setError('کد تایید اشتباه است یا منقضی شده');
    }
  };

  const handleCompleteRegistration = async () => {
    if (!displayName.trim()) {
      setError('نام و نام خانوادگی خود را وارد کنید');
      return;
    }
    setError('');
    try {
      await updateProfile(displayName);
      onClose?.();
    } catch {
      setError('خطا در ثبت نام');
    }
  };

  return (
    <div className="w-full max-w-sm p-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-6 left-6 p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:text-rose-500 transition-colors"
        >
          <ArrowRight className="w-6 h-6 rotate-180" />
        </button>
      )}

      <AnimatePresence mode="wait">
        {step === 'phone' && (
          <motion.div
            key="phone"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100 dark:border-blue-800">
                <Phone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">خوش آمدید!</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                برای ورود یا ثبت‌نام شماره موبایل خود را وارد کنید
              </p>
            </div>

            <div className="space-y-4">
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                leftIcon={<Phone className="w-5 h-5" />}
                error={error}
                maxLength={11}
                autoFocus
              />

              <Button
                onClick={handleSendOtp}
                loading={isLoading}
                fullWidth
                size="lg"
              >
                دریافت کد تایید
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'otp' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100 dark:border-blue-800">
                <CheckCircle2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">کد تایید را وارد کنید</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                کد ۶ رقمی ارسال شده به {phoneNumber} را وارد کنید
              </p>
            </div>

            <div className="space-y-4">
              <Input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
                placeholder="- - - - - -"
                error={error}
                maxLength={6}
                className="text-center text-2xl tracking-[0.5em] font-black"
                autoFocus
              />

              <Button
                onClick={handleVerifyOtp}
                loading={isLoading}
                fullWidth
                size="lg"
              >
                تایید و ادامه
              </Button>

              <button
                onClick={() => {
                  setStep('phone');
                  setError('');
                }}
                className="w-full text-slate-400 dark:text-slate-500 text-sm font-bold hover:text-slate-600 transition-colors"
                disabled={isLoading}
              >
                تغییر شماره موبایل
              </button>
            </div>
          </motion.div>
        )}

        {step === 'register' && (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 dark:border-emerald-800">
                <User className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">تکمیل پروفایل</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                لطفاً نام خود را وارد کنید
              </p>
            </div>

            <div className="space-y-4">
              <Input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="نام و نام خانوادگی"
                leftIcon={<User className="w-5 h-5" />}
                error={error}
                autoFocus
              />

              <Button
                onClick={handleCompleteRegistration}
                loading={isLoading}
                fullWidth
                size="lg"
              >
                ثبت نام و شروع
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthForm;