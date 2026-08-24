import React, { useState } from 'react';
import { Phone, MessageSquare, User, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api, User as ApiUser } from '../services/backendService';

interface AuthFormProps {
  onSuccess: (user: ApiUser) => void;
  onClose?: () => void;
}

export default function AuthForm({ onSuccess, onClose }: AuthFormProps) {
  const [step, setStep] = useState<'phone' | 'otp' | 'register'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);

  const handleSendOtp = async () => {
    if (!phoneNumber.startsWith('09') || phoneNumber.length !== 11) {
      setError('شماره موبایل وارد شده صحیح نیست (مثلاً ۰۹۱۲۳۴۵۶۷۸۹)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.sendOtp(phoneNumber);
      if (response.success) {
        setSessionId(response.sessionId);
        setStep('otp');
      }
    } catch (err: any) {
      setError('خطا در ارتباط با سرور بک‌بند شما.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('کد تایید ۶ رقمی را وارد کنید');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.verifyOtp(phoneNumber, otp, sessionId);
      const user = response.user;

      if (!user.displayName) {
        setCurrentUser(user);
        setStep('register');
      } else {
        localStorage.setItem('auth_token', response.token);
        onSuccess(user);
      }
    } catch (err: any) {
      setError('کد تایید اشتباه است یا منقضی شده');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegistration = async () => {
    if (!userName.trim()) {
      setError('نام و نام خانوادگی خود را وارد کنید');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (currentUser) {
        const updatedUser = await api.updateProfile(currentUser.id, userName);
        onSuccess(updatedUser);
      }
    } catch (err: any) {
      setError('خطا در ثبت اطلاعات در سرور شما');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full max-w-sm p-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 transition-all overflow-hidden relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-6 left-6 p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:text-rose-500 transition-colors"
          >
            <ArrowRight className="w-6 h-6 rotate-180" />
          </button>
        )}
        <div id="recaptcha-container"></div>

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
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">برای ورود یا ثبت‌نام شماره موبایل خود را وارد کنید</p>
              </div>

              <div className="space-y-4">
                <div className="relative group">

                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="شماره موبایل خود را وارد نمایید"
                    className="text-center w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 py-4 pr-12 pl-4 rounded-3xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono tracking-[0.2em]"
                    maxLength={11}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                </div>

                {error && <p className="text-rose-500 text-xs font-bold px-2">{error}</p>}

                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 rounded-3xl font-black shadow-lg shadow-blue-100 dark:shadow-none hover:bg-blue-500 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>دریافت کد تایید </>}
                </button>
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
                  <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">کد تایید را وارد کنید</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">کد ۶ رقمی ارسال شده به {phoneNumber} را وارد کنید</p>
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
                    placeholder="- - - - - -"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 py-4 px-4 rounded-3xl text-slate-900 dark:text-white text-center outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-black text-2xl tracking-[0.5em]"
                    autoFocus
                  />
                </div>

                {error && <p className="text-rose-500 text-xs font-bold text-center">{error}</p>}

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 rounded-3xl font-black shadow-lg shadow-blue-100 dark:shadow-none hover:bg-blue-500 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'تایید و ادامه'}
                </button>

                <button
                  onClick={() => setStep('phone')}
                  className="w-full text-slate-400 dark:text-slate-500 text-sm font-bold hover:text-slate-600 transition-colors"
                  disabled={loading}
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
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">تکمیل پروفایل</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">لطفاً برای اولین بار نام خود را وارد کنید</p>
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="نام و نام خانوادگی"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 py-4 pr-12 pl-4 rounded-3xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                    autoFocus
                  />
                </div>

                {error && <p className="text-rose-500 text-xs font-bold px-2">{error}</p>}

                <button
                  onClick={handleCompleteRegistration}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 rounded-3xl font-black shadow-lg shadow-blue-100 dark:shadow-none hover:bg-blue-500 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'ثبت نام و شروع'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
