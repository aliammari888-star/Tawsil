import React, { useState } from 'react';
import { User, Order, ScreenType } from './types';
import { StoreService } from './services/store';
import { SplashView } from './components/SplashView';
import { LoginView } from './components/LoginView';
import { RegisterView } from './components/RegisterView';
import { ClientHomeView } from './components/ClientHomeView';
import { CreateOrderView } from './components/CreateOrderView';
import { LivreurHomeView } from './components/LivreurHomeView';
import { AdminHomeView } from './components/AdminHomeView';
import { OrderDetailView } from './components/OrderDetailView';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => StoreService.getCurrentUser());
  const [screen, setScreen] = useState<ScreenType>({ type: 'splash' });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleSplashRoute = (
    target: 'login' | 'client_home' | 'livreur_home' | 'admin_home',
    user?: User
  ) => {
    if (user) {
      setCurrentUser(user);
    }
    setScreen({ type: target });
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setScreen({ type: 'admin_home' });
    } else if (user.role === 'livreur') {
      setScreen({ type: 'livreur_home' });
    } else {
      setScreen({ type: 'client_home' });
    }
  };

  const handleLogout = () => {
    StoreService.signOut();
    setCurrentUser(null);
    setSelectedOrder(null);
    setScreen({ type: 'login' });
  };

  const getReturnHome = (): ScreenType => {
    if (!currentUser) return { type: 'login' };
    if (currentUser.role === 'admin') return { type: 'admin_home' };
    if (currentUser.role === 'livreur') return { type: 'livreur_home' };
    return { type: 'client_home' };
  };

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setScreen({ type: 'order_detail', orderId: order.id });
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-[#212121]">
      {screen.type === 'splash' && (
        <SplashView onRoute={handleSplashRoute} />
      )}

      {screen.type === 'login' && (
        <LoginView
          onSuccess={handleLoginSuccess}
          onGoRegister={() => setScreen({ type: 'register' })}
        />
      )}

      {screen.type === 'register' && (
        <RegisterView
          onSuccess={handleLoginSuccess}
          onGoLogin={() => setScreen({ type: 'login' })}
        />
      )}

      {screen.type === 'client_home' && currentUser && (
        <ClientHomeView
          user={currentUser}
          onNewOrder={() => setScreen({ type: 'create_order' })}
          onSelectOrder={handleSelectOrder}
          onLogout={handleLogout}
        />
      )}

      {screen.type === 'create_order' && currentUser && (
        <CreateOrderView
          user={currentUser}
          onBack={() => setScreen({ type: 'client_home' })}
          onCreated={(order) => {
            setSelectedOrder(order);
            setScreen({ type: 'client_home' });
          }}
        />
      )}

      {screen.type === 'livreur_home' && currentUser && (
        <LivreurHomeView
          user={currentUser}
          onSelectOrder={handleSelectOrder}
          onLogout={handleLogout}
        />
      )}

      {screen.type === 'admin_home' && currentUser && (
        <AdminHomeView
          user={currentUser}
          onSelectOrder={handleSelectOrder}
          onLogout={handleLogout}
        />
      )}

      {screen.type === 'order_detail' && currentUser && selectedOrder && (
        <OrderDetailView
          order={selectedOrder}
          currentUser={currentUser}
          onBack={() => setScreen(getReturnHome())}
          onOrderUpdated={(updated) => setSelectedOrder(updated)}
        />
      )}
    </div>
  );
};

export default App;
