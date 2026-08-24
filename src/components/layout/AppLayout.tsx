// src/components/layout/AppLayout.tsx
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Map as MapIcon, MessageSquare, Heart, User as UserIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion } from 'motion/react';
import { useTheme } from '../../hooks/useTheme';

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();

  const tabs = [
    { key: '/', icon: <Home className="w-6 h-6" />, label: 'آگهی‌ها' },
    { key: '/map', icon: <MapIcon className="w-6 h-6" />, label: 'نقشه' },
    { key: '/chats', icon: <MessageSquare className="w-6 h-6" />, label: 'گفتگوها' },
    { key: '/saved', icon: <Heart className="w-6 h-6" />, label: 'نشان‌ها' },
    { key: '/profile', icon: <UserIcon className="w-6 h-6" />, label: 'حساب من' },
  ];

  const activeTab = location.pathname;

  return (
    <div
      className={cn(
        'flex flex-col h-screen font-sans transition-colors duration-300 overflow-hidden',
        isDark ? 'dark bg-slate-950' : 'bg-slate-50'
      )}
      dir="rtl"
    >
      {/* هدر */}
      <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-3 sticky top-0 z-50 transition-colors md:pr-64">
        <div className="flex items-center justify-between max-w-lg mx-auto w-full md:max-w-none md:px-8 xl:px-12">
          <h1 className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight md:hidden">
            HomeHub
          </h1>
          <div className="hidden md:block">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              سامانه هوشمند املاک تبریز
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1">
              مشاهده و جستجوی لوکس‌ترین ملک‌های کلان‌شهر تبریز
            </p>
          </div>
        </div>
      </header>

      {/* محتوای اصلی */}
      <main
        className={cn(
          'flex-1 relative scrollbar-hide bg-slate-50 dark:bg-slate-950 transition-colors duration-300 md:pr-64',
          activeTab === '/map' ? 'overflow-hidden' : 'overflow-y-auto pb-24 md:pb-8'
        )}
      >
        <div className="h-full w-full">
          <Outlet />
        </div>
      </main>

      {/* ناوبری پایین (موبایل) / کناری (دسکتاپ) */}
      <nav
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 flex transition-all duration-500',
          'max-md:justify-around',
          'bg-white dark:bg-slate-950 backdrop-blur-2xl rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] dark:shadow-none px-4 py-3 pb-8 md:pb-6',
          activeTab === '/map' ? 'border-transparent' : 'border-t border-slate-100 dark:border-slate-800',
          'md:justify-start items-center md:top-0 md:bottom-0 md:right-0 md:left-auto md:h-screen md:w-64 md:flex-col md:justify-start md:items-stretch md:gap-3 md:pt-8 md:px-5 md:pb-6 md:rounded-t-none md:rounded-l-[2.5rem] md:shadow-[-15px_0_40px_rgba(0,0,0,0.03)] md:border-l md:border-t-0'
        )}
      >
        {/* لوگو (فقط دسکتاپ) */}
        <div className="hidden md:flex items-center gap-3 px-4 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <Home className="w-5 h-5" />
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
            HomeHub
          </span>
        </div>

        {tabs.map((tab) => (
          <NavButton
            key={tab.key}
            active={activeTab === tab.key}
            onClick={() => navigate(tab.key)}
            icon={tab.icon}
            label={tab.label}
          />
        ))}
      </nav>
    </div>
  );
};

const NavButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => {
  const { isDark } = useTheme();

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1.5 transition-all duration-300 relative',
        'md:flex-row md:items-center md:gap-4 md:w-full md:px-5 md:py-3.5 md:rounded-2xl md:hover:bg-slate-50 dark:md:hover:bg-slate-900/40',
        active
          ? 'text-blue-600 scale-110 md:scale-100 md:bg-blue-50 dark:md:bg-blue-900/20 md:shadow-sm'
          : isDark
            ? 'text-slate-500'
            : 'text-slate-300'
      )}
    >
      <div
        className={cn(
          'p-1.5 rounded-xl transition-all duration-300',
          'md:p-0 md:bg-transparent md:shadow-none',
          active && 'bg-blue-50 dark:bg-blue-900/20 shadow-sm'
        )}
      >
        {icon}
      </div>
      <span
        className={cn(
          'text-[10px] md:text-sm font-black tracking-tighter md:tracking-normal uppercase transition-all duration-300',
          active
            ? 'opacity-100 text-blue-600 dark:text-blue-400 font-bold'
            : 'text-slate-400 dark:text-slate-500 md:text-slate-600 md:dark:text-slate-400 md:font-semibold'
        )}
      >
        {label}
      </span>
      {active && (
        <motion.div
          layoutId="active-indicator"
          className="absolute -top-1 md:top-1/2 md:right-3 md:-translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full"
        />
      )}
    </button>
  );
};

export default AppLayout;