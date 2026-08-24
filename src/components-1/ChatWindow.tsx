import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Image as ImageIcon, ArrowRight, MapPin } from 'lucide-react';
import { api, ChatMessage as Message } from '../services/backendService';
import { Property } from '../types/property';
import { cn } from '../lib/utils';

interface ChatWindowProps {
  roomId: string;
  property: Property;
  onClose: () => void;
  isInline?: boolean;
}

const MOCK_MESSAGES: Record<string, Message[]> = {
  'mock1': [
    { id: 'm1', senderId: 'user', text: 'سلام، وقت بخیر. این واحد هنوز برای فروش موجوده؟', timestamp: new Date(Date.now() - 3600000) },
    { id: 'm2', senderId: 'agent', text: 'سلام، بله خوشبختانه هنوز موجوده. تمایل دارید برای بازدید هماهنگ کنیم؟', timestamp: new Date(Date.now() - 3500000) }
  ],
  'mock2': [
    { id: 'm3', senderId: 'user', text: 'ممنون از توضیحات کاملتون.', timestamp: new Date(Date.now() - 7200000) },
    { id: 'm4', senderId: 'agent', text: 'خواهش می‌کنم، فردا ساعت ۵ عصر منتظر شما هستم برای بازدید.', timestamp: new Date(Date.now() - 7100000) }
  ],
  'mock3': [
    { id: 'm5', senderId: 'user', text: 'سلام، آیا امکان تخفیف روی مبلغ رهن وجود دارد؟ چون بودجه من کمی کمتر هست.', timestamp: new Date(Date.now() - 86400000) },
    { id: 'm6', senderId: 'agent', text: 'سلام دوست عزیز، باید با مالک صحبت کنم اما معمولاً در صورت خوش‌حسابی مستاجر، تخفیف جزئی می‌دهند.', timestamp: new Date(Date.now() - 86300000) }
  ]
};

export default function ChatWindow({ roomId, property, onClose, isInline = false }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (roomId.startsWith('mock')) {
      setMessages(MOCK_MESSAGES[roomId] || []);
      return;
    }

    const unsubscribe = api.subscribeToMessages(roomId, (data) => {
      setMessages(data);
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    if (roomId.startsWith('mock') || roomId.startsWith('temp')) {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: 'user',
        text: inputText,
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      return;
    }

    const savedUser = localStorage.getItem('user');
    if (!savedUser) return;
    const user = JSON.parse(savedUser);

    try {
      await api.sendMessage(roomId, user.id, inputText);
      setInputText('');
    } catch (err) {
      console.error(err);
    }
  };

  const Wrapper = isInline ? ('div' as any) : motion.div;
  const wrapperProps = isInline 
    ? { className: "flex flex-col h-full w-full relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)]" }
    : {
        initial: { x: '100%' },
        animate: { x: 0 },
        exit: { x: '100%' },
        className: "fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col",
      };

  return (
    <Wrapper {...wrapperProps} dir="rtl">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 transition-colors">
        {!isInline && (
          <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full transition-colors">
            <ArrowRight className="w-6 h-6 text-slate-900 dark:text-white" />
          </button>
        )}
        <div className="flex-1 flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800">
            <img src={property.images[0]} className="w-full h-full object-cover" />
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

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-950/20 scrollbar-hide">
        {messages.map(msg => {
          const savedUser = localStorage.getItem('user');
          const user = savedUser ? JSON.parse(savedUser) : null;
          const isMe = msg.senderId === 'user' || msg.senderId === user?.id;
          return (
            <div key={msg.id} className={cn("flex", isMe ? "justify-start" : "justify-end")}>
              <div className={cn(
                "max-w-[80%] p-4 rounded-[1.5rem] shadow-sm text-sm leading-relaxed font-medium transition-all",
                isMe 
                  ? "bg-blue-600 text-white rounded-br-none shadow-blue-200/50 dark:shadow-none" 
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-bl-none border border-slate-200 dark:border-slate-800"
              )}>
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className={cn("p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors", isInline ? "pb-4" : "pb-10")}>
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-800/50 p-2 rounded-3xl border border-transparent focus-within:border-blue-400 dark:focus-within:border-blue-600 transition-all">
          <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 transition-colors">
            <ImageIcon className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="پیام خود را بنویسید..."
            className="flex-1 bg-transparent border-none outline-none text-sm px-2 pr-4 text-slate-900 dark:text-white"
          />
          <button 
            onClick={handleSendMessage}
            className="p-2 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100 dark:shadow-none hover:bg-blue-500 transition-all active:scale-95"
          >
            <Send className="w-5 h-5 animate-pulse" />
          </button>
        </div>
      </div>
    </Wrapper>
  );
}
