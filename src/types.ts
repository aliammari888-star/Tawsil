export type UserRole = 'client' | 'livreur' | 'admin';

export type OrderStatus = 'pending' | 'accepted' | 'picked_up' | 'delivered' | 'cancelled';

export interface User {
  uid: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  createdAt: number;
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  livreurId?: string | null;
  livreurName?: string | null;
  pickupAddress: string;
  dropAddress: string;
  description?: string;
  price: number;
  status: OrderStatus;
  createdAt: number;
}

export type ScreenType =
  | { type: 'splash' }
  | { type: 'login' }
  | { type: 'register' }
  | { type: 'client_home' }
  | { type: 'create_order' }
  | { type: 'livreur_home' }
  | { type: 'admin_home' }
  | { type: 'order_detail'; orderId: string };
