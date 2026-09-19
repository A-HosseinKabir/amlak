import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Trash2, Edit3, X, Check, Save, UserCheck, Eye, MapPin } from 'lucide-react';

interface Slot {
  day: string;
  hour: string;
}

interface VisitRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage: string;
  price: number;
  slots: Slot[];
  status: string;
  createdAt: string;
}

const AVAILABLE_DAYS = [
  "امروز - دوشنبه ۵ خرداد",
  "فردا - سه‌شنبه ۶ خرداد",
  "چهارشنبه ۷ خرداد",
  "پنج‌شنبه ۸ خرداد",
  "جمعه ۹ خرداد",
  "شنبه ۱۰ خرداد",
  "یکشنبه ۱۱ خرداد",
  "دوشنبه ۱۲ خرداد"
];

export default function VisitRequestsList() {
  const [requests, setRequests] = useState<VisitRequest[]>([]);
  const [editingRequest, setEditingRequest] = useState<VisitRequest | null>(null);
  const [editSlots, setEditSlots] = useState<Slot[]>([]);

  const loadRequests = () => {
    const listJSON = localStorage.getItem('visit_requests');
    if (listJSON) {
      try {
        setRequests(JSON.parse(listJSON));
      } catch (e) {
        setRequests([]);
      }
    } else {
      setRequests([]);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این درخواست بازدید اطمینان دارید؟')) {
      const updated = requests.filter(r => r.id !== id);
      setRequests(updated);
      localStorage.setItem('visit_requests', JSON.stringify(updated));
    }
  };

  const handleStartEdit = (req: VisitRequest) => {
    setEditingRequest(req);
    // Deep clone slots or fill up to at least 1 slot
    const cloned = req.slots.map(s => ({ ...s }));
    if (cloned.length === 0) cloned.push({ day: '', hour: '' });
    setEditSlots(cloned);
  };

  const handleAddSlot = () => {
    if (editSlots.length < 3) {
      setEditSlots([...editSlots, { day: '', hour: '' }]);
    }
  };

  const handleRemoveSlot = (index: number) => {
    if (editSlots.length > 1) {
      setEditSlots(editSlots.filter((_, idx) => idx !== index));
    } else {
      setEditSlots([{ day: '', hour: '' }]);
    }
  };

  const handleUpdateSlot = (index: number, field: keyof Slot, value: string) => {
    const updated = [...editSlots];
    updated[index][field] = value;
    setEditSlots(updated);
  };

  const handleSaveEdit = () => {
    if (!editingRequest) return;

    // Filter out incomplete slots
    const validSlots = editSlots.filter(s => s.day && s.hour);
    if (validSlots.length === 0) {
      alert('لطفاً حداقل یک زمان معتبر با مشخص کردن روز و ساعت وارد کنید.');
      return;
    }

    const updatedRequests = requests.map(r => {
      if (r.id === editingRequest.id) {
        return {
          ...r,
          slots: validSlots
        };
      }
      return r;
    });

    setRequests(updatedRequests);
    localStorage.setItem('visit_requests', JSON.stringify(updatedRequests));
    setEditingRequest(null);
  };

  const statusColors: Record<string, { bg: string, text: string }> = {
    'در انتظار تایید': { bg: 'bg-amber-50 dark:bg-amber-950/20', text: 'text-amber-600 dark:text-amber-450' },
    'تایید شده': { bg: 'bg-emerald-50 dark:bg-emerald-950/20', text: 'text-emerald-600 dark:text-emerald-450' },
    'لغو شده': { bg: 'bg-rose-50 dark:bg-rose-950/20', text: 'text-rose-600 dark:text-rose-450' }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white">درخواست‌های بازدید من</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1">مدیریت هماهنگی‌های حضور فیزیکی جهت بررسی ملک</p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 p-8">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
            <Calendar className="w-8 h-8" />
          </div>
          <p className="text-slate-400 dark:text-slate-500 font-bold text-sm">هیچ درخواست بازدیدی ثبت نکرده‌اید</p>
          <p className="text-slate-300 dark:text-slate-600 text-xs mt-1">با ورود به جزئیات هر ملک، روی دکمه تقویم کلیک کرده و درخواست خود را بفرستید.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const statusStyle = statusColors[req.status] || { bg: 'bg-slate-50', text: 'text-slate-600' };
            return (
              <div 
                key={req.id}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4"
              >
                {/* Header Information */}
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex gap-4 items-center min-w-0">
                    <img 
                      src={req.propertyImage} 
                      alt={req.propertyTitle} 
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 bg-slate-100" 
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white text-base truncate">{req.propertyTitle}</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="truncate">{req.propertyLocation}</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Status Badges */}
                  <div className="flex self-start sm:self-center gap-2 items-center">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black select-none ${statusStyle.bg} ${statusStyle.text}`}>
                      {req.status}
                    </span>
                  </div>
                </div>

                {/* Slots Overview */}
                <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100/50 dark:border-slate-800/50 rounded-2xl p-4 space-y-3">
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-black">زمان‌های پیشنهادی ثبت‌شده شما:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {req.slots.map((slot, index) => (
                      <div 
                        key={index}
                        className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 p-3 rounded-xl flex items-center gap-2 text-xs"
                      >
                        <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{slot.day}</p>
                          <p className="text-slate-400 dark:text-slate-500 font-bold mt-0.5">ساعت {slot.hour}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2.5 pt-1">
                  <button
                    onClick={() => handleStartEdit(req)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-350 text-xs font-black transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                    ویرایش زمان‌ها
                  </button>
                  <button
                    onClick={() => handleDelete(req.id)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-650 dark:bg-rose-900/20 dark:hover:bg-rose-900/30 dark:text-rose-450 text-xs font-black transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف درخواست
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Editing Modal Overlay */}
      {editingRequest && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 max-w-md w-full shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="font-black text-lg text-slate-900 dark:text-white">ویرایش زمان‌های پیشنهادی</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1">تغییر گزینه‌های زمان ملاقات</p>
              </div>
              <button 
                onClick={() => setEditingRequest(null)}
                className="w-10 h-10 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/85 rounded-full flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[40vh] overflow-y-auto scrollbar-hide pr-1">
              {editSlots.map((slot, index) => (
                <div key={index} className="bg-slate-50/50 dark:bg-slate-900/20 p-4 border border-slate-100 dark:border-slate-800/80 rounded-2xl space-y-3 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-black">گزینه زمان پیشنهادی {index + 1}</span>
                    {editSlots.length > 1 && (
                      <button 
                        onClick={() => handleRemoveSlot(index)}
                        className="text-rose-500 hover:text-rose-600 text-xs font-bold"
                      >
                        حذف این گزینه
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-1">انتخاب روز</label>
                      <select
                        value={slot.day}
                        onChange={(e) => handleUpdateSlot(index, 'day', e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-black shadow-xs outline-none"
                      >
                        <option value="">روز مناسب را انتخاب کنید</option>
                        {AVAILABLE_DAYS.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-1">ساعت حضور</label>
                      <input 
                        type="text"
                        value={slot.hour}
                        onChange={(e) => handleUpdateSlot(index, 'hour', e.target.value)}
                        placeholder="مثلا ساعت ۱۷:۰۰"
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-black shadow-xs placeholder-slate-400 outline-none text-right"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {editSlots.length < 3 && (
                <button
                  onClick={handleAddSlot}
                  className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-500 text-slate-500 transition-colors rounded-2xl text-xs font-black"
                >
                  + افزودن زمان پیشنهادی جدید
                </button>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all outline-none"
              >
                <Save className="w-4 h-4" />
                ذخیره تغییرات
              </button>
              <button
                onClick={() => setEditingRequest(null)}
                className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-350 py-3 rounded-2xl text-xs font-black transition-all outline-none"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
