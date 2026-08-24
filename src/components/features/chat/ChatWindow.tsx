// src/components/features/chat/ChatWindow.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Image as ImageIcon, ArrowRight, MapPin } from 'lucide-react';
import { useChat } from '../../../hooks/useChat';
import { useAuth } from '../../../hooks/useAuth';
import { cn } from '../../../utils/cn';
import { Button, Input } from '../../common';

interface ChatWindowProps {
  roomId: string;
  property: any;
  onClose: () => void;
  isInline?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  roomId,
  property,
  onClose,
  isInline = false,
}) => {
  const { messages, sendMessage, loadMessages, loading } = useChat();
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages(roomId);
  }, [roomId, loadMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    await sendMessage(inputText);
    setInputText('');
  };

  const Wrapper = isInline ? ('div' as any) : motion.div;
  const wrapperProps = isInline
    ? {
        className:
          'flex flex-col h-full w-full relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)]',
      }
    : {
        initial: { x: '100%' },
        animate: { x: 0 },
        exit: { x: '100%' },
        className: 'fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col',
      };

  return (
    <Wrapper {...wrapperProps} dir="rtl">
      {/* هدر */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        {!isInline && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full transition-colors"
          >
            <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
          </button>
        )}
        <div className="flex-1 flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800">
            <img src={property.images[0]} className="w-full h-full object-cover" alt={property.title} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{property.title}</h3>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
              <MapPin className="w-2.5 h-2.5" />
              <span>{property.location.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* پیام‌ها */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-950/20 scrollbar-hide">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse text-slate-400 text-sm">در حال بارگذاری...</div>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === 'user' || msg.senderId === user?.id;
            return (
              <div key={msg.id} className={cn('flex', isMe ? 'justify-start' : 'justify-end')}>
                <div
                  className={cn(
                    'max-w-[80%] p-4 rounded-[1.5rem] shadow-sm text-sm leading-relaxed font-medium transition-all',
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-none shadow-blue-200/50 dark:shadow-none'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-bl-none border border-slate-200 dark:border-slate-800'
                  )}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ورودی */}
      <div className={cn('p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900', isInline ? 'pb-4' : 'pb-10')}>
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-800/50 p-2 rounded-3xl border border-transparent focus-within:border-blue-400 dark:focus-within:border-blue-600 transition-all">
          <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 transition-colors">
            <ImageIcon className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="پیام خود را بنویسید..."
            className="flex-1 bg-transparent border-none outline-none text-sm px-2 pr-4 text-slate-900 dark:text-white"
          />
          <button
            onClick={handleSend}
            className="p-2 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100 dark:shadow-none hover:bg-blue-500 transition-all active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

export default ChatWindow;