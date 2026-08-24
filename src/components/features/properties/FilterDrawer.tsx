// src/components/features/properties/FilterDrawer.tsx
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, SlidersHorizontal, Check } from 'lucide-react';
import { Button, Input } from '../../common';
import { cn } from '../../../utils/cn';
import { DEFAULT_FILTERS, FEATURES_LIST } from '../../../utils/constants';
import { FilterState } from '../../../types/filter.types';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters: FilterState;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  onApply,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  if (!isOpen) return null;

  const toggleFeature = (feature: string) => {
    setFilters((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
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
        {/* هدر */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white">فیلترهای پیشرفته</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-400 dark:text-slate-500" />
          </button>
        </div>

        {/* محتوای فیلترها */}
        <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide">
          {/* محدوده قیمت */}
          <section className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">محدوده قیمت (میلیارد تومان)</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                label="حداقل"
              />
              <Input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                label="حداکثر"
              />
            </div>
          </section>

          {/* محدوده متراژ */}
          <section className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">متراژ (متر مربع)</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                value={filters.minArea}
                onChange={(e) => setFilters({ ...filters, minArea: Number(e.target.value) })}
                label="حداقل"
              />
              <Input
                type="number"
                value={filters.maxArea}
                onChange={(e) => setFilters({ ...filters, maxArea: Number(e.target.value) })}
                label="حداکثر"
              />
            </div>
          </section>

          {/* نوع ملک */}
          <section className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">نوع ملک</h3>
            <div className="flex flex-wrap gap-2">
              {['همه', 'آپارتمان', 'ویلایی', 'اداری', 'تجاری'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilters({ ...filters, type: type as any })}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-bold transition-all',
                    filters.type === type
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800'
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>

          {/* تعداد اتاق */}
          <section className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">تعداد اتاق خواب</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, '5+'].map((n) => (
                <button
                  key={n}
                  onClick={() =>
                    setFilters({ ...filters, bedrooms: n === '5+' ? 5 : Number(n) })
                  }
                  className={cn(
                    'w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all',
                    filters.bedrooms === (n === '5+' ? 5 : n)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800'
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </section>

          {/* امکانات */}
          <section className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white">امکانات ویژه</h3>
            <div className="grid grid-cols-2 gap-3">
              {FEATURES_LIST.map((feature) => (
                <button
                  key={feature}
                  onClick={() => toggleFeature(feature)}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-2xl border transition-all text-right',
                    filters.features.includes(feature)
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-400'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  )}
                >
                  <div
                    className={cn(
                      'w-5 h-5 rounded-md flex items-center justify-center transition-all shadow-sm',
                      filters.features.includes(feature)
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800'
                    )}
                  >
                    {filters.features.includes(feature) && <Check className="w-3 h-3" />}
                  </div>
                  <span className="text-sm font-bold">{feature}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* دکمه‌های پایین */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-2 gap-4">
          <Button variant="secondary" onClick={() => setFilters(DEFAULT_FILTERS)}>
            پاک کردن همه
          </Button>
          <Button variant="primary" onClick={() => onApply(filters)}>
            اعمال فیلترها
          </Button>
        </div>
      </motion.div>
    </div>
  );
};