// src/components/features/properties/PropertyDetail/PropertyDetail.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBookmarks } from '../../../../hooks/useBookmarks';
import { useAuth } from '../../../../hooks/useAuth';
import { useHistory } from '../../../../hooks/useHistory';
import { useVisits } from '../../../../hooks/useVisits';
import { useProperties } from '../../../../hooks/useProperties';
import { Property } from '../../../../types/property.types';
import { formatPriceShort, formatRelativeTime } from '../../../../utils/formatters';
import { ImageGallery } from './ImageGallery';
import { SpecsGrid } from './SpecsGrid';
import { FeaturesList } from './FeaturesList';
import { VisitScheduler } from './VisitScheduler';
import { ActionButtons } from './ActionButtons';
import { Button, Modal, LoadingSpinner } from '../../../common';
import { X, MapPin } from 'lucide-react';
import { cn } from '../../../../utils/cn';

interface PropertyDetailProps {
  property: Property;
  onClose: () => void;
  onChatClick: () => void;
}

export const PropertyDetail: React.FC<PropertyDetailProps> = ({
  property,
  onClose,
  onChatClick,
}) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { user } = useAuth();
  const { addToHistory } = useHistory();
  const { createRequest } = useVisits();
  const { properties } = useProperties();

  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // ثبت تاریخچه بازدید
  useEffect(() => {
    addToHistory(property.id);
  }, [property.id, addToHistory]);

  const handleBookmark = () => toggleBookmark(property);
  const isBookmarkedCurrent = isBookmarked(property.id);

  const handleVisitSubmit = async (slots: { day: string; hour: string }[]) => {
    try {
      await createRequest({ propertyId: property.id, slots });
      setIsVisitModalOpen(false);
    } catch (error) {
      // خطا قبلاً در هوک مدیریت شده
    }
  };

  const handleImageClick = (index: number) => {
    setGalleryIndex(index);
    setIsGalleryOpen(true);
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[60] bg-white dark:bg-slate-950 overflow-y-auto scrollbar-hide"
      dir="rtl"
    >
      {/* گالری تصاویر */}
      <ImageGallery
        images={property.images}
        virtualTourUrl={property.virtualTourUrl}
        videoUrl={property.videoUrl}
        onImageClick={handleImageClick}
        onTourOpen={() => setIsTourOpen(true)}
        onBookmark={handleBookmark}
        isBookmarked={isBookmarkedCurrent}
        onClose={onClose}
      />

      {/* محتوای اصلی */}
      <div className="px-6 py-8 max-w-4xl mx-auto">
        {/* هدر اطلاعات */}
        <div className="flex justify-between items-start mb-4">
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
            {property.type}
          </span>
          <span className="text-slate-400 dark:text-slate-500 text-xs font-bold">
            {formatRelativeTime(property.createdAt)}
          </span>
        </div>

        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
          {property.title}
        </h1>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-6 font-semibold">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span className="text-sm">{property.location.address}</span>
        </div>

        {/* مشخصات فنی */}
        <SpecsGrid property={property} />

        {/* امکانات */}
        <FeaturesList features={property.features || []} />

        {/* توضیحات */}
        <div className="mt-8 mb-10 border-t border-slate-100 dark:border-slate-800 pt-8">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">
            توضیحات آگهی
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-8 text-justify text-sm">
            {property.description}
          </p>
        </div>

        {/* دکمه‌های اقدام */}
        <ActionButtons
          price={property.price}
          onChat={onChatClick}
          onVisit={() => setIsVisitModalOpen(true)}
          isLoggedIn={!!user}
        />
      </div>

      {/* مودال گالری کامل */}
      <Modal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        size="xl"
        showCloseButton
        className="bg-black/95"
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <img
            src={property.images[galleryIndex]}
            alt={`${property.title} - ${galleryIndex + 1}`}
            className="max-h-[70vh] max-w-full object-contain rounded-2xl"
          />
          <div className="flex gap-2 mt-4 overflow-x-auto py-2 max-w-full">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setGalleryIndex(idx)}
                className={cn(
                  'w-16 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0',
                  idx === galleryIndex
                    ? 'border-blue-500 scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100'
                )}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </Modal>

      {/* مودال تور مجازی */}
      <Modal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        size="full"
        showCloseButton={false}
        className="bg-slate-950 p-0"
      >
        <div className="h-[90vh] w-full relative">
          <button
            onClick={() => setIsTourOpen(false)}
            className="absolute top-4 left-4 z-10 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white"
          >
            <X className="w-6 h-6" />
          </button>
          {property.virtualTourUrl && (
            <iframe
              src={property.virtualTourUrl}
              className="w-full h-full border-0"
              allowFullScreen
              title={`تور مجازی - ${property.title}`}
            />
          )}
        </div>
      </Modal>

      {/* مودال زمان‌بندی بازدید */}
      <VisitScheduler
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        onSubmit={handleVisitSubmit}
      />
    </motion.div>
  );
};

export default PropertyDetail;