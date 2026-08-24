// src/components/pages/ChatsPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import ChatRoomsList from '../features/chat/ChatRoomsList';
import ChatWindow from '../features/chat/ChatWindow';
import { Button, LoadingSpinner } from '../common';
import { MessageSquare } from 'lucide-react';
import { Property } from '../../types/property.types';

export const ChatsPage: React.FC = () => {
  const { user } = useAuth();
  const { rooms, loading, activeRoomId, setActiveRoomId, getPropertyForRoom } = useChat();
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);

  const handleSelectRoom = (roomId: string, property: Property) => {
    setActiveRoomId(roomId);
    setActiveProperty(property);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
          <MessageSquare className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
          برای مشاهده گفتگوها وارد شوید
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm">
          پس از ورود به حساب کاربری، می‌توانید با مشاوران و مالکان ارتباط برقرار کنید.
        </p>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner size="lg" text="در حال بارگذاری گفتگوها..." />;
  }

  return (
    <div className="h-full w-full max-w-7xl mx-auto flex flex-col md:flex-row md:divide-x md:divide-x-reverse md:divide-slate-200 dark:md:divide-slate-800">
      {/* لیست اتاق‌ها */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col h-full bg-slate-50 dark:bg-slate-950 md:border-l md:border-slate-100 dark:md:border-slate-800 overflow-hidden shrink-0">
        <div className="p-4 md:p-6 pb-2 shrink-0">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            گفتگوهای من
          </h2>
          <p className="hidden md:block text-xs font-bold text-slate-400 mt-1">
            مشاهده پیام‌ها و هماهنگی جهت بازدید املاک
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide pb-28 md:pb-6">
          <ChatRoomsList
            onSelectRoom={handleSelectRoom}
            activeRoomId={activeRoomId || undefined}
          />
        </div>
      </div>

      {/* پنجره چت */}
      <div className="hidden md:flex flex-1 flex-col h-full bg-slate-100/30 dark:bg-slate-900/10 p-6 overflow-hidden">
        {activeRoomId && activeProperty ? (
          <ChatWindow
            roomId={activeRoomId}
            property={activeProperty}
            onClose={() => {
              setActiveRoomId(null);
              setActiveProperty(null);
            }}
            isInline={true}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2.5rem] text-center shadow-sm">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
              <MessageSquare className="w-10 h-10" />
            </div>
            <h3 className="font-black text-lg text-slate-950 dark:text-white mb-2">
              به پیام‌رسان هوم‌هاب خوش آمدید
            </h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 max-w-sm leading-relaxed">
              جهت شروع مکالمه، یکی از گفتگوها را از پنل سمت راست انتخاب نمایید.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsPage;