import React, { useState, useEffect } from 'react';
import { StoreService } from '../services/store';
import { User, Order } from '../types';
import { OrderCard } from './OrderCard';
import { LogOut, RefreshCw, Bike, PackageOpen, Inbox } from 'lucide-react';

interface Props {
  user: User;
  onSelectOrder: (order: Order) => void;
  onLogout: () => void;
}

export const LivreurHomeView: React.FC<Props> = ({
  user,
  onSelectOrder,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'available' | 'mine'>('available');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async (tab = activeTab) => {
    setLoading(true);
    try {
      if (tab === 'available') {
        const data = await StoreService.getAvailableOrders();
        setOrders(data);
      } else {
        const data = await StoreService.getLivreurOrders(user.uid);
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab, user.uid]);

  const handleTabChange = (tab: 'available' | 'mine') => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 px-4 py-3.5 shadow-2xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bike className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">بوابة الموصل</h1>
              <p className="text-xs text-gray-500">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadData(activeTab)}
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

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="grid grid-cols-2 gap-2 bg-gray-200/70 p-1 rounded-xl">
          <button
            onClick={() => handleTabChange('available')}
            className={`py-2.5 px-4 rounded-lg font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'available'
                ? 'bg-[#1E88E5] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>طلبات متاحة</span>
          </button>
          <button
            onClick={() => handleTabChange('mine')}
            className={`py-2.5 px-4 rounded-lg font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'mine'
                ? 'bg-[#1E88E5] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <PackageOpen className="w-4 h-4" />
            <span>توصيلاتي</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 pt-4">
        {loading && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-[#1E88E5]/30 border-t-[#1E88E5] rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-gray-500">جاري تحميل البيانات...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-2xs my-6">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'available' ? (
                <Inbox className="w-8 h-8" />
              ) : (
                <PackageOpen className="w-8 h-8" />
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {activeTab === 'available'
                ? 'لا توجد طلبات جديدة متاحة حالياً'
                : 'لم تقم بقبول أي توصيلات بعد'}
            </h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              {activeTab === 'available'
                ? 'قم بتحديث الصفحة بين الحين والآخر لرؤية الطلبات الجديدة المضافة من العملاء.'
                : 'تصفح قائمة "طلبات متاحة" واختر طلباً لقبوله والبدء في توصيله.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 px-1">
              <span>
                {activeTab === 'available'
                  ? `الطلبات المتاحة للقبول: ${orders.length}`
                  : `إجمالي توصيلاتك: ${orders.length}`}
              </span>
            </div>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onClick={onSelectOrder} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
