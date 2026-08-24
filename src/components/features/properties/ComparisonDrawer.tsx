// src/components/features/properties/ComparisonDrawer.tsx
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Scale, Trash2, ArrowLeftRight } from 'lucide-react';
import { useProperties } from '../../../hooks/useProperties';
import { Button, Card } from '../../common';
import { cn } from '../../../utils/cn';
import { formatPriceShort, formatNumber } from '../../../utils/formatters';

interface ComparisonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  propertyIds: string[];
  onRemove: (id: string) => void;
}

export const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({
  isOpen,
  onClose,
  propertyIds,
  onRemove,
}) => {
  const { properties } = useProperties();
  const compareProperties = properties.filter((p) => propertyIds.includes(p.id));

  if (!isOpen) return null;

  const specs = [
    { key: 'title', label: 'عنوان' },
    { key: 'price', label: 'قیمت', formatter: (v: number) => formatPriceShort(v) },
    { key: 'type', label: 'نوع ملک' },
    { key: 'area', label: 'متراژ', formatter: (v: number) => `${formatNumber(v)} متر` },
    { key: 'bedrooms', label: 'اتاق خواب', formatter: formatNumber },
    { key: 'bathrooms', label: 'سرویس', formatter: formatNumber },
    { key: 'location', label: 'منطقه', formatter: (v: any) => v.address },
  ];

  return (
    <div className="fixed inset-0 z-[90] bg-white dark:bg-slate-950 overflow-auto" dir="rtl">
      {/* هدر */}
      <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <Scale className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-black text-slate-900 dark:text-white">مقایسه هوشمند املاک</h2>
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full text-xs font-bold">
            {compareProperties.length} مورد
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* محتوای جدول مقایسه */}
      <div className="p-6 min-w-[800px]">
        {compareProperties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 dark:text-slate-500 font-bold">
              هیچ ملکی برای مقایسه انتخاب نشده است
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[180px_repeat(auto-fill,minmax(200px,1fr))] gap-px bg-slate-200 dark:bg-slate-700 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700">
            {/* ستون برچسب‌ها */}
            <div className="bg-slate-50 dark:bg-slate-800 flex flex-col font-black text-slate-500 dark:text-slate-400 text-sm">
              <div className="h-44 bg-slate-100 dark:bg-slate-800/50" />
              {specs.map((spec) => (
                <div
                  key={spec.key}
                  className="p-4 border-b border-white dark:border-slate-700/50 h-14 flex items-center"
                >
                  {spec.label}
                </div>
              ))}
            </div>

            {/* ستون‌های ملک‌ها */}
            {compareProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white dark:bg-slate-900 flex flex-col group relative"
              >
                {/* تصویر */}
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => onRemove(property.id)}
                    className="absolute top-3 right-3 p-2 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* مقادیر */}
                {specs.map((spec) => {
                  const value = property[spec.key as keyof typeof property];
                  const display = spec.formatter ? spec.formatter(value) : value;
                  return (
                    <div
                      key={spec.key}
                      className="p-4 border-b border-slate-50 dark:border-slate-800/50 h-14 flex items-center text-sm text-slate-700 dark:text-slate-300"
                    >
                      {typeof display === 'string' || typeof display === 'number'
                        ? display
                        : String(display)}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonDrawer;