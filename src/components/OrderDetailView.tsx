import React, { useState } from 'react';
import { StoreService } from '../services/store';
import { User, Order, OrderStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import {
  ArrowRight,
  MapPin,
  Navigation,
  DollarSign,
  User as UserIcon,
  Bike,
  Package,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  order: Order;
  currentUser: User;
  onBack: () => void;
  onOrderUpdated: (updated: Order) => void;
}

export const OrderDetailView: React.FC<Props> = ({
  order: initialOrder,
  currentUser,
  onBack,
  onOrderUpdated,
}) => {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const safe = (val?: string | null) => (val && val.trim() !== '' ? val : '-');

  const handleUpdateStatus = async (newStatus: OrderStatus, assignLivreur = false) => {
    setUpdating(true);
    setMsg(null);
    try {
      const updated = await StoreService.updateOrderStatus(
        order.id,
        newStatus,
        assignLivreur ? currentUser.uid : undefined,
        assignLivreur ? currentUser.name : undefined
      );
      setOrder(updated);
      onOrderUpdated(updated);
      setMsg({ text: 'تم تحديث حالة الطلب بنجاح', type: 'success' });
    } catch (err: any) {
      setMsg({ text: 'فشل التحديث: ' + (err?.message || 'حدث خطأ'), type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  const isLivreur = currentUser.role === 'livreur';
  const isClient = currentUser.role === 'client';
  const isAdmin = currentUser.role === 'admin';

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
          <h1 className="text-xl font-bold text-gray-900">تفاصيل الطلب</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto px-4 pt-6">
        {msg && (
          <div
            className={`mb-4 p-3 rounded-xl text-sm flex items-center gap-2 border ${
              msg.type === 'success'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {msg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{msg.text}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs mb-5">
          {/* Header section with description and status badge */}
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E88E5] flex items-center justify-center shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {order.description && order.description.trim() !== ''
                    ? order.description
                    : 'طلب توصيل'}
                </h2>
                <div className="text-xs text-gray-400 mt-0.5">
                  رقم الطلب: #{order.id}
                </div>
              </div>
            </div>
            <StatusBadge status={order.status} className="text-sm px-3.5 py-1.5" />
          </div>

          {/* Route Section */}
          <div className="py-4 border-b border-gray-100 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-50 text-[#1E88E5] flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-gray-400">عنوان الاستلام (من)</div>
                <div className="font-semibold text-gray-800 text-sm">{order.pickupAddress}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-gray-400">عنوان التوصيل (إلى)</div>
                <div className="font-semibold text-gray-800 text-sm">{order.dropAddress}</div>
              </div>
            </div>
          </div>

          {/* Price & People info */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-sm">
              <div className="flex items-center gap-2 text-amber-900 font-semibold">
                <DollarSign className="w-4 h-4 text-amber-600" />
                <span>سعر التوصيل:</span>
              </div>
              <div className="font-extrabold text-amber-900 text-base">
                {order.price.toFixed(3)} د.ت
              </div>
            </div>

            <div className="flex items-center justify-between py-2 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <UserIcon className="w-4 h-4 text-gray-400" />
                <span>العميل:</span>
              </div>
              <div className="font-medium text-gray-800">
                {safe(order.clientName)} - {safe(order.clientPhone)}
              </div>
            </div>

            <div className="flex items-center justify-between py-2 text-sm border-t border-gray-50">
              <div className="flex items-center gap-2 text-gray-500">
                <Bike className="w-4 h-4 text-gray-400" />
                <span>الموصل:</span>
              </div>
              <div className="font-medium text-gray-800">
                {order.livreurId ? safe(order.livreurName) : 'غير محدد بعد'}
              </div>
            </div>

            <div className="flex items-center justify-between py-2 text-xs text-gray-400 border-t border-gray-50">
              <span>تاريخ ووقت الإنشاء:</span>
              <span>{new Date(order.createdAt).toLocaleString('ar-TN')}</span>
            </div>
          </div>
        </div>

        {/* Role-Specific Actions matching OrderDetailActivity.java */}
        <div className="space-y-3">
          {/* LIVREUR ACTIONS */}
          {isLivreur && (
            <>
              {order.status === 'pending' && !order.livreurId && (
                <button
                  disabled={updating}
                  onClick={() => handleUpdateStatus('accepted', true)}
                  className="w-full py-3.5 px-4 rounded-xl text-white font-bold bg-[#1E88E5] hover:bg-[#1565C0] active:scale-[0.99] shadow-sm transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-base"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>قبول الطلب</span>
                </button>
              )}

              {order.status === 'accepted' && order.livreurId === currentUser.uid && (
                <button
                  disabled={updating}
                  onClick={() => handleUpdateStatus('picked_up')}
                  className="w-full py-3.5 px-4 rounded-xl text-white font-bold bg-[#8E24AA] hover:bg-[#7b1fa2] active:scale-[0.99] shadow-sm transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-base"
                >
                  <Package className="w-5 h-5" />
                  <span>تم استلام الطرد</span>
                </button>
              )}

              {order.status === 'picked_up' && order.livreurId === currentUser.uid && (
                <button
                  disabled={updating}
                  onClick={() => handleUpdateStatus('delivered')}
                  className="w-full py-3.5 px-4 rounded-xl text-white font-bold bg-[#43A047] hover:bg-[#388e3c] active:scale-[0.99] shadow-sm transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-base"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>تم التوصيل ✅</span>
                </button>
              )}
            </>
          )}

          {/* CLIENT ACTIONS */}
          {isClient && order.status === 'pending' && (
            <button
              disabled={updating}
              onClick={() => handleUpdateStatus('cancelled')}
              className="w-full py-3.5 px-4 rounded-xl text-white font-bold bg-[#E53935] hover:bg-[#c62828] active:scale-[0.99] shadow-sm transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-base"
            >
              <XCircle className="w-5 h-5" />
              <span>إلغاء الطلب</span>
            </button>
          )}

          {/* ADMIN ACTIONS */}
          {isAdmin && order.status !== 'delivered' && order.status !== 'cancelled' && (
            <button
              disabled={updating}
              onClick={() => handleUpdateStatus('cancelled')}
              className="w-full py-3.5 px-4 rounded-xl text-white font-bold bg-[#E53935] hover:bg-[#c62828] active:scale-[0.99] shadow-sm transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-base"
            >
              <XCircle className="w-5 h-5" />
              <span>إلغاء الطلب (أدمن)</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
};
