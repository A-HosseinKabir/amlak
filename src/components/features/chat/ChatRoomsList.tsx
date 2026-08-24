// src/components/features/chat/ChatRoomsList.tsx
import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Clock, ChevronLeft } from 'lucide-react';
import { useChat } from '../../../hooks/useChat';
import { useProperties } from '../../../hooks/useProperties';
import { cn } from '../../../utils/cn';
import { LoadingSpinner } from '../../common';

interface ChatRoomsListProps {
  onSelectRoom: (roomId: string, property: any) => void;
  activeRoomId?: string;
}

export const ChatRoomsList: React.FC<ChatRoomsListProps> = ({
  onSelectRoom,
  activeRoomId,
}) => {
  const { rooms, loading } = useChat();
  const { properties } = useProperties();

  if (loading) {
    return <LoadingSpinner size="sm" text="در حال بارگذاری گفتگوها..." />;
  }

  if (rooms.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
        <MessageSquare className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
        <p className="text-slate-400 dark:text-slate-500 text-sm font-bold">
          هنوز گفتگویی شروع نشده است
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rooms.map((room) => {
        const property = properties.find((p) => p.id === room.propertyId);
        if (!property) return null;

        return (
          <ChatRoomItem
            key={room.id}
            room={room}
            property={property}
            onClick={onSelectRoom}
            isActive={activeRoomId === room.id}
          />
        );
      })}
    </div>
  );
};

const ChatRoomItem: React.FC<{
  room: any;
  property: any;
  onClick: (roomId: string, property: any) => void;
  isActive?: boolean;
}> = ({ room, property, onClick, isActive = false }) => {
  return (
    <button
      onClick={() => onClick(room.id, property)}
      className={cn(
        'w-full p-4 rounded-3xl border flex items-center gap-4 transition-all text-right group ring-1',
        isActive
          ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/10 ring-blue-500'
          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 ring-black/5 dark:ring-white/5'
      )}
    >
      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-50 dark:border-slate-800 shadow-inner shrink-0">
        <img
          src={property.images[0]}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          alt={property.title}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <h4
          className={cn(
            'font-bold truncate transition-colors uppercase tracking-tight text-sm md:text-base',
            isActive
              ? 'text-white'
              : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
          )}
        >
          {property.title}
        </h4>
        <p
          className={cn(
            'text-[10px] md:text-xs font-bold truncate mt-1 flex items-center gap-1.5 whitespace-nowrap',
            isActive ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
          )}
        >
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0',
              isActive && 'bg-white animate-none'
            )}
          />
          آخرین پیام: {room.lastMessage || '...'}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2 pr-2 shrink-0">
        <div
          className={cn(
            'flex items-center gap-1 text-[9px] font-black tracking-widest uppercase',
            isActive ? 'text-blue-200' : 'text-slate-300 dark:text-slate-600'
          )}
        >
          <Clock className="w-2.5 h-2.5" />
          <span>۲ ساعت</span>
        </div>
        <div
          className={cn(
            'w-8 h-8 rounded-xl flex items-center justify-center transition-all transform group-hover:-translate-x-1 shadow-sm',
            isActive
              ? 'bg-white/20 text-white'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 group-hover:bg-blue-600 dark:group-hover:bg-blue-400 group-hover:text-white'
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </div>
      </div>
    </button>
  );
};

export default ChatRoomsList;