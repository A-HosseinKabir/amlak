import React from 'react';
import { motion } from 'motion/react';
import { X, Scale, ArrowLeftRight, Trash2 } from 'lucide-react';
import { Property } from '../types/property';
import { cn } from '../lib/utils';

interface ComparisonDrawerProps {
  properties: Property[];
  onRemove: (id: string) => void;
  onClose: () => void;
}

export default function ComparisonDrawer({ properties, onRemove, onClose }: ComparisonDrawerProps) {
  if (properties.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-white dark:bg-slate-950 overflow-x-auto transition-colors" dir="rtl">
      <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-6 flex justify-between items-center z-10 w-full transition-colors">
        <div className="flex items-center gap-3">
          <Scale className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-black text-slate-900 dark:text-white">مقایسه هوشمند املاک</h2>
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full text-xs font-bold border border-blue-200 dark:border-blue-900">
            {properties.length.toLocaleString('fa-IR')} مورد
          </span>
        </div>
        <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6 min-w-[800px] flex gap-6">
        {/* Comparison Table */}
        <div className="flex-1 grid grid-cols-[200px_repeat(auto-fill,minmax(250px,1fr))] gap-px bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl dark:shadow-none">
          {/* Labels Column */}
          <div className="bg-slate-50 dark:bg-slate-900 flex flex-col font-black text-slate-500 dark:text-slate-400 text-sm">
            <div className="h-48" /> {/* Image spacer */}
            <LabelRow>عنوان</LabelRow>
            <LabelRow>قیمت (تومان)</LabelRow>
            <LabelRow>نوع ملک</LabelRow>
            <LabelRow>متراژ</LabelRow>
            <LabelRow>اتاق خواب</LabelRow>
            <LabelRow>سرویس</LabelRow>
            <LabelRow>منطقه</LabelRow>
            <div className="p-8 flex-1" />
          </div>

          {/* Property Columns */}
          {properties.map(p => (
            <div key={p.id} className="bg-white dark:bg-slate-900 flex flex-col group relative transition-colors">
              <div className="h-48 overflow-hidden relative">
                <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/5 dark:bg-black/20 group-hover:bg-transparent transition-colors" />
                <button 
                  onClick={() => onRemove(p.id)}
                  className="absolute top-4 right-4 p-2 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <ValueRow className="font-bold text-slate-900 dark:text-white">{p.title}</ValueRow>
              <ValueRow className="text-blue-600 dark:text-blue-400 font-black">
                {(p.price / 1000000000).toLocaleString('fa-IR')} میلیارد
              </ValueRow>
              <ValueRow className="dark:text-slate-300">{p.type}</ValueRow>
              <ValueRow className="dark:text-slate-300">{p.area.toLocaleString('fa-IR')} متر</ValueRow>
              <ValueRow className="dark:text-slate-300">{p.bedrooms.toLocaleString('fa-IR')}</ValueRow>
              <ValueRow className="dark:text-slate-300">{p.bathrooms.toLocaleString('fa-IR')}</ValueRow>
              <ValueRow className="dark:text-slate-300 text-xs">{p.location.address}</ValueRow>
              <div className="p-8 flex-1 flex items-end">
                <button className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-bold text-xs hover:opacity-90 transition-opacity">
                  مشاهده جزئیات
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LabelRow({ children }: { children: React.ReactNode }) {
  return <div className="p-5 border-b border-white dark:border-slate-800/50 h-16 flex items-center">{children}</div>;
}

function ValueRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-5 border-b border-slate-50 dark:border-slate-800/50 h-16 flex items-center text-sm text-slate-600 dark:text-slate-400", className)}>
      {children}
    </div>
  );
}
