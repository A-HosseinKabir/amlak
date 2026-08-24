import React from 'react';
import { Home, Compass, Phone, Mail, Award, CheckCircle, MapPin, Sparkles } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="space-y-8 animate-fadeIn text-right" dir="rtl">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white p-8 md:p-12 border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-slate-950/80 index-0" />
        
        {/* Glow decoration */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight">هوم‌هاب (HomeHub)</span>
              <p className="text-xs text-blue-400 font-bold mt-1">سامانه هوشمند املاک کلان‌شهر زیبای تبریز</p>
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-slate-100 max-w-lg leading-relaxed pt-2">
            مدرن‌ترین مرجع معرفی، بررسی تعاملی و درخواست بازدید املاک و مستغلات در تبریز مجهز به تور مجازی ۳۶۰ درجه.
          </h3>
        </div>
      </div>

      {/* Grid of Perks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PerkCard 
          icon={<Award className="w-6 h-6 text-blue-500" />}
          title="برترین سازه‌‌ها"
          description="دسته‌بندی و گلچین لوکس‌ترین و خوش‌نقشه‌ترین واحدهای آپارتمانی و ویلایی در مناطق اصیل تبریز."
        />
        <PerkCard 
          icon={<Compass className="w-6 h-6 text-indigo-500" />}
          title="بازدید مجازی ۳۶۰ درجه"
          description="بدون نیاز به حضور فیزیکی، تک‌تک اتاق‌ها، کابینت‌ها و دید خانه را با تورهای تعاملی بررسی کنید."
        />
        <PerkCard 
          icon={<Sparkles className="w-6 h-6 text-rose-500" />}
          title="زمان‌بندی هوشمند بازدید"
          description="تا ۳ بازه زمانی پیشنهادی را انتخاب کنید تا هماهنگی نهایی حضور شما خودکار با مالک انجام شود."
        />
      </div>

      {/* Our Mission */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 space-y-4 shadow-sm">
        <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          هدف و ارزش‌های ما
        </h4>
        <p className="text-slate-600 dark:text-slate-400 leading-8 text-sm text-justify">
          هوم‌هاب با تکیه بر ساده‌سازی فرآیندهای یافتن مسکن و ایجاد بستری شفاف و امن میان جستجوگران ملک، مالکان و مشاورین برتر شکل یافته است. تلاش ما بر این است که با ارائه فناوری‌های روزآمد نظیر تورهای سه‌بعدی و ثبت تقویم‌های بازدید آفلاین، اتلاف وقت را به حداقل ممکن کاهش داده و تجربه‌ای خاطره‌انگیر از خرید یا اجاره سر پناهی لوکس در تبریز رقم بزنیم.
        </p>
      </div>

      {/* Footer Contact */}
      <div className="bg-slate-100/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">دفتر مرکزی: تبریز، کوی ولیعصر، برج تجارت</span>
        </div>
        <div className="flex gap-4">
          <a href="mailto:support@homehub.ir" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1.5 text-xs font-bold">
            <Mail className="w-4 h-4" />
            support@homehub.ir
          </a>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <a href="tel:04133333333" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1.5 text-xs font-bold" dir="ltr">
            ۰۴۱-۳۳۳۳۳۳۳۳
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

function PerkCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] space-y-3 shadow-xs">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center border border-slate-100 dark:border-slate-800">
        {icon}
      </div>
      <h4 className="font-black text-slate-900 dark:text-white text-base">{title}</h4>
      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed text-justify">{description}</p>
    </div>
  );
}
