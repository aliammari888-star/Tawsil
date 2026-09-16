import React, { useState } from 'react';
import { StoreService } from '../services/store';
import { User } from '../types';
import { Truck, Mail, Lock, AlertCircle, Sparkles } from 'lucide-react';

interface Props {
  onSuccess: (user: User) => void;
  onGoRegister: () => void;
}

export const LoginView: React.FC<Props> = ({ onSuccess, onGoRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('عمر الحقول باش تكمل');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const user = await StoreService.login(email, password);
      onSuccess(user);
    } catch (err: any) {
      setError('فشل تسجيل الدخول: ' + (err?.message || 'تأكد من البيانات'));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('123456');
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1E88E5] text-white shadow-md shadow-blue-500/20 mb-3">
          <Truck className="w-9 h-9" />
        </div>
        <h2 className="text-3xl font-extrabold text-[#1E88E5]">Tawsil</h2>
        <p className="text-gray-500 text-sm mt-1">توصيل سريع وموثوق</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-gray-100 sm:px-10">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            تسجيل الدخول
          </h3>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm flex items-center gap-2 border border-red-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  dir="ltr"
                  className="block w-full pr-10 pl-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                كلمة السر
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  className="block w-full pr-10 pl-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent text-sm transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl text-white font-bold bg-[#1E88E5] hover:bg-[#1565C0] active:scale-[0.99] shadow-sm transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>

          {/* Quick Demo Accounts for testing */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2.5">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                حسابات تجريبية سريعة:
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('client@tawsil.tn')}
                className="text-xs py-1.5 px-2 rounded-lg bg-blue-50 text-[#1E88E5] font-semibold border border-blue-100 hover:bg-blue-100 cursor-pointer transition text-center"
              >
                👤 عميل
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('livreur@tawsil.tn')}
                className="text-xs py-1.5 px-2 rounded-lg bg-amber-50 text-amber-800 font-semibold border border-amber-100 hover:bg-amber-100 cursor-pointer transition text-center"
              >
                🛵 موصل
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@tawsil.tn')}
                className="text-xs py-1.5 px-2 rounded-lg bg-purple-50 text-purple-800 font-semibold border border-purple-100 hover:bg-purple-100 cursor-pointer transition text-center"
              >
                👑 أدمن
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onGoRegister}
              className="text-sm font-semibold text-[#1E88E5] hover:underline cursor-pointer"
            >
              ما عندكش حساب؟ سجل توا
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
