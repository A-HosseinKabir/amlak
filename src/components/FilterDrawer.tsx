import { useState } from 'react';
import { motion } from 'motion/react';
import { X, SlidersHorizontal, Check } from 'lucide-react';
import { PropertyType } from '../types/property';
import { cn } from '../lib/utils';

interface FilterState {
  minPrice: number;
  maxPrice: number;
  minArea: number;
  maxArea: number;
  bedrooms: number | null;
  bathrooms: number | null;
  type: PropertyType | 'همه';
  features: string[];
}

interface FilterDrawerProps {
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters: FilterState;
}

const FEATURES = ['پارکینگ', 'انباری', 'آسانسور', 'بالکن', 'استخر', 'سونا', 'لابی من', 'روف گاردن'];

const RESET_FILTERS: FilterState = {
  minPrice: 0,
  maxPrice: 500,
  minArea: 0,
  maxArea: 2000,
  bedrooms: null,
  bathrooms: null,
  type: 'همه',
  features: []
};

export default function FilterDrawer({ onClose, onApply, initialFilters }: FilterDrawerProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const toggleFeature = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm" dir="rtl">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 sticky top-0 z-10 transition-colors">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white">فیلترهای پیشرفته</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400 dark:text-slate-500" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide">
          {/* Price Range */}
          <section className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">محدوده قیمت (میلیارد تومان)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">حداقل</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={e => setFilters({...filters, minPrice: Number(e.target.value)})}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-all shadow-inner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">حداکثر</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={e => setFilters({...filters, maxPrice: Number(e.target.value)})}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-all shadow-inner"
                />
              </div>
            </div>
          </section>

          {/* Area Range */}
          <section className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">متراژ (متر مربع)</h3>
             <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="حداقل"
                value={filters.minArea}
                onChange={e => setFilters({...filters, minArea: Number(e.target.value)})}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-all shadow-inner"
              />
              <input
                type="number"
                placeholder="حداکثر"
                value={filters.maxArea}
                onChange={e => setFilters({...filters, maxArea: Number(e.target.value)})}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-all shadow-inner"
              />
            </div>
          </section>

          {/* Type */}
          <section className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">نوع ملک</h3>
            <div className="flex flex-wrap gap-2">
              {['همه', ...Object.values(PropertyType)].map(t => (
                <button
                  key={t}
                  onClick={() => setFilters({...filters, type: t as any})}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-bold transition-all",
                    filters.type === t 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-none" 
                      : "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          {/* Rooms */}
          <section className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">تعداد اتاق خواب</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, '5+'].map(n => (
                <button
                  key={n}
                  onClick={() => setFilters({...filters, bedrooms: n === '5+' ? 5 : Number(n)})}
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all",
                    filters.bedrooms === (n === '5+' ? 5 : n)
                      ? "bg-blue-600 text-white"
                      : "bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 shadow-sm"
                  )}
                >
                  {n.toLocaleString('fa-IR')}
                </button>
              ))}
            </div>
          </section>

          {/* Features */}
          <section className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">امکانات ویژه</h3>
            <div className="grid grid-cols-2 gap-3">
              {FEATURES.map(feat => (
                <button
                  key={feat}
                  onClick={() => toggleFeature(feat)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl border transition-all text-right",
                    filters.features.includes(feat)
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-400"
                      : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-md flex items-center justify-center transition-all shadow-sm",
                    filters.features.includes(feat) ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800"
                  )}>
                    {filters.features.includes(feat) && <Check className="w-3 h-3" />}
                  </div>
                  <span className="text-sm font-bold">{feat}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-2 gap-4">
          <button
            onClick={() => setFilters(RESET_FILTERS)}
            className="py-4 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            پاک کردن همه
          </button>
          <button
            onClick={() => onApply(filters)}
            className="py-4 rounded-3xl bg-blue-600 text-white font-black hover:bg-blue-500 transition-colors shadow-lg shadow-blue-100 dark:shadow-none"
          >
            اعمال فیلترها
          </button>
        </div>
      </motion.div>
    </div>
  );
}
