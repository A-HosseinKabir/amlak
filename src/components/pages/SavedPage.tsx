// src/components/pages/SavedPage.tsx
import React, { useState } from 'react';
import { useBookmarks } from '../../hooks/useBookmarks';
import { PropertyCard } from '../features/properties/PropertyCard';
import { Heart } from 'lucide-react';
import { Property } from '../../types/property.types';

export const SavedPage: React.FC = () => {
  const { bookmarkedProperties, toggleBookmark, isBookmarked } = useBookmarks();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  return (
    <div className="max-w-lg md:max-w-none mx-auto p-4 md:p-8 space-y-6 pt-6 md:pt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">نشان‌های من</h2>
        <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-100 dark:border-rose-900/50">
          <Heart className="w-5 h-5 fill-current" />
        </div>
      </div>

      {bookmarkedProperties.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 p-8">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
            <Heart className="w-8 h-8" />
          </div>
          <p className="text-slate-400 dark:text-slate-500 font-bold text-sm">
            هیچ نشانی یافت نشد
          </p>
          <p className="text-slate-300 dark:text-slate-600 text-xs mt-1">
            با باز کردن آگهی‌ها و نشان کردنشان، ملک‌های مورد نظر شما در این بخش نمایش داده می‌شوند.
          </p>
        </div>
      ) : (
        <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
          {bookmarkedProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isBookmarked={isBookmarked(property.id)}
              onBookmarkToggle={() => toggleBookmark(property)}
              onClick={() => setSelectedProperty(property)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPage;