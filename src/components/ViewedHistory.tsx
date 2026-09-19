import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Home, MapPin } from 'lucide-react';
import { Property } from '../types/property';
import { MOCK_PROPERTIES } from '../constants';

interface ViewedHistoryProps {
  onPropertyClick: (property: Property) => void;
}

export default function ViewedHistory({ onPropertyClick }: ViewedHistoryProps) {
  const [historyList, setHistoryList] = useState<Property[]>([]);

  const loadHistory = () => {
    const historyJSON = localStorage.getItem('viewed_properties_history');
    if (historyJSON) {
      try {
        const ids: string[] = JSON.parse(historyJSON);
        // Map ids to full property objects
        const foundProps = ids
          .map(id => MOCK_PROPERTIES.find(p => p.id === id))
          .filter((p): p is Property => !!p);
        setHistoryList(foundProps);
      } catch (e) {
        setHistoryList([]);
      }
    } else {
      setHistoryList([]);
    }
  };

  useEffect(() => {
    loadHistory();
    // Listen for custom trigger to update list if cleared in Settings
    const handleSync = () => loadHistory();
    window.addEventListener('history-cleared', handleSync);
    return () => window.removeEventListener('history-cleared', handleSync);
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem('viewed_properties_history');
    setHistoryList([]);
    window.dispatchEvent(new Event('history-cleared'));
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">تاریخچه بازدید‌ها</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1">آگهی‌هایی که اخیراً بررسی کرده‌اید</p>
        </div>
        {historyList.length > 0 && (
          <button 
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:hover:bg-rose-900/30 dark:text-rose-450 text-xs font-bold transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            پاک کردن کل تاریخچه
          </button>
        )}
      </div>

      {historyList.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 p-8">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
            <Eye className="w-8 h-8" />
          </div>
          <p className="text-slate-400 dark:text-slate-500 font-bold text-sm">شما هنوز آگهی‌ای را مشاهده نکرده‌اید</p>
          <p className="text-slate-300 dark:text-slate-600 text-xs mt-1">با کلیک روی آگهی‌ها در تب نخست، تاریخچه شما اینجا نمایش داده می‌شود.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {historyList.map((property) => (
            <div 
              key={property.id}
              onClick={() => onPropertyClick(property)}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 flex gap-4 hover:border-blue-400 dark:hover:border-blue-800 transition-all cursor-pointer group"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative bg-slate-100">
                <img 
                  src={property.images[0]} 
                  alt={property.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {property.title}
                  </h4>
                  <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs mt-1">
                    <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                    <span className="truncate">{property.location.address}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50 dark:border-slate-800/50">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-black">{property.type}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-black text-xs">
                    {(property.price / 1000000000).toLocaleString('fa-IR')} میلیارد
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
