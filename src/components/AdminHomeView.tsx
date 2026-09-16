import React, { useState, useEffect } from 'react';
import { StoreService } from '../services/store';
import { User, Order } from '../types';
import { OrderCard } from './OrderCard';
import { UserCard } from './UserCard';
import { LogOut, RefreshCw, Shield, Layers, Users as UsersIcon } from 'lucide-react';

interface Props {
  user: User;
  onSelectOrder: (order: Order) => void;
  onLogout: () => void;
}

export const AdminHomeView: React.FC<Props> = ({
  user,
  onSelectOrder,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'users'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersData, usersData] = await Promise.all([
        StoreService.getAllOrders(),
        StoreService.getAllUsers(),
      ]);
      setOrders(ordersData);
      setUsers(usersData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 px-4 py-3.5 shadow-2xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">لوحة تحكم الأدمن</h1>
              <p className="text-xs text-gray-500">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
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

      {/* Counters Bar */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E88E5] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500">إجمالي الطلبات</div>
              <div className="text-lg font-extrabold text-gray-900">{orders.length} طلب</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <UsersIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500">إجمالي المستخدمين</div>
              <div className="text-lg font-extrabold text-gray-900">{users.length} مستخدمين</div>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 gap-2 bg-gray-200/70 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-4 rounded-lg font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#1E88E5] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>كل الطلبات ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-4 rounded-lg font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'users'
                ? 'bg-[#1E88E5] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UsersIcon className="w-4 h-4" />
            <span>كل المستخدمين ({users.length})</span>
          </button>
        </div>
      </div>

      {/* Content List */}
      <main className="max-w-2xl mx-auto px-4 pt-4">
        {loading && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-[#1E88E5]/30 border-t-[#1E88E5] rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-gray-500">جاري تحميل البيانات...</p>
          </div>
        ) : activeTab === 'orders' ? (
          <div>
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-2xs my-6">
                <p className="text-gray-500 text-sm">لا توجد أي طلبات مسجلة في النظام.</p>
              </div>
            ) : (
              orders.map((order) => (
                <OrderCard key={order.id} order={order} onClick={onSelectOrder} />
              ))
            )}
          </div>
        ) : (
          <div>
            {users.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-2xs my-6">
                <p className="text-gray-500 text-sm">لا يوجد أي مستخدمين مسجلين.</p>
              </div>
            ) : (
              users.map((u) => <UserCard key={u.uid} user={u} />)
            )}
          </div>
        )}
      </main>
    </div>
  );
};
