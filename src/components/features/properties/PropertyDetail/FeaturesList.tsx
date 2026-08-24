// src/components/features/properties/PropertyDetail/FeaturesList.tsx
import React from 'react';
import {
  ParkingCircle,
  Box,
  ArrowUpCircle,
  Flame,
  Waves,
  ShieldCheck,
  LayoutGrid,
} from 'lucide-react';

interface FeaturesListProps {
  features: string[];
}

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  'پارکینگ': <ParkingCircle className="w-5 h-5" />,
  'انباری': <Box className="w-5 h-5" />,
  'آسانسور': <ArrowUpCircle className="w-5 h-5" />,
  'گرمایش مرکزی': <Flame className="w-5 h-5" />,
  'استخر': <Waves className="w-5 h-5" />,
  'لابی من': <ShieldCheck className="w-5 h-5" />,
  'روف گاردن': <LayoutGrid className="w-5 h-5" />,
};

export const FeaturesList: React.FC<FeaturesListProps> = ({ features }) => {
  if (!features || features.length === 0) return null;

  return (
    <div className="mb-8 border-t border-slate-100 dark:border-slate-800 pt-8">
      <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">
        امکانات رفاهی
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {features.map((feature) => (
          <div
            key={feature}
            className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 border border-slate-100 dark:border-slate-700">
              {FEATURE_ICONS[feature] || <div className="w-2 h-2 bg-blue-600 rounded-full" />}
            </div>
            <span className="text-slate-700 dark:text-slate-300 text-xs font-bold">
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};