// src/components/features/properties/PropertyDetail/VisitScheduler.tsx
import React, { useState } from 'react';
import { Modal, Button, Input } from '../../../common';
import { Calendar, X, Send } from 'lucide-react';
import { WEEKDAYS } from '../../../../utils/constants';
import { cn } from '../../../../utils/cn';

interface VisitSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (slots: { day: string; hour: string }[]) => void;
}

interface Slot {
  day: string;
  hour: string;
}

export const VisitScheduler: React.FC<VisitSchedulerProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [slots, setSlots] = useState<Slot[]>([{ day: '', hour: '' }]);

  const addSlot = () => {
    if (slots.length < 3) {
      setSlots([...slots, { day: '', hour: '' }]);
    }
  };

  const removeSlot = (index: number) => {
    if (slots.length > 1) {
      setSlots(slots.filter((_, i) => i !== index));
    }
  };

  const updateSlot = (index: number, field: keyof Slot, value: string) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  };

  const handleSubmit = () => {
    const validSlots = slots.filter((s) => s.day && s.hour);
    if (validSlots.length === 0) {
      alert('لطفاً حداقل یک زمان معتبر انتخاب کنید');
      return;
    }
    onSubmit(validSlots);
    setSlots([{ day: '', hour: '' }]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ثبت درخواست بازدید"
      description="حداکثر ۳ زمان پیشنهادی برای بازدید انتخاب کنید"
      size="md"
      footer={
        <div className="flex gap-2">
          <Button onClick={handleSubmit} variant="primary" icon={<Send className="w-4 h-4" />}>
            ثبت درخواست
          </Button>
          <Button onClick={onClose} variant="secondary">
            انصراف
          </Button>
        </div>
      }
    >
      <div className="space-y-4 max-h-[40vh] overflow-y-auto">
        {slots.map((slot, index) => (
          <div
            key={index}
            className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                زمان پیشنهادی {index + 1}
              </span>
              {slots.length > 1 && (
                <button
                  onClick={() => removeSlot(index)}
                  className="text-rose-500 hover:text-rose-600 text-xs font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={slot.day}
                onChange={(e) => updateSlot(index, 'day', e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold outline-none"
              >
                <option value="">انتخاب روز</option>
                {WEEKDAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={slot.hour}
                onChange={(e) => updateSlot(index, 'hour', e.target.value)}
                placeholder="ساعت (مثلاً ۱۶:۳۰)"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-bold outline-none"
              />
            </div>
          </div>
        ))}

        {slots.length < 3 && (
          <button
            onClick={addSlot}
            className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 transition-colors rounded-2xl text-xs font-bold"
          >
            + افزودن زمان پیشنهادی
          </button>
        )}
      </div>
    </Modal>
  );
};