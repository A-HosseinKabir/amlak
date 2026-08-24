// src/components/pages/DiscoverPage.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, Scale, Search } from 'lucide-react';
import { useProperties } from '../../hooks/useProperties';
import { useBookmarks } from '../../hooks/useBookmarks';
import { useAuth } from '../../hooks/useAuth';
import { PropertyCard } from '../features/properties/PropertyCard';
import { FilterDrawer } from '../features/properties/FilterDrawer';
import { ComparisonDrawer } from '../features/properties/ComparisonDrawer';
import { Button, LoadingSpinner } from '../common';
import { cn } from '../../utils/cn';
import { FilterState } from '../../types/filter.types';
import { DEFAULT_FILTERS } from '../../utils/constants';

export const DiscoverPage: React.FC = () => {
  const { user } = useAuth();
  const {
    properties,
    loading,
    error,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    resetFilters,
  } = useProperties();

  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);

  const toggleCompare = (propertyId: string) => {
    setCompareList((prev) => {
      if (prev.includes(propertyId)) {
        return prev.filter((id) => id !== propertyId);
      }
      if (prev.length >= 4) return prev;
      return [...prev, propertyId];
    });
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="در حال بارگذاری آگهی‌ها..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-6">
          <Search className="w-8 h-8 text-rose-500" />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">خطا در بارگذاری</h3>
        <p className="text-slate-500 dark:text-slate-400">{error}</p>
        <Button variant="primary" className="mt-6" onClick={() => window.location.reload()}>
          تلاش مجدد
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg md:max-w-none mx-auto p-4 md:p-8 space-y-6 md:space-y-8">
      {/* دکمه‌های فیلتر و مقایسه */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<SlidersHorizontal className="w-4 h-4" />}
            onClick={() => setIsFilterOpen(true)}
          >
            فیلتر
          </Button>
          {compareList.length > 0 && (
            <Button
              variant="primary"
              size="sm"
              icon={<Scale className="w-4 h-4" />}
              onClick={() => setIsComparisonOpen(true)}
            >
              مقایسه ({compareList.length})
            </Button>
          )}
        </div>
        <div className="flex gap-2 text-xs font-bold text-slate-400">
          <button
            onClick={() => setSortBy('date')}
            className={cn(
              'transition-colors',
              sortBy === 'date' ? 'text-blue-600 dark:text-blue-400' : 'hover:text-slate-600'
            )}
          >
            جدیدترین
          </button>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <button
            onClick={() => setSortBy('price')}
            className={cn(
              'transition-colors',
              sortBy === 'price' ? 'text-blue-600 dark:text-blue-400' : 'hover:text-slate-600'
            )}
          >
            ارزان‌ترین
          </button>
        </div>
      </div>

      {/* دسته‌بندی‌ها */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['همه', 'آپارتمان', 'ویلایی', 'اداری', 'تجاری'].map((type) => (
          <button
            key={type}
            onClick={() => setFilters({ ...filters, type: type as any })}
            className={cn(
              'px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-all',
              filters.type === type
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            )}
          >
            {type}
          </button>
        ))}
      </div>

      {/* لیست آگهی‌ها */}
      {properties.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 p-8">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
            <Search className="w-8 h-8" />
          </div>
          <p className="text-slate-400 dark:text-slate-500 font-bold">ملکی با این مشخصات یافت نشد</p>
          <Button variant="primary" className="mt-4" onClick={resetFilters}>
            پاک کردن فیلترها
          </Button>
        </div>
      ) : (
        <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isComparing={compareList.includes(property.id)}
              onCompareToggle={() => toggleCompare(property.id)}
              onBookmarkToggle={() => toggleBookmark(property)}
              isBookmarked={isBookmarked(property.id)}
              onClick={() => {
                // Navigate to detail or open modal - handled by parent
              }}
            />
          ))}
        </div>
      )}

      {/* فیلتر Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        initialFilters={filters}
      />

      {/* مقایسه Drawer */}
      <ComparisonDrawer
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        propertyIds={compareList}
        onRemove={toggleCompare}
      />
    </div>
  );
};

export default DiscoverPage;