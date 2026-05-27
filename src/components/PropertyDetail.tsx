import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Property, PropertyType } from '../types/property';
import {
  X, Bed, Bath, Square, MapPin, Play, View as View360, Share2, Heart,
  MessageCircle, ChevronLeft, ChevronRight, Calendar, Layers, LayoutGrid,
  ParkingCircle, Box, ArrowUpCircle, Flame, Waves, ShieldCheck, Phone,
  Clock, Plus, Send, Home, MessageSquare, CheckCircle2
} from 'lucide-react';
import PropertyMap from './PropertyMap';
import { cn } from '../lib/utils';
import CustomMap from './CustomMap';

interface PropertyDetailProps {
  property: Property;
  onClose: () => void;
  onChatClick: () => void;
  isDark?: boolean;
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

const AVAILABLE_DAYS = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه شنبه",
  "چهارشنبه",
  "پنج شنبه",
  "جمعه",
];

export default function PropertyDetail({ property, onClose, onChatClick, isDark = false }: PropertyDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTourOpen, setIsTourOpen] = useState(false);

  // States for Image Gallery Modal
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // State for Bookmarks
  const [isBookmarked, setIsBookmarked] = useState(() => {
    const list = localStorage.getItem('saved_property_ids');
    if (list) {
      try {
        const ids: string[] = JSON.parse(list);
        return ids.includes(property.id);
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  // State for Visit Request Modal
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [visitSlots, setVisitSlots] = useState<{ day: string; hour: string }[]>([
    { day: '', hour: '' }
  ]);

  // Track property viewing history automatically
  useEffect(() => {
    if (property) {
      const historyJSON = localStorage.getItem('viewed_properties_history');
      let history: string[] = [];
      try {
        history = historyJSON ? JSON.parse(historyJSON) : [];
      } catch (e) {
        history = [];
      }
      history = history.filter(id => id !== property.id);
      history.unshift(property.id);
      if (history.length > 50) history = history.slice(0, 50);
      localStorage.setItem('viewed_properties_history', JSON.stringify(history));
      // Dispatch event to sync any recently viewed listing components
      window.dispatchEvent(new Event('history-updated'));
    }
  }, [property]);

  const toggleBookmark = () => {
    const list = localStorage.getItem('saved_property_ids');
    let ids: string[] = [];
    if (list) {
      try {
        ids = JSON.parse(list);
      } catch (e) {
        ids = [];
      }
    }
    if (ids.includes(property.id)) {
      ids = ids.filter(id => id !== property.id);
      setIsBookmarked(false);
    } else {
      ids.push(property.id);
      setIsBookmarked(true);
    }
    localStorage.setItem('saved_property_ids', JSON.stringify(ids));
    // Synced notifications
    window.dispatchEvent(new Event('bookmarks-changed'));
  };

  const handleShareVirtualTour = async () => {
    if (!property.virtualTourUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `تور مجازی: ${property.title}`,
          text: `مشاهده تور مجازی ملک: ${property.title}`,
          url: property.virtualTourUrl,
        });
      } else {
        await navigator.clipboard.writeText(property.virtualTourUrl);
        alert('لینک تور مجازی در حافظه موقت کپی شد.');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const nextGalleryImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setGalleryIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevGalleryImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setGalleryIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleAddVisitSlot = () => {
    if (visitSlots.length < 3) {
      setVisitSlots([...visitSlots, { day: '', hour: '' }]);
    }
  };

  const handleRemoveVisitSlot = (idx: number) => {
    if (visitSlots.length > 1) {
      setVisitSlots(visitSlots.filter((_, i) => i !== idx));
    } else {
      setVisitSlots([{ day: '', hour: '' }]);
    }
  };

  const handleUpdateVisitSlot = (idx: number, field: 'day' | 'hour', val: string) => {
    const updated = [...visitSlots];
    updated[idx][field] = val;
    setVisitSlots(updated);
  };

  const handleRegisterVisitRequest = () => {
    const valid = visitSlots.filter(s => s.day !== '' && s.hour !== '');
    if (valid.length === 0) {
      alert('لطفاً حداقل یک زمان پیشنهادی معتبر انتخاب نمایید.');
      return;
    }

    const currentRequestsJSON = localStorage.getItem('visit_requests');
    let currentRequests: any[] = [];
    try {
      currentRequests = currentRequestsJSON ? JSON.parse(currentRequestsJSON) : [];
    } catch (e) {
      currentRequests = [];
    }

    const newRequest = {
      id: Math.random().toString(36).substr(2, 9),
      propertyId: property.id,
      propertyTitle: property.title,
      propertyLocation: property.location.address,
      propertyImage: property.images[0],
      price: property.price,
      slots: valid,
      status: 'در انتظار تایید',
      createdAt: new Date().toISOString()
    };

    currentRequests.unshift(newRequest);
    localStorage.setItem('visit_requests', JSON.stringify(currentRequests));

    alert('درخواست بازدید شما با موفقیت ثبت گردید. با مشاور هماهنگ‌کننده تماس حاصل خواهد شد.');
    setIsVisitModalOpen(false);
    setVisitSlots([{ day: '', hour: '' }]);
  };

  // تبدیل features به آرایه (در ابتدای کامپوننت)
  let featuresArray = [];

  if (Array.isArray(property.features)) {
    featuresArray = property.features;
  } else if (typeof property.features === 'string') {
    try {
      featuresArray = JSON.parse(property.features);
    } catch (e) {
      featuresArray = [];
    }
  }

  // آرایه پیش‌فرض برای زمانی که features خالی است
  const defaultFeatures = ['پارکینگ', 'انباری', 'آسانسور', 'لابی من', 'روف گاردن', 'استخر'];
  const finalFeatures = featuresArray.length > 0 ? featuresArray : defaultFeatures;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[60] bg-white dark:bg-slate-950 overflow-y-auto scrollbar-hide flex flex-col"
      dir="rtl"
    >
      {/* 📱 MOBILE VIEW: EXACTLY UNCHANGED */}
      <div className="md:hidden flex-1 relative pb-32">
        {/* Mobile Top Banner Slide */}
        <div className="relative aspect-[4/3] bg-slate-900 group">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={property.images[currentImageIndex]}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              alt={`${property.title} - ${currentImageIndex + 1}`}
              onClick={() => {
                setGalleryIndex(currentImageIndex);
                setIsGalleryModalOpen(true);
              }}
              className="w-full h-full object-cover cursor-zoom-in"
            />
          </AnimatePresence>

          {/* Global UI Overlays */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
            <button
              onClick={onClose}
              className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white ring-1 ring-white/30 hover:bg-black/40 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleShareVirtualTour}
                className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white ring-1 ring-white/30 hover:bg-black/40 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={toggleBookmark}
                className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white ring-1 ring-white/30 hover:bg-black/40 transition-colors"
              >
                <Heart className={cn("w-5 h-5", isBookmarked && "fill-current text-rose-500")} />
              </button>
            </div>
          </div>

          {/* Slider Controls */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 active:scale-90 transition-all z-10"
                aria-label="عکس قبلی"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 active:scale-90 transition-all z-10"
                aria-label="عکس بعدی"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Slide Index Counter Badge */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl text-xs font-bold leading-none select-none z-10 border border-white/10">
                {(currentImageIndex + 1).toLocaleString('fa-IR')} از {property.images.length.toLocaleString('fa-IR')}
              </div>

              {/* Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {property.images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                      }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Media types badges */}
          <div className="absolute bottom-6 right-6 flex gap-3 z-10">
            {property.videoUrl && (
              <button className="bg-rose-600/90 backdrop-blur-md text-white px-4 py-2.5 rounded-full flex items-center gap-2 text-xs font-bold shadow-lg ring-1 ring-white/20">
                <Play className="w-3.5 h-3.5 fill-current" />
                ویدیو ملک
              </button>
            )}
            {property.virtualTourUrl && (
              <button
                onClick={() => setIsTourOpen(true)}
                className="bg-blue-600/95 backdrop-blur-md text-white px-4 py-2.5 rounded-full flex items-center gap-2 text-xs font-black shadow-lg ring-1 ring-white/25 hover:bg-blue-700 active:scale-95 transition-all"
              >
                <View360 className="w-4 h-4" />
                تور مجازی سه‌بعدی
              </button>
            )}
          </div>
        </div>

        {/* Mobile Description & Info Details Container */}
        <div className="px-6 py-8 max-w-lg mx-auto">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {property.type}
            </span>
            <span className="text-slate-400 text-xs">منتشر شده در ۳ روز پیش</span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
            {property.title}
          </h1>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-6 font-semibold">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="text-sm">{property.location.address}</span>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <SpecCard icon={<Bed className="w-5 h-5" />} value={property.bedrooms} label="اتاق خواب" />
            <SpecCard icon={<Bath className="w-5 h-5" />} value={property.bathrooms} label="سرویس" />
            <SpecCard icon={<Square className="w-5 h-5" />} value={property.area} label="متر مربع" />
          </div>

          {/* New Specs Grid (Year Built, Floors, Units) */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <SpecCard icon={<Calendar className="w-5 h-5" />} value={property.yearBuilt || 1400} label="سال ساخت" />
            {property.type === PropertyType.APARTMENT && (
              <>
                <SpecCard icon={<Layers className="w-5 h-5" />} value={property.totalFloors || 5} label="تعداد طبقات" />
                <SpecCard icon={<LayoutGrid className="w-5 h-5" />} value={property.unitsPerFloor || 2} label="واحد در طبقه" />
              </>
            )}
          </div>

          {/* Description */}
          <div className="space-y-4 mb-10">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">توضیحات آگهی</h3>
            <p className="text-slate-650 dark:text-slate-400 leading-8 text-justify text-sm">
              {property.description}
            </p>
          </div>

          {/* Features List with Icons */}
          <div className="mb-10 border-t border-slate-100 dark:border-slate-800 pt-8 mt-5">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">امکانات رفاهی</h3>
            <div className="grid grid-cols-2 gap-4">
              {(finalFeatures as string[]).map((feat: string) => (
                <div key={feat} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                  <div className="w-10 h-10  rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 dark:border-slate-700">
                    {FEATURE_ICONS[feat] || <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 text-xs font-bold">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location Map Section */}
          <div className="mb-10 border-t border-slate-100 dark:border-slate-800 pt-8 mt-5">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">موقعیت روی نقشه</h3>
            <div className="h-64 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border-2 border-slate-100 dark:border-slate-800 group relative">

              <CustomMap
                properties={[property]}
                onMarkerClick={() => { }}
                center={property.location}
                zoom={14}
                isDark={isDark}
              />
            </div>
          </div>
        </div>

        {/* Mobile Sticky Bottom Action Bar with Scheduling Visit icon */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 p-4 pb-8">
          <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                {(property.price / 1000000000).toLocaleString('fa-IR')} <span className="text-[10px] font-normal text-slate-400">میلیارد تومان</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsVisitModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-550 text-white px-6 h-14 gap-1.5 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-indigo-600/25 active:scale-95 outline-none shrink-0"
                title="درخواست بازدید"
              >
                <Calendar className="w-5 h-5" />
                بازدید
              </button>
              <button
                onClick={onChatClick}
                className="bg-blue-600 text-white px-6  h-14 rounded-2xl   gap-1.5 flex items-center justify-center transition-all shadow-lg shadow-blue-500/20 active:scale-95 outline-none shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                چت
              </button>
              <button className="bg-slate-950 dark:bg-white text-white dark:text-slate-900 px-6 h-14 rounded-2xl font-black text-xs flex items-center gap-1.5 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-95 shadow-md whitespace-nowrap">
                <Phone className="w-4 h-4" />
                تماس
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🖥️ DESKTOP VIEW: MAGNIFICENT DUAL PANEL RE-DESIGN */}
      <div className="hidden md:block flex-1 bg-slate-50 dark:bg-slate-950 select-none pb-20">
        {/* Top bar with back button, bookmarking and sharing */}
        <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-blue-900/30 dark:hover:bg-slate-700 text-blue-700 dark:text-slate-350 font-black rounded-2xl flex items-center gap-2 transition-all cursor-pointer outline-none active:scale-97"
            >
              <X className="w-5 h-5 animate-pulse" />
              بستن و بازگشت به املاک
            </button>
            <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">جزئیات و مشخصات فنی آگهی</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={toggleBookmark}
              className={cn(
                "px-5 py-2.5 border rounded-2xl flex items-center gap-2 font-black text-xs transition-all cursor-pointer outline-none",
                isBookmarked
                  ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/30 dark:border-rose-900/40"
                  : "bg-white dark:bg-slate-900 border-slate-250 dark:border-slate-800 text-slate-500 dark:text-slate-450 hover:border-slate-350"
              )}
            >
              <Heart className={cn("w-4 h-4", isBookmarked && "fill-current text-rose-550")} />
              {isBookmarked ? "نشان شده" : "نشان کردن آگهی"}
            </button>
            <button
              onClick={handleShareVirtualTour}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-2xl text-slate-600 dark:text-slate-400 font-bold flex items-center gap-2 transition-all cursor-pointer outline-none"
            >
              <Share2 className="w-4 h-4" />
              اشتراک‌گذاری
            </button>
          </div>
        </div>

        {/* Desktop Container Wrapper */}
        <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">

          {/* Aesthetic Photo Mosaic Gallery view */}
          <div className="grid grid-cols-12 gap-4 h-[440px] rounded-[2.5rem] overflow-hidden">
            {/* Primary Large Image */}
            <div
              className="col-span-8 overflow-hidden relative group cursor-zoom-in bg-slate-900"
              onClick={() => {
                setGalleryIndex(0);
                setIsGalleryModalOpen(true);
              }}
            >
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-all flex items-center justify-center">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl px-5 py-2.5 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 border border-white/10 shadow-lg scale-95 group-hover:scale-100">
                  <LayoutGrid className="w-4 h-4 text-blue-450" />
                  کلیک کنید: گالری تعاملی اسلایدها ({property.images.length.toLocaleString('fa-IR')} عکس)
                </div>
              </div>
            </div>

            {/* Side Dual Smaller Images */}
            <div className="col-span-4 flex flex-col gap-4">
              {property.images[1] ? (
                <div
                  className="flex-1 overflow-hidden relative group cursor-zoom-in bg-slate-900"
                  onClick={() => {
                    setGalleryIndex(1);
                    setIsGalleryModalOpen(true);
                  }}
                >
                  <img src={property.images[1]} alt="Gallery 2" className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20" />
                </div>
              ) : (
                <div className="flex-1 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-300 dark:text-slate-800 border border-slate-100 dark:border-slate-800">
                  <Home className="w-10 h-10" />
                </div>
              )}

              {property.images[2] ? (
                <div
                  className="flex-1 overflow-hidden relative group cursor-zoom-in bg-slate-900"
                  onClick={() => {
                    setGalleryIndex(2);
                    setIsGalleryModalOpen(true);
                  }}
                >
                  <img src={property.images[2]} alt="Gallery 3" className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20" />
                </div>
              ) : (
                <div className="flex-1 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-300 dark:text-slate-800 border border-slate-100 dark:border-slate-800">
                  <Home className="w-10 h-10" />
                </div>
              )}
            </div>
          </div>

          {/* Dual Panel Main Split Column Grid Layout */}
          <div className="grid grid-cols-12 gap-8 items-start">

            {/* Right/Major panel (7-cols) */}
            <div className="col-span-8 space-y-8">

              {/* Card 1: Title, Address, publishing date */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3.5 py-1.5 rounded-full text-xs font-black">
                    {property.type}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 font-bold text-xs">تاریخ انتشار: ۳ روز پیش</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight mb-4">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-semibold">
                  <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                  <span className="text-sm">{property.location.address}</span>
                </div>
              </div>

              {/* Card 2: Essential Specs Grid */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xs">
                <h3 className="font-black text-lg text-slate-900 dark:text-white mb-6">مشخصات فنی و متراژ زیربنا</h3>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <SpecCard icon={<Bed className="w-6 h-6" />} value={property.bedrooms} label="اتاق خواب" />
                  <SpecCard icon={<Bath className="w-6 h-6" />} value={property.bathrooms} label="سرویس بهداشتی" />
                  <SpecCard icon={<Square className="w-6 h-6" />} value={property.area} label="متر مربع" />
                  <SpecCard icon={<Calendar className="w-6 h-6" />} value={property.yearBuilt || 1401} label="سال ساخت بنا" />
                  <SpecCard icon={<Layers className="w-5 h-5" />} value={property.totalFloors || 5} label="تعداد طبقات" />
                  <SpecCard icon={<LayoutGrid className="w-5 h-5" />} value={property.unitsPerFloor || 2} label="واحد در طبقه" />

                </div>
              </div>

              {/* Card 3: Description */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xs">
                <h3 className="font-black text-lg text-slate-900 dark:text-white mb-6">توضیحات آگهی</h3>
                <p className="text-slate-650 dark:text-slate-350 leading-9 text-justify text-sm">
                  {property.description}
                </p>
              </div>

              {/* Card 4: Amenities Grid */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xs">
                <h3 className="font-black text-lg text-slate-900 dark:text-white mb-6">امکانات رفاهی</h3>
                <div className="grid grid-cols-3 gap-4">
                     {(finalFeatures as string[]).map((feat: string) => (
                    <div key={feat} className="flex items-center gap-3.5 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-200/50 dark:hover:border-blue-900/30 transition-colors">
                      <div className="w-10 h-10  rounded-xl flex items-center justify-center text-blue-600 border border-slate-100 dark:border-slate-700">
                        {FEATURE_ICONS[feat] || <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                      </div>
                      <span className="text-slate-850 dark:text-slate-200 text-xs font-black">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 5: Large Location Map */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xs">
                <h3 className="font-black text-lg text-slate-900 dark:text-white mb-6">موقعیت روی نقشه</h3>
                <div className="h-96 md:h-[400px] bg-slate-100 rounded-[2rem] overflow-hidden border-2 border-slate-100 dark:border-slate-800 relative">
                  <CustomMap
                    properties={[property]}
                    onMarkerClick={() => { }}
                    center={property.location}
                    zoom={15}
                    isDark={isDark}
                  />
                </div>
              </div>
            </div>

            {/* Left/Minor panel (4-cols sidebar - sticky) */}
            <div className="col-span-4 sticky top-28 space-y-6">
              {/* Price & Primary Call To Action Board */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/30 dark:shadow-none space-y-6">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-bold text-[10px] tracking-widest uppercase block">کل بودجه اختصاص یافته (قیمت کارشناسی)</span>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1.5 leading-none tracking-tight">
                    {(property.price / 1000000000).toLocaleString('fa-IR')} <span className="text-xs font-normal text-slate-400">میلیارد تومان</span>
                  </p>
                </div>

                {property.virtualTourUrl && (
                  <button
                    onClick={() => setIsTourOpen(true)}
                    className="w-full py-4 rounded-2xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-black text-xs flex items-center justify-center gap-2 border border-blue-100 dark:border-blue-900/55 transition-all outline-none cursor-pointer"
                  >
                    <View360 className="w-5 h-5 animate-bounce" />
                    ورود به تور مجازی و نمای ۳۶۰ درجه
                  </button>
                )}

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex gap-2.5">
                    {/* Add scheduling button */}
                    <button
                      onClick={() => setIsVisitModalOpen(true)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-550 text-white py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/10 cursor-pointer outline-none"
                    >
                      <Calendar className="w-5 h-5" />
                      ثبت درخواست بازدید
                    </button>
                    {/* Chat button */}
                    <button
                      onClick={onChatClick}
                      className="px-4 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 text-slate-600 dark:text-slate-350 transition-all cursor-pointer outline-none"
                      title="آغاز گفتگو"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </div>

                  <button className="w-full py-4 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-900 font-black text-xs flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-md active:scale-98 cursor-pointer outline-none">
                    <Phone className="w-4 h-4" />
                    ارتباط و تماس تلفنی با مشاوران
                  </button>
                </div>
              </div>

              {/* Broker representation box */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-550/10 rounded-full flex items-center justify-center text-blue-600 border border-blue-50 dark:border-blue-800">
                  <Home className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">ساماندهی توسط هوم‌هاب</span>
                  <p className="font-black text-slate-900 dark:text-white text-sm mt-0.5">کارگزار انحصاری این آگهی</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🖼️ Full-screen Sliding Gallery Modal */}
      <AnimatePresence>
        {isGalleryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsGalleryModalOpen(false)}
            className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-md flex flex-col justify-between p-6 select-none"
            dir="rtl"
          >
            {/* Header: counter and close */}
            <div className="flex items-center justify-between text-white z-10">
              <span className="text-xs font-black bg-white/10 px-4 py-2 rounded-2xl border border-white/10 leading-none">
                {(galleryIndex + 1).toLocaleString('fa-IR')} از {property.images.length.toLocaleString('fa-IR')}
              </span>
              <button
                onClick={() => setIsGalleryModalOpen(false)}
                className="w-12 h-12 bg-white/10 hover:bg-white/20 active:scale-95 rounded-full flex items-center justify-center text-white transition-all outline-none cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Middle: sliding image */}
            <div className="relative flex-1 flex items-center justify-center max-w-5xl mx-auto w-full group/gallery">
              <img
                src={property.images[galleryIndex]}
                alt={`${property.title} gallery ${galleryIndex + 1}`}
                onClick={(e) => e.stopPropagation()}
                className="max-h-[75vh] max-w-full object-contain rounded-3xl"
              />

              {property.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevGalleryImage();
                    }}
                    className="absolute right-4 w-12 h-12 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextGalleryImage();
                    }}
                    className="absolute left-4 w-12 h-12 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom thumbnail rows */}
            <div className="flex justify-center gap-2 overflow-x-auto py-4 z-10 scrollbar-hide max-w-3xl mx-auto">
              {property.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setGalleryIndex(idx);
                  }}
                  className={cn(
                    "w-16 h-12 rounded-xl overflow-hidden cursor-pointer border-2 transition-all shrink-0",
                    idx === galleryIndex ? "border-blue-500 scale-110" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📅 Visit Request Day/Hour scheduler picker Modal */}
      <AnimatePresence>
        {isVisitModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 select-none"
            dir="rtl"
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 max-w-md w-full shadow-2xl space-y-6 relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-550/10 rounded-xl flex items-center justify-center text-indigo-500">
                    <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white leading-none">درخواست بازه زمانی بازدید</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1.5">ثبت تا حداکثر ۳ زمان پیشنهادی مراجعت حضوری</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsVisitModalOpen(false)}
                  className="w-10 h-10 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-full flex items-center justify-center text-slate-500 transition-colors cursor-pointer outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Slot Scheduler Grid */}
              <div className="space-y-4 max-h-[42vh] overflow-y-auto scrollbar-hide pr-1">
                {visitSlots.map((slot, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800/80 p-4 rounded-2xl relative space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-450 dark:text-slate-500">زمان پیشنهادی شماره {(idx + 1).toLocaleString('fa-IR')}</span>
                      {visitSlots.length > 1 && (
                        <button
                          onClick={() => handleRemoveVisitSlot(idx)}
                          className="text-rose-500 hover:text-rose-600 font-bold text-xs"
                        >
                          پاک کردن
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Select Day */}
                      <div>
                        <label className="block text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-1">انتخاب روز</label>
                        <select
                          value={slot.day}
                          onChange={(e) => handleUpdateVisitSlot(idx, 'day', e.target.value)}
                          className="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 px-3 py-2 rounded-xl text-xs font-black shadow-xs outline-none cursor-pointer"
                        >
                          <option value="">روز را انتخاب کنید</option>
                          {AVAILABLE_DAYS.map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                      </div>

                      {/* Select Hour text input */}
                      <div>
                        <label className="block text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-1">ساعت حضور</label>
                        <input
                          type="text"
                          value={slot.hour}
                          onChange={(e) => handleUpdateVisitSlot(idx, 'hour', e.target.value)}
                          placeholder="مثلاً ۱۶:۳۰ یا ۱۸ تا ۲۰"
                          className="w-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 px-3 py-2 rounded-xl text-[11px] font-black shadow-xs placeholder-slate-400 outline-none text-right"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {visitSlots.length < 3 && (
                  <button
                    onClick={handleAddVisitSlot}
                    className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-850 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-500 text-slate-400 dark:text-slate-500 transition-colors rounded-2xl text-[10px] font-black cursor-pointer"
                  >
                    + اضافه کردن بازه زمانی پیشنهادی جدید (امکان ثبت تا ۳ زمان)
                  </button>
                )}
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleRegisterVisitRequest}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-550 text-white py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all outline-none cursor-pointer shadow-lg shadow-indigo-600/10"
                >
                  <Send className="w-4 h-4" />
                  ثبت درخواست نهایی بازدید
                </button>
                <button
                  onClick={() => setIsVisitModalOpen(false)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-705 text-slate-650 dark:text-slate-350 py-3.5 rounded-2xl text-xs font-black transition-all outline-none cursor-pointer"
                >
                  انصراف و بستن
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen Virtual Tour Viewer Modal */}
      <AnimatePresence>
        {isTourOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-[110] bg-slate-950 flex flex-col"
            dir="rtl"
          >
            {/* Modal header details */}
            <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <View360 className="w-8 h-8 text-blue-400 animate-pulse" />
                <div>
                  <h4 className="font-black text-sm text-slate-100">{property.title}</h4>
                  <p className="text-xs text-slate-400">نمای داخلی تعاملی و ۳۶۰ درجه</p>
                </div>
              </div>
              <button
                onClick={() => setIsTourOpen(false)}
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 active:scale-90 rounded-full flex items-center justify-center text-slate-300 transition-all cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Helper Banner */}
            <div className="bg-blue-600/10 border-b border-blue-500/20 px-6 py-3.5 text-xs text-blue-300 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center select-none font-bold">
              <span>📱 <b>بدون نیاز به عینک VR:</b> روی گوشی یا تبلت خود به راحتی بچرخید</span>
              <span>🔘 <b>حرکت در خانه:</b> دکمه‌ها و فلش‌های درون به شما اجازه رفتن به اتاق‌های دیگر را می‌دهند</span>
            </div>

            {/* Virtual Tour Embed Iframe */}
            <div className="flex-1 bg-slate-900 relative">
              <iframe
                src={property.virtualTourUrl || 'https://kuula.co/share/collection/79WNW?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1'}
                className="w-full h-full border-0 absolute inset-0"
                allowFullScreen
                referrerPolicy="no-referrer"
                title={`تور مجازی - ${property.title}`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SpecCard({ icon, value, label, unit }: { icon: React.ReactNode; value: number; label: string; unit?: string }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-[1.5rem] flex flex-col items-center text-center transition-colors">
      <div className="text-blue-605 text-blue-500 mb-2">{icon}</div>
      <span className="font-black text-slate-900 dark:text-white text-base">
        {value.toLocaleString('fa-IR')} {unit && <span className="text-xs font-normal text-slate-400">{unit}</span>}
      </span>
      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter mt-1">{label}</span>
    </div>
  );
}
