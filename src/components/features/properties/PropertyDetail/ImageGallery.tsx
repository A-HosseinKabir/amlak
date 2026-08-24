// src/components/features/properties/PropertyDetail/ImageGallery.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Share2, X, ChevronRight, ChevronLeft, Play, View as View360 } from 'lucide-react';
import { cn } from '../../../../utils/cn';

interface ImageGalleryProps {
  images: string[];
  virtualTourUrl?: string;
  videoUrl?: string;
  onImageClick: (index: number) => void;
  onTourOpen: () => void;
  onBookmark: () => void;
  isBookmarked: boolean;
  onClose: () => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  virtualTourUrl,
  videoUrl,
  onImageClick,
  onTourOpen,
  onBookmark,
  isBookmarked,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative aspect-[4/3] bg-slate-900 group">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
          onClick={() => onImageClick(currentIndex)}
          className="w-full h-full object-cover cursor-zoom-in"
          alt={`تصویر ${currentIndex + 1}`}
        />
      </AnimatePresence>

      {/* دکمه‌های بالایی */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
        <button
          onClick={onClose}
          className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white ring-1 ring-white/30 hover:bg-black/40 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex gap-2">
          <button
            onClick={onBookmark}
            className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white ring-1 ring-white/30 hover:bg-black/40 transition-colors"
          >
            <Heart className={cn('w-5 h-5', isBookmarked && 'fill-current text-rose-500')} />
          </button>
          <button
            onClick={() => navigator.share?.({ title: 'اشتراک‌گذاری', url: window.location.href })}
            className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white ring-1 ring-white/30 hover:bg-black/40 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* کنترل‌های اسلایدر */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-all z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-all z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl text-xs font-bold z-10 border border-white/10">
            {currentIndex + 1} از {images.length}
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                )}
              />
            ))}
          </div>
        </>
      )}

      {/* دکمه‌های تور مجازی و ویدیو */}
      <div className="absolute bottom-6 right-6 flex gap-3 z-10">
        {videoUrl && (
          <button className="bg-rose-600/90 backdrop-blur-md text-white px-4 py-2.5 rounded-full flex items-center gap-2 text-xs font-bold shadow-lg ring-1 ring-white/20">
            <Play className="w-3.5 h-3.5 fill-current" />
            ویدیو
          </button>
        )}
        {virtualTourUrl && (
          <button
            onClick={onTourOpen}
            className="bg-blue-600/95 backdrop-blur-md text-white px-4 py-2.5 rounded-full flex items-center gap-2 text-xs font-black shadow-lg ring-1 ring-white/25 hover:bg-blue-700 transition-all"
          >
            <View360 className="w-4 h-4" />
            تور مجازی
          </button>
        )}
      </div>
    </div>
  );
};