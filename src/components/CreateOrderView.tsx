import React, { useState } from 'react';
import { StoreService } from '../services/store';
import { User, Order } from '../types';
import { ArrowRight, MapPin, Navigation, FileText, DollarSign, AlertCircle } from 'lucide-react';

interface Props {
  user: User;
  onBack: () => void;
  onCreated: (order: Order) => void;
}

export const CreateOrderView: React.FC<Props> = ({ user, onBack, onCreated }) => {
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [description, setDescription] = useState('');
  const [priceStr, setPriceStr] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup.trim() || !drop.trim() || !priceStr.trim()) {
      setError('عمر عنوان الاستلام، التوصيل، والسعر');
      return;
    }

    const price = parseFloat(priceStr.replace(',', '.'));
    if (isNaN(price) || price <= 0) {
      setError('السعر لازم يكون رقم صحيح وموجب');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const order = await StoreService.createOrder({
        clientId: user.uid,
        clientName: user.name,
        clientPhone: user.phone,
        pickupAddress: pickup.trim(),
        dropAddress: drop.trim(),
        description: description.trim(),
        price: price,
      });
      onCreated(order);
    } catch (err: any) {
      setError('فشل إرسال الطلب: ' + (err?.message || 'حدث خطأ'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 px-4 py-3.5 shadow-2xs">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer transition"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">طلب جديد</h1>
        </div>
      </header>

      {/* Form Container */}
      <main className="max-w-xl mx-auto px-4 pt-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 text-red-700 text-sm flex items-center gap-2 border border-red-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                عنوان الاستلام <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#1E88E5]">
                  <MapPin className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="مثال: تونس العاصمة - شارع الحبيب بورقيبة"
                  className="block w-full pr-10 pl-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                عنوان التوصيل <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-red-500">
                  <Navigation className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={drop}
                  onChange={(e) => setDrop(e.target.value)}
                  placeholder="مثال: أريانة - حي النصر 2"
                  className="block w-full pr-10 pl-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                وصف الطلب
              </label>
              <div className="relative">
                <div className="absolute top-3 right-3 pointer-events-none text-gray-400">
                  <FileText className="w-5 h-5" />
                </div>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="مثال: وثائق في ملف مغلق، يرجى الحذر عليها"
                  className="block w-full pr-10 pl-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent text-sm transition resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                السعر (د.ت) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-amber-500">
                  <DollarSign className="w-5 h-5" />
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  required
                  value={priceStr}
                  onChange={(e) => setPriceStr(e.target.value)}
                  placeholder="مثال: 8.5"
                  dir="ltr"
                  className="block w-full pr-10 pl-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent text-sm transition text-right"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">المبلغ الذي تدفعه مقابل خدمة التوصيل بالدينار التونسي</p>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl text-white font-bold bg-[#1E88E5] hover:bg-[#1565C0] active:scale-[0.99] shadow-sm transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-base"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'إرسال الطلب'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
