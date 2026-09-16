import React, { useEffect } from 'react';
import { StoreService } from '../services/store';
import { User } from '../types';
import { Truck } from 'lucide-react';

interface Props {
  onRoute: (target: 'login' | 'client_home' | 'livreur_home' | 'admin_home', user?: User) => void;
}

export const SplashView: React.FC<Props> = ({ onRoute }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const user = StoreService.getCurrentUser();
      if (!user) {
        onRoute('login');
        return;
      }

      if (user.role === 'admin') {
        onRoute('admin_home', user);
      } else if (user.role === 'livreur') {
        onRoute('livreur_home', user);
      } else {
        onRoute('client_home', user);
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [onRoute]);

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 rounded-3xl bg-[#1E88E5] text-white flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6 animate-pulse">
        <Truck className="w-14 h-14" />
      </div>

      <h1 className="text-4xl font-extrabold text-[#1E88E5] tracking-tight mb-2">
        Tawsil
      </h1>
      <p className="text-gray-500 text-lg font-medium">
        توصيل سريع وموثوق
      </p>

      <div className="mt-12 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#1E88E5]/30 border-t-[#1E88E5] rounded-full animate-spin"></div>
      </div>
    </div>
  );
};
