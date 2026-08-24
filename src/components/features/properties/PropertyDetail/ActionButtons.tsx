// src/components/features/properties/PropertyDetail/ActionButtons.tsx
import React from 'react';
import { Button } from '../../../common';
import { MessageCircle, Calendar, Phone } from 'lucide-react';
import { formatPriceShort } from '../../../../utils/formatters';

interface ActionButtonsProps {
  price: number;
  onChat: () => void;
  onVisit: () => void;
  isLoggedIn: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  price,
  onChat,
  onVisit,
  isLoggedIn,
}) => {
  return (
    <div className="sticky bottom-0 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 p-4 -mx-6 px-6 mt-8">
      <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
        <div className="flex-1">
          <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatPriceShort(price)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="md"
            icon={<Calendar className="w-4 h-4" />}
            onClick={onVisit}
            disabled={!isLoggedIn}
          >
            بازدید
          </Button>
          <Button
            variant="secondary"
            size="md"
            icon={<MessageCircle className="w-4 h-4" />}
            onClick={onChat}
            disabled={!isLoggedIn}
          >
            چت
          </Button>
          <Button
            variant="outline"
            size="md"
            icon={<Phone className="w-4 h-4" />}
          >
            تماس
          </Button>
        </div>
      </div>
    </div>
  );
};