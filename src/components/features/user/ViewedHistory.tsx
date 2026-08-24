// src/components/features/user/ViewedHistory.tsx
import React from 'react';
import { Eye, Trash2, MapPin } from 'lucide-react';
import { useHistory } from '../../../hooks/useHistory';
import { Button, Card } from '../../common';
import { formatPriceShort } from '../../../utils/formatters';

interface ViewedHistoryProps {
  onPropertyClick: (property: any) => void;
}

export const ViewedHistory: React.FC<ViewedHistoryProps> = ({ onPropertyClick }) => {
  const { historyProperties, clearHistory } = useHistory();

  if (historyProperties.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
          <Eye className="w-8 h-8" />
        </div>
        <p className="text-slate-400 dark:text-slate-500 font-bold text-sm">
          شما هنوز آگهی‌ای را مشاهده نکرده‌اید
        </p>
        <p className="text-slate-300 dark:text-slate-600 text-xs mt-1">
          با کلیک روی آگهی‌ها در تب نخست، تاریخچه شما اینجا نمایش داده می‌شود.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-black text-slate-900 dark:text-white">تاریخچه بازدید</h3>
        <Button variant="danger" size="sm" onClick={clearHistory}>
          <Trash2 className="w-4 h-4" />
          پاک کردن
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {historyProperties.map((property) => (
          <div
            key={property.id}
            onClick={() => onPropertyClick(property)}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 flex gap-4 hover:border-blue-400 dark:hover:border-blue-800 transition-all cursor-pointer group"
          >
            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {property.title}
                </h4>
                <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs mt-1">
                  <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                  <span className="truncate">{property.location.address}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50 dark:border-slate-800/50">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-black">
                  {property.type}
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-black text-xs">
                  {formatPriceShort(property.price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewedHistory;