import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, ChevronRight, Clock, ChevronLeft } from 'lucide-react';
import { api, ChatRoom } from '../services/backendService';
import { Property } from '../types/property';
import { MOCK_PROPERTIES } from '../constants';
import { cn } from '../lib/utils';

const MOCK_ROOMS: ChatRoom[] = [
  {
    id: 'mock1',
    propertyId: '1',
    propertyName: 'آپارتمان لوکس فرمانیه',
    lastMessage: 'سلام، ملک هنوز موجوده؟',
    participants: []
  },
  {
    id: 'mock2',
    propertyId: '4',
    propertyName: 'ویلای مدرن لواسان',
    lastMessage: 'ممنون از راهنمایی شما، فردا برای بازدید میام.',
    participants: []
  }
];

export default function ChatRoomsList({ onSelectRoom, activeRoomId }: { onSelectRoom: (roomId: string, property: Property) => void; activeRoomId?: string }) {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      setRooms(MOCK_ROOMS);
      setLoading(false);
      return;
    }
    const user = JSON.parse(savedUser);

    api.getChatRooms(user.id).then(dbRooms => {
      setRooms(dbRooms.length > 0 ? [...dbRooms, ...MOCK_ROOMS] : MOCK_ROOMS);
      setLoading(false);
    }).catch(() => {
      setRooms(MOCK_ROOMS);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-400 dark:text-slate-500 font-bold font-sans">در حال بارگذاری گفتگوها...</div>;
  if (rooms.length === 0) return (
    <div className="p-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
      <MessageSquare className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
      <p className="text-slate-400 dark:text-slate-500 text-sm font-bold">هنوز گفتگویی شروع نشده است</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {rooms.map(room => (
        <ChatRoomItem key={room.id} room={room} onClick={onSelectRoom} isActive={activeRoomId === room.id} />
      ))}
    </div>
  );
}

const ChatRoomItem: React.FC<{ room: ChatRoom; onClick: any; isActive?: boolean }> = ({ room, onClick, isActive = false }) => {
  const property = MOCK_PROPERTIES.find(p => p.id === room.propertyId);

  if (!property) return null;

  return (
    <button 
      onClick={() => onClick(room.id, property)}
      className={cn(
        "w-full p-4 rounded-3xl border flex items-center gap-4 transition-all text-right group ring-1",
        isActive 
          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/10 ring-blue-500" 
          : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 ring-black/5 dark:ring-white/5"
      )}
    >
      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-50 dark:border-slate-800 shadow-inner shrink-0">
        <img src={property.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="flex-1 overflow-hidden">
        <h4 className={cn(
          "font-bold truncate transition-colors uppercase tracking-tight text-sm md:text-base",
          isActive ? "text-white" : "text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
        )}>
          {property.title}
        </h4>
        <p className={cn(
          "text-[10px] md:text-xs font-bold truncate mt-1 flex items-center gap-1.5 whitespace-nowrap",
          isActive ? "text-blue-100" : "text-slate-400 dark:text-slate-500"
        )}>
          <span className={cn("w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0", isActive && "bg-white animate-none")} />
          آخرین پیام: {room.lastMessage || '...'}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2 pr-2 shrink-0">
        <div className={cn(
          "flex items-center gap-1 text-[9px] font-black tracking-widest uppercase",
          isActive ? "text-blue-200" : "text-slate-300 dark:text-slate-600"
        )}>
          <Clock className="w-2.5 h-2.5" />
          <span>۲ ساعت</span>
        </div>
        <div className={cn(
          "w-8 h-8 rounded-xl flex items-center justify-center transition-all transform group-hover:-translate-x-1 shadow-sm",
          isActive
            ? "bg-white/20 text-white"
            : "bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 group-hover:bg-blue-600 dark:group-hover:bg-blue-400 group-hover:text-white"
        )}>
          <ChevronLeft className="w-5 h-5" />
        </div>
      </div>
    </button>
  );
}
