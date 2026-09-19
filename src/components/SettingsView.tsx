import React, { useState, useEffect } from 'react';
import { Sun, Moon, Sparkles, Heart, EyeOff, BookmarkX, Trash2, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface SettingsViewProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export default function SettingsView({ darkMode, setDarkMode }: SettingsViewProps) {
  const [hasBookmarks, setHasBookmarks] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);

  const checkDataPresence = () => {
    const bookmarks = localStorage.getItem('saved_property_ids');
    if (bookmarks) {
      try {
        const list = JSON.parse(bookmarks);
        setHasBookmarks(Array.isArray(list) && list.length > 0);
      } catch (e) {
        setHasBookmarks(false);
      }
    } else {
      setHasBookmarks(false);
    }

    const history = localStorage.getItem('viewed_properties_history');
    if (history) {
      try {
        const list = JSON.parse(history);
        setHasHistory(Array.isArray(list) && list.length > 0);
      } catch (e) {
        setHasHistory(false);
      }
    } else {
      setHasHistory(false);
    }
  };

  useEffect(() => {
    checkDataPresence();
  }, []);

  const handleClearBookmarks = () => {
    if (confirm('آیا از حذف تمامی آگهی‌های نشان‌شده اطمینان دارید؟ این عمل غیرقابل بازگشت است.')) {
      localStorage.removeItem('saved_property_ids');
      setHasBookmarks(false);
      // Emit trigger event to notify any listing cards / components
      window.dispatchEvent(new Event('bookmarks-changed'));
      alert('تمامی نشان‌های شما با موفقیت حذف شدند.');
    }
  };

  const handleClearHistory = () => {
    if (confirm('آیا مطمئن هستید که می‌خواهید کل تاریخچه بازدید آگهی‌ها را پاک کنید؟')) {
      localStorage.removeItem('viewed_properties_history');
      setHasHistory(false);
      // Emit sync event to update the other viewed history tab
      window.dispatchEvent(new Event('history-cleared'));
      alert('تاریخچه بازدید آگهی‌ها با موفقیت پاک شد.');
    }
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white">تنظیمات</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1">مدیریت ظاهر سامانه و پاکسازی داده‌های محلی</p>
      </div>

      {/* Theme Selection Board */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 space-y-4 shadow-xs">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5">
          <Moon className="w-4 h-4 text-indigo-500" />
          تنظیم حالت تم وبسایت
        </h4>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">حالت شب موجب محافظت و آسیب کمتر به چشمان شما در تاریکی می‌شود.</p>
        
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => setDarkMode(false)}
            className={cn(
              "p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all font-black text-xs",
              !darkMode 
                ? "bg-blue-50 dark:bg-blue-900/10 border-blue-500 text-blue-600 shadow-sm" 
                : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300"
            )}
          >
            <Sun className="w-5 h-5 text-orange-500" />
            تم روشن وبسایت
          </button>

          <button
            onClick={() => setDarkMode(true)}
            className={cn(
              "p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all font-black text-xs",
              darkMode 
                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-400 shadow-sm" 
                : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300"
            )}
          >
            <Moon className="w-5 h-5 text-indigo-400" />
            تم تاریک وبسایت
          </button>
        </div>
      </div>

      {/* Safety Actions Block */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 space-y-4 shadow-xs">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5 text-rose-600 dark:text-rose-450">
          حریم خصوصی و حوادث اضطراری
        </h4>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mb-4">با این گزینه‌ها می‌توانید اطلاعات ذخیره شده در حافظه مرورگر خود را فوراً پاک نمایید.</p>

        <div className="space-y-3 pt-2">
          {/* Delete bookmarks */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl">
            <div>
              <p className="text-xs font-black text-slate-800 dark:text-slate-200">حذف تمامی آگهی‌های نشان‌شده</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1">پاکسازی همه آیتم‌های ذخیره شده در پوشه علاقه‌مندی‌ها</p>
            </div>
            <button
              onClick={handleClearBookmarks}
              disabled={!hasBookmarks}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors",
                hasBookmarks 
                  ? "bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-950/35" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed"
              )}
            >
              <BookmarkX className="w-4 h-4" />
              حذف همه
            </button>
          </div>

          {/* Delete history */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl">
            <div>
              <p className="text-xs font-black text-slate-800 dark:text-slate-200">حذف تاریخچه بازدید‌ها</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1">پاک کردن سوابق آگهی‌های دیده شده جهت بازنشانی تاریخچه</p>
            </div>
            <button
              onClick={handleClearHistory}
              disabled={!hasHistory}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors",
                hasHistory 
                  ? "bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-950/35" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed"
              )}
            >
              <EyeOff className="w-4 h-4" />
              حذف تاریخچه
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
