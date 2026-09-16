import React, { useState, useEffect } from 'react';
import { StoreService } from '../services/store';
import { User, Order } from '../types';
import { OrderCard } from './OrderCard';
import { Plus, LogOut, RefreshCw, PackageX } from 'lucide-react';

interface Props {
  user: User;
  onNewOrder: () => void;
  onSelectOrder: (order: Order) => void;
  onLogout: () => void;
}

export const ClientHomeView: React.FC<Props> = ({
  user,
  onNewOrder,
  onSelectOrder,
  onLogout,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await StoreService.getClientOrders(user.uid);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user.uid]);

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-24">
      {/* App Bar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 px-4 py-3.5 shadow-2xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">طلباتي</h1>
            <p className="text-xs text-gray-500 mt-0.5">مرحباً بك، {user.name}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadOrders}
              disabled={loading}
              title="تحديث"
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 cursor-pointer transition"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-[#1E88E5]' : ''}`} />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-red-600 hover:bg-red-50 text-sm font-semibold cursor-pointer transition"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 pt-4">
        {loading && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-[#1E88E5]/30 border-t-[#1E88E5] rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-gray-500">جاري تحميل الطلبات...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-2xs my-6">
            <div className="w-16 h-16 bg-blue-50 text-[#1E88E5] rounded-full flex items-center justify-center mx-auto mb-4">
              <PackageX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">لا توجد طلبات بعد</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              اضغط على زر "طلب جديد" بالأسفل لإنشاء أول طلب توصيل لك بكل سهولة.
            </p>
            <button
              onClick={onNewOrder}
              className="inline-flex items-center gap-2 bg-[#1E88E5] hover:bg-[#1565C0] text-white font-bold px-6 py-2.5 rounded-xl cursor-pointer shadow-xs transition"
            >
              <Plus className="w-5 h-5" />
              <span>طلب جديد</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 px-1">
              <span>إجمالي الطلبات: {orders.length}</span>
            </div>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onClick={onSelectOrder} />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button (FAB) for New Order */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 flex justify-end pointer-events-none">
        <button
          onClick={onNewOrder}
          className="pointer-events-auto flex items-center gap-2 px-5 py-3.5 bg-[#1E88E5] hover:bg-[#1565C0] text-white font-bold rounded-full shadow-lg shadow-blue-500/25 active:scale-95 transition cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>طلب جديد</span>
        </button>
      </div>
    </div>
  );
};
