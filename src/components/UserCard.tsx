import React from 'react';
import { User } from '../types';
import { User as UserIcon, Phone, Mail, Shield, Bike } from 'lucide-react';

interface Props {
  user: User;
}

export const UserCard: React.FC<Props> = ({ user }) => {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          label: 'أدمن',
          bg: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: Shield,
        };
      case 'livreur':
        return {
          label: 'موصل',
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: Bike,
        };
      case 'client':
      default:
        return {
          label: 'عميل',
          bg: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: UserIcon,
        };
    }
  };

  const badge = getRoleBadge(user.role);
  const Icon = badge.icon;

  return (
    <div className="bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-xs flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-base">{user.name}</h4>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              {user.email}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              {user.phone}
            </span>
          </div>
        </div>
      </div>

      <span
        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${badge.bg}`}
      >
        {badge.label}
      </span>
    </div>
  );
};
