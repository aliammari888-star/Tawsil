import React from 'react';
import { OrderStatus } from '../types';

interface Props {
  status: OrderStatus;
  className?: string;
}

export const StatusBadge: React.FC<Props> = ({ status, className = '' }) => {
  const getBadgeConfig = (st: OrderStatus) => {
    switch (st) {
      case 'accepted':
        return {
          label: 'تم القبول',
          bg: 'bg-[#1E88E5]',
          text: 'text-white',
        };
      case 'picked_up':
        return {
          label: 'تم الاستلام',
          bg: 'bg-[#8E24AA]',
          text: 'text-white',
        };
      case 'delivered':
        return {
          label: 'تم التوصيل',
          bg: 'bg-[#43A047]',
          text: 'text-white',
        };
      case 'cancelled':
        return {
          label: 'ملغى',
          bg: 'bg-[#E53935]',
          text: 'text-white',
        };
      case 'pending':
      default:
        return {
          label: 'في الانتظار',
          bg: 'bg-[#FFA000]',
          text: 'text-white',
        };
    }
  };

  const config = getBadgeConfig(status);

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold shadow-xs ${config.bg} ${config.text} ${className}`}
    >
      {config.label}
    </span>
  );
};
