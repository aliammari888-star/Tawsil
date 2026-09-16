import React, { useState } from 'react';
import { StoreService } from '../services/store';
import { User, UserRole } from '../types';
import { Truck, User as UserIcon, Phone, Mail, Lock, Bike, AlertCircle } from 'lucide-react';

interface Props {
  onSuccess: (user: User) => void;
  onGoLogin: () => void;
}

export const RegisterView: React.FC<Props> = ({ onSuccess, onGoLogin }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      setError('عمر الحقول باش تكمل');
      return;
    }

    if (password.length < 6) {
      setError('كلمة السر لازمها 6 حروف على الأقل');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const user = await StoreService.register(name, phone, email, password, role);
      onSuccess(user);
    } catch (err: any) {
      setError('فشل إنشاء الحساب: ' + (err?.message || 'حدث خطأ'));
    } finally {
      setLoading(false);
    }
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
            إنشاء حساب
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
                الاسم الكامل
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <UserIcon className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="محمد علي"
                  className="block w-full pr-10 pl-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                رقم الهاتف
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="20 123 456"
                  dir="ltr"
                  className="block w-full pr-10 pl-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent text-sm transition text-right"
                />
              </div>
            </div>

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
                  placeholder="6 حروف على الأقل"
                  dir="ltr"
                  className="block w-full pr-10 pl-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                شكون إنت؟
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer font-semibold text-sm transition ${
                    role === 'client'
                      ? 'border-[#1E88E5] bg-blue-50/70 text-[#1E88E5]'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="client"
                    checked={role === 'client'}
                    onChange={() => setRole('client')}
                    className="sr-only"
                  />
                  <UserIcon className="w-4 h-4" />
                  <span>عميل</span>
                </label>

                <label
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer font-semibold text-sm transition ${
                    role === 'livreur'
                      ? 'border-[#1E88E5] bg-blue-50/70 text-[#1E88E5]'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="livreur"
                    checked={role === 'livreur'}
                    onChange={() => setRole('livreur')}
                    className="sr-only"
                  />
                  <Bike className="w-4 h-4" />
                  <span>موصل (Livreur)</span>
                </label>
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
                'إنشاء حساب'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onGoLogin}
              className="text-sm font-semibold text-[#1E88E5] hover:underline cursor-pointer"
            >
              عندك حساب؟ سجل الدخول
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
