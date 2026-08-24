// src/components/features/properties/PropertyDetail/SpecsGrid.tsx
import React from 'react';
import { Bed, Bath, Square, Calendar, Layers, LayoutGrid } from 'lucide-react';
import { Property } from '../../../../types/property.types';
import { formatNumber } from '../../../../utils/formatters';
import { cn } from '../../../../utils/cn';

interface SpecsGridProps {
  property: Property;
}

export const SpecsGrid: React.FC<SpecsGridProps> = ({ property }) => {
  const specs = [
    { icon: <Bed className="w-5 h-5" />, value: property.bedrooms, label: 'اتاق خواب' },
    { icon: <Bath className="w-5 h-5" />, value: property.bathrooms, label: 'سرویس' },
    { icon: <Square className="w-5 h-5" />, value: property.area, label: 'متر مربع' },
    { icon: <Calendar className="w-5 h-5" />, value: property.yearBuilt || 1400, label: 'سال ساخت' },
    { icon: <Layers className="w-5 h-5" />, value: property.totalFloors || 5, label: 'تعداد طبقات' },
    { icon: <LayoutGrid className="w-5 h-5" />, value: property.unitsPerFloor || 2, label: 'واحد در طبقه' },
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
      {specs.map((spec, index) => (
        <div
          key={index}
          className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-[1.5rem] flex flex-col items-center text-center"
        >
          <div className="text-blue-500 mb-2">{spec.icon}</div>
          <span className="font-black text-slate-900 dark:text-white text-base">
            {formatNumber(spec.value)}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter mt-1">
            {spec.label}
          </span>
        </div>
      ))}
    </div>
  );
};