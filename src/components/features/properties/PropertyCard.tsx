// src/components/features/properties/PropertyCard.tsx
import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Heart, Scale, View as View360, Video } from 'lucide-react';
import { Property } from '../../../types/property.types';
import { cn } from '../../../utils/cn';
import { formatPriceShort, formatNumber } from '../../../utils/formatters';
import { Button } from '../../common';

interface PropertyCardProps {
  property: Property;
  isComparing?: boolean;
  onCompareToggle?: () => void;
  onBookmarkToggle?: () => void;
  isBookmarked?: boolean;
  onClick: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isComparing = false,
  onCompareToggle,
  onBookmarkToggle,
  isBookmarked = false,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 group relative cursor-pointer"
      onClick={onClick}
    >
      {/* تصویر */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* دکمه‌های روی تصویر */}
        <div className="absolute top-4 right-4 flex gap-2">
          {onBookmarkToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmarkToggle();
              }}
              className="p-2 rounded-full shadow-lg transition-colors bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm"
            >
              <Heart
                className={cn(
                  'w-4 h-4 transition-colors',
                  isBookmarked ? 'fill-rose-500 text-rose-500' : 'text-slate-400 dark:text-slate-500'
                )}
              />
            </button>
          )}
          {onCompareToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompareToggle();
              }}
              className={cn(
                'p-2 rounded-full shadow-lg transition-colors backdrop-blur-sm',
                isComparing
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/90 dark:bg-slate-900/90 text-slate-400 dark:text-slate-500'
              )}
            >
              <Scale className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* نشان‌های ویدیو و تور مجازی */}
        <div className="absolute top-4 left-4 flex gap-2">
          {property.virtualTourUrl && (
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
              <View360 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          )}
          {property.videoUrl && (
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
              <Video className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            </div>
          )}
        </div>

        {/* برچسب نوع ملک */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold ring-1 ring-white/20">
            {property.type}
          </div>
        </div>
      </div>

      {/* محتوای کارت */}
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm md:text-base line-clamp-1 flex-1">
            {property.title}
          </h3>
          <span className="text-blue-600 dark:text-blue-400 font-black tracking-tight text-sm md:text-base whitespace-nowrap">
            {formatPriceShort(property.price)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs md:text-sm mb-4 md:mb-6">
          <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="truncate">{property.location.address}</span>
        </div>

        <div className="grid grid-cols-3 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 py-3 rounded-3xl border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col items-center justify-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-1 uppercase tracking-widest">
              اتاق
            </span>
            <span className="font-black text-xs md:text-sm">{formatNumber(property.bedrooms)}</span>
          </div>
          <div className="flex flex-col items-center justify-center border-r border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-1 uppercase tracking-widest">
              سرویس
            </span>
            <span className="font-black text-xs md:text-sm">{formatNumber(property.bathrooms)}</span>
          </div>
          <div className="flex flex-col items-center justify-center border-r border-slate-200 dark:border-slate-700 px-1">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-1 uppercase tracking-widest">
              متراژ
            </span>
            <span className="font-black text-xs md:text-sm whitespace-nowrap">
              {formatNumber(property.area)} <span className="text-[9px] font-normal">متر</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};