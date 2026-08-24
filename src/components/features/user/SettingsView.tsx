// src/components/features/user/SettingsView.tsx
import React from 'react';
import { Sun, Moon, BookmarkX, EyeOff } from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { useBookmarks } from '../../../hooks/useBookmarks';
import { useHistory } from '../../../hooks/useHistory';
import { Button, Card } from '../../common';
import { cn } from '../../../utils/cn';

export const SettingsView: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { clearBookmarks } = useBookmarks();
  const { clearHistory } = useHistory();

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white">تنظیمات</h3>
        <p className="text-xs text-slate-400 font-bold mt-1">
          مدیریت ظاهر سامانه و پاکسازی داده‌های محلی
        </p>
      </div>

      {/* تم */}
      <Card variant="default" padding="lg">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5 mb-4">
          <Moon className="w-4 h-4 text-indigo-500" />
          تنظیم حالت تم
        </h4>
        <p className="text-xs text-slate-400 font-bold mb-4">
          حالت شب موجب محافظت و آسیب کمتر به چشمان شما در تاریکی می‌شود.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => !isDark && toggleTheme()}
            className={cn(
              'p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all font-black text-xs',
              !isDark
                ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-500 text-blue-600 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:border-slate-300'
            )}
          >
            <Sun className="w-5 h-5 text-orange-500" />
            تم روشن
          </button>
          <button
            onClick={() => isDark && toggleTheme()}
            className={cn(
              'p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all font-black text-xs',
              isDark
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-400 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:border-slate-300'
            )}
          >
            <Moon className="w-5 h-5 text-indigo-400" />
            تم تاریک
          </button>
        </div>
      </Card>

      {/* امنیت و حریم خصوصی */}
      <Card variant="default" padding="lg">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5 text-rose-600 dark:text-rose-400 mb-4">
          حریم خصوصی
        </h4>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl">
            <div>
              <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                حذف تمامی نشان‌ها
              </p>
              <p className="text-[10px] text-slate-400 font-bold mt-1">
                پاکسازی همه آیتم‌های ذخیره شده در پوشه علاقه‌مندی‌ها
              </p>
            </div>
            <Button variant="danger" size="sm" onClick={clearBookmarks}>
              <BookmarkX className="w-4 h-4" />
              حذف همه
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl">
            <div>
              <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                حذف تاریخچه بازدید
              </p>
              <p className="text-[10px] text-slate-400 font-bold mt-1">
                پاک کردن سوابق آگهی‌های دیده شده
              </p>
            </div>
            <Button variant="danger" size="sm" onClick={clearHistory}>
              <EyeOff className="w-4 h-4" />
              حذف تاریخچه
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsView;