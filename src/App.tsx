import React, { useState, useEffect } from 'react';
import { Search, Map as MapIcon, Home, Heart, User as UserIcon, Play, View as View360, ChevronRight, MapPin, LogOut, Plus, SlidersHorizontal, Scale, MessageSquare, Moon, Sun, Sliders, Eye, Calendar, Info, Settings, Video, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Property, PropertyType } from './types/property';
import { cn } from './lib/utils';
import PropertyMap from './components/PropertyMap';
import CustomMap from './components/CustomMap';
import PropertyDetail from './components/PropertyDetail';
import FilterDrawer from './components/FilterDrawer';
import ComparisonDrawer from './components/ComparisonDrawer';
import ChatWindow from './components/ChatWindow';
import ChatRoomsList from './components/ChatRoomsList';
import AuthForm from './components/AuthForm';
import { api, User as ApiUser } from './services/backendService';
import { propertyService } from './services/propertyService';

import ViewedHistory from './components/ViewedHistory';
import VisitRequestsList from './components/VisitRequestsList';
import AboutUs from './components/AboutUs';
import SettingsView from './components/SettingsView';

import { MOCK_PROPERTIES } from './constants';
import IconGallery from './components/Icon';

interface FilterState {
  minPrice: number;
  maxPrice: number;
  minArea: number;
  maxArea: number;
  bedrooms: number | null;
  bathrooms: number | null;
  type: PropertyType | 'همه';
  features: string[];
}

