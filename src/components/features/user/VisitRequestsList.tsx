// src/components/features/user/VisitRequestsList.tsx
import React, { useState } from 'react';
import { Calendar, Clock, Trash2, Edit3, X, Save, MapPin } from 'lucide-react';
import { useVisits } from '../../../hooks/useVisits';
import { Button, Modal, Input } from '../../common';
import { WEEKDAYS } from '../../../utils/constants';
import { cn } from '../../../utils/cn';

export const VisitRequestsList: React.FC = () => {
  const { requests, deleteRequest, updateRequest, loading } = useVisits();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSlots, setEditSlots] = useState<{ day: string; hour: string }[]>([]);

  const startEdit = (request: any) => {
    setEditingId(request.id);
    setEditSlots(request.slots.length > 0 ? request.slots : [{ day: '', hour: '' }]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditSlots([]);
  };

  const addSlot = () => {
    if (editSlots.length < 3) {
      setEditSlots([...editSlots, { day: '', hour: '' }]);
    }
  };

  const removeSlot = (index: number) => {
    if (editSlots.length > 1) {
      setEditSlots(editSlots.filter((_, i) => i !== index));
    }
  };

  const updateSlot = (index: number, field: keyof { day: string; hour: string }, value: string) => {
    const updated = [...editSlots];
    updated[index][field] = value;
    setEditSlots(updated);
  };

  const saveEdit = async () => {
    const validSlots = editSlots.filter((s) => s.day && s.hour);
    if (validSlots.length === 0) {
      alert('لطفاً حداقل یک زمان معتبر انتخاب کنید');
      return;
    }
    if (editingId) {
      await updateRequest(editingId, validSlots);
      cancelEdit();
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-400">در حال بارگذاری...</div>;
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
          <Calendar className="w-8 h-8" />
        </div>
        <p className="text-slate-400 font-bold text-sm">هیچ درخواست بازدیدی ثبت نکرده‌اید</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => {
        const statusColors: Record<string, string> = {
          'در انتظار تایید': 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400',
          'تایید شده': 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400',
          'لغو شده': 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400',
        };

        return (
          <div
            key={req.id}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex gap-4 items-center min-w-0">
                <img
                  src={req.propertyImage}
                  alt={req.propertyTitle}
                  className="w-14 h-14 rounded-2xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base truncate">
                    {req.propertyTitle}
                  </h4>
                  <p className="text-xs text-slate-400 font-bold flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">{req.propertyLocation}</span>
                  </p>
                </div>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${statusColors[req.status] || ''}`}>
                {req.status}
              </span>
            </div>

            <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100/50 rounded-2xl p-4 space-y-3">
              <p className="text-[11px] text-slate-400 font-black">زمان‌های پیشنهادی:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {req.slots.map((slot, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-3 rounded-xl flex items-center gap-2 text-xs"
                  >
                    <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{slot.day}</p>
                      <p className="text-slate-400 font-bold mt-0.5">ساعت {slot.hour}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <Button variant="secondary" size="sm" onClick={() => startEdit(req)}>
                <Edit3 className="w-4 h-4" />
                ویرایش
              </Button>
              <Button variant="danger" size="sm" onClick={() => deleteRequest(req.id)}>
                <Trash2 className="w-4 h-4" />
                حذف
              </Button>
            </div>
          </div>
        );
      })}

      {/* مودال ویرایش */}
      {editingId && (
        <Modal
          isOpen={!!editingId}
          onClose={cancelEdit}
          title="ویرایش زمان‌های پیشنهادی"
          size="md"
          footer={
            <div className="flex gap-2">
              <Button onClick={saveEdit} variant="primary" icon={<Save className="w-4 h-4" />}>
                ذخیره تغییرات
              </Button>
              <Button onClick={cancelEdit} variant="secondary">
                انصراف
              </Button>
            </div>
          }
        >
          <div className="space-y-4 max-h-[40vh] overflow-y-auto">
            {editSlots.map((slot, index) => (
              <div
                key={index}
                className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">
                    زمان پیشنهادی {index + 1}
                  </span>
                  {editSlots.length > 1 && (
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
            {editSlots.length < 3 && (
              <button
                onClick={addSlot}
                className="w-full py-3 border-2 border-dashed border-slate-200 hover:border-blue-500 hover:text-blue-600 transition-colors rounded-2xl text-xs font-bold"
              >
                + افزودن زمان پیشنهادی
              </button>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VisitRequestsList;