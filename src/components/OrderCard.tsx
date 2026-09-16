import React from 'react';
import { Order } from '../types';
import { StatusBadge } from './StatusBadge';
import { Package, MapPin } from 'lucide-react';

interface Props {
  order: Order;
  onClick: (order: Order) => void;
}

export const OrderCard: React.FC<Props> = ({ order, onClick }) => {
  return (
    <div
      onClick={() => onClick(order)}
      className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-xs hover:shadow-md transition cursor-pointer active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1E88E5] flex items-center justify-center shrink-0">
            <Package className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">
            {order.description && order.description.trim() !== ''
              ? order.description
              : 'طلب توصيل'}
          </h3>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="text-sm text-gray-600 mb-3 flex items-start gap-1.5 leading-relaxed bg-gray-50/70 p-2.5 rounded-lg">
        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
        <div>
          <span className="font-medium text-gray-800">من:</span> {order.pickupAddress}
          <span className="mx-1.5 text-gray-400">←</span>
          <span className="font-medium text-gray-800">إلى:</span> {order.dropAddress}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          {new Date(order.createdAt).toLocaleTimeString('ar-TN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
        <div className="font-bold text-[#1E88E5] text-base">
          {order.price.toFixed(3)} د.ت
        </div>
      </div>
    </div>
  );
};