const DEFAULT_FILTERS: FilterState = {
  minPrice: 0,
  maxPrice: 500,
  minArea: 0,
  maxArea: 2000,
  bedrooms: null,
  bathrooms: null,
  type: 'همه',
  features: []
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'discover' | 'map' | 'chats' | 'saved' | 'profile'>('discover');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<{ id: string; property: Property } | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : true;
  });

  const [profileSubView, setProfileSubView] = useState<'menu' | 'history' | 'requests' | 'about' | 'settings'>('menu');
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);

  const loadSavedProperties = () => {
    const listJSON = localStorage.getItem('saved_property_ids');
    if (listJSON) {
      try {
        const ids: string[] = JSON.parse(listJSON);
        const saved = MOCK_PROPERTIES.filter(p => ids.includes(p.id));
        setSavedProperties(saved);
      } catch (e) {
        setSavedProperties([]);
      }
    } else {
      setSavedProperties([]);
    }
  };

  useEffect(() => {
    loadSavedProperties();
    const handleBookmarkSync = () => loadSavedProperties();
    window.addEventListener('bookmarks-changed', handleBookmarkSync);
    return () => window.removeEventListener('bookmarks-changed', handleBookmarkSync);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date');

  const [properties, setProperties] = useState<Property[]>([]);
  const [compareList, setCompareList] = useState<Property[]>([]);
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);

  // Simulation of auth state check for UI development
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuthSuccess = (newUser: ApiUser) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setShowAuthForm(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  };

  // Filtered and Sorted properties
  const filteredProperties = properties.filter(p => {
    if (filters.type !== 'همه' && p.type !== filters.type) return false;
    const priceBn = p.price / 1000000000;
    if (priceBn < filters.minPrice || priceBn > filters.maxPrice) return false;
    if (p.area < filters.minArea || p.area > filters.maxArea) return false;
    if (filters.bedrooms && p.bedrooms < filters.bedrooms) return false;
    if (filters.features.length > 0) {
      const pFeatures = p.features || [];
      if (!filters.features.every(f => pFeatures.includes(f))) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    // Sorting by date
    return b.createdAt - a.createdAt;
  });

  const toggleCompare = (p: Property) => {
    setCompareList(prev => {
      if (prev.find(item => item.id === p.id)) {
        return prev.filter(item => item.id !== p.id);
      }
      if (prev.length >= 4) return prev;
      return [...prev, p];
    });
  };

  const handleStartChat = async (property: Property) => {
    if (!user) {
      setShowAuthForm(true);
      return;
    }
    // اگر صاحب ملک باشد اجازه چت ندارد
    if (property.ownerId === user.id) return;

    // باز کردن پنجره چت (در نسخه نهایی از لیست اتاق‌های API استفاده می‌شود)
    setActiveChat({ id: `chat-${property.id}`, property });
    setActiveTab('chats');
  };

  useEffect(() => {
    const unsubscribeProperties = propertyService.subscribeToProperties((data) => {
      setProperties(data.length > 0 ? data : MOCK_PROPERTIES);
    });
    return () => unsubscribeProperties();
  }, []);

  return (
    <div className={cn("flex flex-col h-screen font-sans transition-colors duration-300 overflow-hidden", darkMode ? "dark bg-slate-950" : "bg-slate-50")} dir="rtl">
      {/* Header */}
      <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-3 sticky top-0 z-50 transition-colors md:pr-64">
        <div className="flex items-center justify-between max-w-lg mx-auto w-full md:max-w-none md:px-8 xl:px-12">
          <h1 className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight md:hidden">HomeHub</h1>
          <div className="hidden md:block">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">سامانه هوشمند املاک تبریز</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1">مشاهده و جستجوی لوکس‌ترین ملک‌های کلان‌شهر تبریز</p>
          </div>
          <div className="flex gap-2 mr-auto md:mr-0">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="bg-slate-100 dark:bg-slate-800/50 p-2.5 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-900"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn(
        "flex-1 relative scrollbar-hide bg-slate-50 dark:bg-slate-950 transition-colors duration-300 md:pr-64",
        activeTab !== 'map' ? "overflow-y-auto pb-24 md:pb-8" : "overflow-hidden"
      )}>
        <div className="h-full w-full">
          {activeTab === 'discover' && (
            <AnimatePresence mode="wait">
              <motion.div
                key="discover"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-lg md:max-w-none mx-auto p-4 md:p-8 space-y-6 md:space-y-8"
              >
                {/* Search / Filter Bar */}
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide md:mx-0 md:px-0">
                  {['همه', 'آپارتمان', 'ویلایی', 'اداری', 'تجاری'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilters({ ...filters, type: cat as any })}
                      className={cn(
                        "px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-all",
                        filters.type === cat
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Sort Bar */}
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-tight">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setSortBy('date')}
                      className={cn(sortBy === 'date' ? 'text-blue-600 dark:text-blue-400 font-black' : 'text-slate-400 dark:text-slate-600')}
                    >جدیدترین</button>
                    <button
                      onClick={() => setSortBy('price')}
                      className={cn(sortBy === 'price' ? 'text-blue-600 dark:text-blue-400 font-black' : 'text-slate-400 dark:text-slate-600')}
                    >ارزان‌ترین</button>
                  </div>
                  {compareList.length > 0 && (
                    <button
                      onClick={() => setIsComparisonOpen(true)}
                      className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full flex items-center gap-2 animate-pulse border border-blue-100 dark:border-blue-900"
                    >
                      <Scale className="w-3 h-3" />
                      مقایسه ({compareList.length.toLocaleString('fa-IR')})
                    </button>
                  )}
                </div>

                {/* Featured Section */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">پیشنهادات طلایی</h2>
                    <button className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline transition-all">مشاهده همه</button>
                  </div>
                  <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
                    {filteredProperties.length > 0 ? (
                      filteredProperties.map((property) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          isComparing={!!compareList.find(c => c.id === property.id)}
                          onCompareToggle={() => toggleCompare(property)}
                          onClick={() => setSelectedProperty(property)}
                          isDark={darkMode}
                        />
                      ))
                    ) : (
                      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 p-8">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
                          <Search className="w-8 h-8" />
                        </div>
                        <p className="text-slate-400 dark:text-slate-500 font-bold">ملکی با این مشخصات یافت نشد</p>
                        <button
                          onClick={() => setFilters(DEFAULT_FILTERS)}
                          className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-bold"
                        >پاک کردن فیلترها</button>
                      </div>
                    )}
                  </div>
                </section>
              </motion.div>
            </AnimatePresence>
          )}

          {activeTab === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-0 overflow-hidden"
            >

              <CustomMap
                properties={properties}
                onMarkerClick={(p) => setSelectedProperty(p)}
                showBoundsList={true}
                isDark={darkMode}
              />


            </motion.div>
          )}

          {activeTab === 'chats' && (
            <div className="h-full w-full max-w-7xl mx-auto flex flex-col md:flex-row md:divide-x md:divide-x-reverse md:divide-slate-200 dark:md:divide-slate-800">
              {/* Right panel: Rooms List (on mobile full, on desktop fixed sidebar width) */}
              <div className="w-full md:w-80 lg:w-96 flex flex-col h-full bg-slate-50 dark:bg-slate-950 md:border-l md:border-slate-100 dark:md:border-slate-800 overflow-hidden shrink-0">
                <div className="p-4 md:p-6 pb-2 shrink-0">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">گفتگوهای من</h2>
                  <p className="hidden md:block text-xs font-bold text-slate-400 mt-1">مشاهده پیام‌ها و هماهنگی جهت بازدید املاک</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 scrollbar-hide pb-28 md:pb-6">
                  {user ? (
                    <ChatRoomsList
                      onSelectRoom={(id, p) => setActiveChat({ id, property: p })}
                      activeRoomId={activeChat?.id}
                    />
                  ) : (
                    <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 font-bold mb-6 text-sm">برای مشاهده گفتگوها باید وارد حساب کاربری خود شوید</p>
                      <button
                        onClick={() => setActiveTab('profile')}
                        className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 dark:shadow-none text-sm w-full cursor-pointer"
                      >
                        ورود به حساب
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Left panel: Active chat feed (on mobile hidden, on desktop flex-1) */}
              <div className="hidden md:flex flex-1 flex-col h-full bg-slate-100/30 dark:bg-slate-900/10 p-6 overflow-hidden">
                {activeChat ? (
                  <ChatWindow
                    roomId={activeChat.id}
                    property={activeChat.property}
                    onClose={() => setActiveChat(null)}
                    isInline={true}
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2.5rem] text-center shadow-sm">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                      <MessageSquare className="w-10 h-10" />
                    </div>
                    <h3 className="font-black text-lg text-slate-950 dark:text-white mb-2">به پیام‌رسان هوم‌هاب خوش آمدید</h3>
                    <p className="text-sm text-slate-400 dark:text-slate-500 max-w-sm leading-relaxed">جهت شروع مکالمه و هماهنگی با مشاورین یا مالکین، یکی از گفتگوها را از پنل سمت راست انتخاب نمایید.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="max-w-lg md:max-w-none mx-auto p-4 md:p-8 space-y-6 pt-6 md:pt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">نشان‌های من</h2>
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-100 dark:border-rose-900/50">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
              </div>
              <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
                {savedProperties.length > 0 ? (
                  savedProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      isComparing={!!compareList.find(c => c.id === property.id)}
                      onCompareToggle={() => toggleCompare(property)}
                      onClick={() => setSelectedProperty(property)}
                      isDark={darkMode}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 p-8">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
                      <Heart className="w-8 h-8" />
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 font-bold text-sm">هیچ نشانی یافت نشد</p>
                    <p className="text-slate-300 dark:text-slate-600 text-xs mt-1">با باز کردن آگهی‌ها و نشان کردنشان، ملک‌های مورد نظر شما در این بخش نمایش داده می‌شوند.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-lg md:max-w-2xl mx-auto p-4 md:p-8 space-y-6 pt-10 md:pt-14">
              {profileSubView !== 'menu' && (
                <button
                  onClick={() => setProfileSubView('menu')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black transition-all cursor-pointer underline-none decoration-transparent outline-none mb-4"
                >
                  <ChevronRight className="w-4 h-4" />
                  برگشت به منوی حساب من
                </button>
              )}

              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800">
                {profileSubView === 'menu' && (
                  <>
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-800 shadow-lg shadow-blue-100 dark:shadow-none">
                        {user?.avatar ? (
                          <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-black text-xl text-slate-900 dark:text-white">{user ? user.displayName : 'کاربر مهمان'}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{user ? user.phoneNumber : 'برای دسترسی به امکانات وارد شوید'}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <ProfileItem
                        icon={<Eye className="w-5 h-5 text-indigo-500" />}
                        label="تاریخچه آگهی‌های مشاهده شده"
                        onClick={() => setProfileSubView('history')}
                      />
                      <ProfileItem
                        icon={<Calendar className="w-5 h-5 text-emerald-500" />}
                        label="درخواست‌های بازدید"
                        onClick={() => setProfileSubView('requests')}
                      />
                      <ProfileItem
                        icon={<Info className="w-5 h-5 text-amber-500" />}
                        label="درباره ما"
                        onClick={() => setProfileSubView('about')}
                      />
                      <ProfileItem
                        icon={<Settings className="w-5 h-5 text-blue-500" />}
                        label="تنظیمات"
                        onClick={() => setProfileSubView('settings')}
                      />

                      {user ? (
                        <button
                          onClick={handleLogout}
                          className="w-full mt-10 py-4 rounded-3xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-450 font-bold hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors flex items-center justify-center gap-2 cursor-pointer outline-none"
                        >
                          <LogOut className="w-5 h-5" />
                          خروج از حساب
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowAuthForm(true)}
                          className="w-full mt-10 py-5 rounded-3xl bg-blue-600 text-white font-black hover:bg-blue-500 transition-all shadow-xl shadow-blue-100 dark:shadow-none flex items-center justify-center gap-3 active:scale-95 cursor-pointer outline-none"
                        >
                          <UserIcon className="w-6 h-6" />
                          ورود به حساب کاربری
                        </button>
                      )}
                    </div>
                  </>
                )}

                {profileSubView === 'history' && (
                  <ViewedHistory onPropertyClick={(p) => setSelectedProperty(p)} />
                )}

                {profileSubView === 'requests' && (
                  <VisitRequestsList />
                )}

                {profileSubView === 'about' && (
                  <AboutUs />
                )}

                {profileSubView === 'settings' && (
                  <SettingsView darkMode={darkMode} setDarkMode={setDarkMode} />
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedProperty && (
          <PropertyDetail
            property={selectedProperty}
            onChatClick={() => handleStartChat(selectedProperty)}
            onClose={() => setSelectedProperty(null)}
            isDark={darkMode}
          />
        )}
      </AnimatePresence>

      {/* Filter Overlay */}
      <AnimatePresence>
        {isFilterOpen && (
          <FilterDrawer
            initialFilters={filters}
            onClose={() => setIsFilterOpen(false)}
            onApply={(f) => {
              setFilters(f);
              setIsFilterOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Comparison Overlay */}
      <AnimatePresence>
        {isComparisonOpen && (
          <ComparisonDrawer
            properties={compareList}
            onRemove={(id) => setCompareList(prev => prev.filter(p => p.id !== id))}
            onClose={() => setIsComparisonOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {activeChat && (
          <div className="md:hidden">
            <ChatWindow
              roomId={activeChat.id}
              property={activeChat.property}
              onClose={() => setActiveChat(null)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Auth Modal Overlay */}
      <AnimatePresence>
        {showAuthForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <AuthForm
              onSuccess={handleAuthSuccess}
              onClose={() => setShowAuthForm(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Layout Navigation & Desktop Sidebar Nav */}
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex  transition-all duration-500",
        "max-md:justify-around", 
        "bg-white dark:bg-slate-950 backdrop-blur-2xl rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] dark:shadow-none px-4 py-3 pb-8 md:pb-6",
        activeTab === 'map' ? "border-transparent" : "border-t border-slate-100 dark:border-slate-800",
        // Desktop modifications:
        "md:justify-start items-center md:top-0 md:bottom-0 md:right-0 md:left-auto md:h-screen md:w-64 md:flex-col md:justify-start md:items-stretch md:gap-3 md:pt-8 md:px-5 md:pb-6 md:rounded-t-none md:rounded-l-[2.5rem] md:shadow-[-15px_0_40px_rgba(0,0,0,0.03)] md:border-l md:border-t-0"
      )}>
        {/* Logo Branding - Desktop view only */}
        <div className="hidden md:flex items-center gap-3 px-4 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <Home className="w-5 h-5" />
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight">HomeHub</span>
        </div>

        <NavButton
          active={activeTab === 'discover'}
          onClick={() => setActiveTab('discover')}
          icon={<Home className="w-6 h-6" />}
          label="آگهی‌ها"
          isDark={darkMode}
        />
        <NavButton
          active={activeTab === 'map'}
          onClick={() => setActiveTab('map')}
          icon={<MapIcon className="w-6 h-6" />}
          label="نقشه"
          isDark={darkMode}
        />
        <NavButton
          active={activeTab === 'chats'}
          onClick={() => setActiveTab('chats')}
          icon={<MessageSquare className="w-6 h-6" />}
          label="گفتگوها"
          isDark={darkMode}
        />
        <NavButton
          active={activeTab === 'saved'}
          onClick={() => setActiveTab('saved')}
          icon={<Heart className="w-6 h-6" />}
          label="نشان‌ها"
          isDark={darkMode}
        />
        <NavButton
          active={activeTab === 'profile'}
          onClick={() => {
            setActiveTab('profile');
            setProfileSubView('menu');
          }}
          icon={<UserIcon className="w-6 h-6" />}
          label="حساب من"
          isDark={darkMode}
        />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label, isDark }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; isDark?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1.5 transition-all duration-300 relative",
        "md:flex-row md:items-center md:gap-4 md:w-full md:px-5 md:py-3.5 md:rounded-2xl md:hover:bg-slate-50 dark:md:hover:bg-slate-900/40 md:transition-all",
        active
          ? "text-blue-600 scale-110 md:scale-100 md:bg-blue-50 dark:md:bg-blue-900/20 md:shadow-sm"
          : isDark ? "text-slate-500" : "text-slate-300"
      )}
    >
      <div className={cn(
        "p-1.5 rounded-xl transition-all duration-300",
        "md:p-0 md:bg-transparent md:shadow-none md:dark:bg-transparent",
        active && "bg-blue-50 dark:bg-blue-900/20 shadow-sm"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-[10px] md:text-sm font-black tracking-tighter md:tracking-normal uppercase transition-all duration-300",
        active ? "opacity-100 text-blue-600 dark:text-blue-400 font-bold" : "text-slate-400 dark:text-slate-500 md:text-slate-600 md:dark:text-slate-400 md:font-semibold"
      )}>
        {label}
      </span>
      {active && (
        <motion.div
          layoutId="active-indicator"
          className="absolute -top-1 md:top-1/2 md:left-3 md:-translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full"
        />
      )}
    </button>
  );
}

const PropertyCard: React.FC<{ property: Property; isComparing?: boolean; onCompareToggle?: () => void; onClick: () => void; isDark?: boolean }> = ({ property, isComparing, onCompareToggle, onClick, isDark }) => {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 group relative cursor-pointer"
    >
      <div className="relative aspect-video overflow-hidden" onClick={onClick}>
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {/* <button 
            onClick={(e) => {
              e.stopPropagation();
              onCompareToggle?.();
            }}
            className={cn(
              "p-2 rounded-full shadow-lg transition-colors",
              isComparing ? "bg-blue-600 text-white" : "bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-400 dark:text-slate-500"
            )}
          >
            <Scale className="w-4 h-4" />
          </button> */}
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
        <div className="absolute bottom-4 left-4 flex gap-2">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold ring-1 ring-white/20">
            {property.type}
          </div>
        </div>
      </div>
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight text-sm md:text-base line-clamp-1 flex-1">{property.title}</h3>
          <span className="text-blue-600 dark:text-blue-400 font-black tracking-tight shrink-0 text-sm md:text-base whitespace-nowrap">
            {(property.price / 1000000000).toLocaleString('fa-IR')} <span className="text-[10px] font-bold">میلیارد</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs md:text-sm mb-4 md:mb-6">
          <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="truncate">{property.location.address}</span>
        </div>
        <div className="grid grid-cols-3 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 py-3 rounded-3xl border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col items-center justify-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-1 uppercase tracking-widest">اتاق</span>
            <span className="font-black text-xs md:text-sm">{property.bedrooms.toLocaleString('fa-IR')}</span>
          </div>
          <div className="flex flex-col items-center justify-center border-r border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-1 uppercase tracking-widest">سرویس</span>
            <span className="font-black text-xs md:text-sm">{property.bathrooms.toLocaleString('fa-IR')}</span>
          </div>
          <div className="flex flex-col items-center justify-center border-r border-slate-200 dark:border-slate-700 px-1">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-1 uppercase tracking-widest">متراژ</span>
            <span className="font-black text-xs md:text-sm whitespace-nowrap">{property.area.toLocaleString('fa-IR')} <span className="text-[9px] md:text-[10px] font-normal"></span></span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProfileItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full py-5 px-4 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer border-transparent outline-none"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-6 shadow-sm border border-slate-100 dark:border-slate-700">
          {icon}
        </div>
        <span className="text-slate-700 dark:text-slate-300 font-black text-base tracking-tight">{label}</span>
      </div>
      <ChevronLeft className="w-6 h-6 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:-translate-x-1 transition-all" />
    </button>
  );
}


