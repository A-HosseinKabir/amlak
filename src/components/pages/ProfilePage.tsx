// src/components/pages/ProfilePage.tsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import {
  User as UserIcon,
  Eye,
  Calendar,
  Info,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { Button, Card } from '../common';
import ViewedHistory from '../features/user/ViewedHistory';
import VisitRequestsList from '../features/user/VisitRequestsList';
import SettingsView from '../features/user/SettingsView';
import AboutUs from '../features/user/AboutUs';

type ProfileSubView = 'menu' | 'history' | 'requests' | 'about' | 'settings';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [subView, setSubView] = useState<ProfileSubView>('menu');

  const handleLogout = async () => {
    await logout();
  };

  const renderContent = () => {
    switch (subView) {
      case 'history':
        return <ViewedHistory onPropertyClick={() => {}} />;
      case 'requests':
        return <VisitRequestsList />;
      case 'about':
        return <AboutUs />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <div className="space-y-3">
            <ProfileMenuItem
              icon={<Eye className="w-5 h-5 text-indigo-500" />}
              label="تاریخچه آگهی‌های مشاهده شده"
              onClick={() => setSubView('history')}
            />
            <ProfileMenuItem
              icon={<Calendar className="w-5 h-5 text-emerald-500" />}
              label="درخواست‌های بازدید"
              onClick={() => setSubView('requests')}
            />
            <ProfileMenuItem
              icon={<Info className="w-5 h-5 text-amber-500" />}
              label="درباره ما"
              onClick={() => setSubView('about')}
            />
            <ProfileMenuItem
              icon={<Settings className="w-5 h-5 text-blue-500" />}
              label="تنظیمات"
              onClick={() => setSubView('settings')}
            />

            {user ? (
              <Button
                variant="danger"
                fullWidth
                size="lg"
                icon={<LogOut className="w-5 h-5" />}
                onClick={handleLogout}
                className="mt-6"
              >
                خروج از حساب
              </Button>
            ) : null}
          </div>
        );
    }
  };

  return (
    <div className="max-w-lg md:max-w-2xl mx-auto p-4 md:p-8 space-y-6 pt-10 md:pt-14">
      {subView !== 'menu' && (
        <button
          onClick={() => setSubView('menu')}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black transition-all"
        >
          <ChevronRight className="w-4 h-4" />
          برگشت به منوی حساب من
        </button>
      )}

      <Card variant="default" padding="lg">
        {subView === 'menu' && (
          <>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-800 shadow-lg">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div>
                <h3 className="font-black text-xl text-slate-900 dark:text-white">
                  {user?.displayName || 'کاربر مهمان'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {user?.phoneNumber || 'برای دسترسی به امکانات وارد شوید'}
                </p>
              </div>
            </div>

            {renderContent()}
          </>
        )}

        {subView !== 'menu' && renderContent()}
      </Card>
    </div>
  );
};

const ProfileMenuItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full py-5 px-4 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
          {icon}
        </div>
        <span className="text-slate-700 dark:text-slate-300 font-black text-base tracking-tight">
          {label}
        </span>
      </div>
      <ChevronRight className="w-6 h-6 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:-translate-x-1 transition-all" />
    </button>
  );
};

export default ProfilePage;