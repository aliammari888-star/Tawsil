import { User, Order, OrderStatus, UserRole } from '../types';

const USERS_KEY = 'tawsil_users_v1';
const ORDERS_KEY = 'tawsil_orders_v1';
const CURRENT_USER_KEY = 'tawsil_current_user_v1';

// Seed sample users representing each role for immediate testing
const INITIAL_USERS: User[] = [
  {
    uid: 'user_client_1',
    name: 'أحمد بن علي',
    phone: '21 345 678',
    email: 'client@tawsil.tn',
    role: 'client',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    uid: 'user_livreur_1',
    name: 'محمد الطرابلسي',
    phone: '55 123 456',
    email: 'livreur@tawsil.tn',
    role: 'livreur',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    uid: 'user_admin_1',
    name: 'إدارة توصيل',
    phone: '71 999 888',
    email: 'admin@tawsil.tn',
    role: 'admin',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
  },
];

// Seed sample orders matching Tunisian delivery scenarios
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_101',
    clientId: 'user_client_1',
    clientName: 'أحمد بن علي',
    clientPhone: '21 345 678',
    livreurId: null,
    livreurName: null,
    pickupAddress: 'تونس العاصمة - شارع الحبيب بورقيبة',
    dropAddress: 'حي النصر 2 - أريانة',
    description: 'وثائق رسمية ومستندات في ظرف مغلق',
    price: 8.5,
    status: 'pending',
    createdAt: Date.now() - 1000 * 60 * 25,
  },
  {
    id: 'ord_102',
    clientId: 'user_client_1',
    clientName: 'أحمد بن علي',
    clientPhone: '21 345 678',
    livreurId: 'user_livreur_1',
    livreurName: 'محمد الطرابلسي',
    pickupAddress: 'المرسى - بجانب المقهى',
    dropAddress: 'سكرة - إقامة الياسمين',
    description: 'علبة هدايا صغيرة وحلويات',
    price: 12.0,
    status: 'accepted',
    createdAt: Date.now() - 1000 * 60 * 90,
  },
  {
    id: 'ord_103',
    clientId: 'user_client_1',
    clientName: 'أحمد بن علي',
    clientPhone: '21 345 678',
    livreurId: 'user_livreur_1',
    livreurName: 'محمد الطرابلسي',
    pickupAddress: 'المنزه 6 - صيدلية الأمل',
    dropAddress: 'العوينة - قرب كارفور ماركت',
    description: 'أدوية ومستلزمات صحية',
    price: 7.0,
    status: 'picked_up',
    createdAt: Date.now() - 1000 * 60 * 180,
  },
  {
    id: 'ord_104',
    clientId: 'user_client_1',
    clientName: 'أحمد بن علي',
    clientPhone: '21 345 678',
    livreurId: 'user_livreur_1',
    livreurName: 'محمد الطرابلسي',
    pickupAddress: 'المركز العمراني الشمالي',
    dropAddress: 'باردو - شارع 20 مارس',
    description: 'شاحن حاسوب محمول',
    price: 9.5,
    status: 'delivered',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
];

function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

function saveUsers(users: User[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
}

function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ORDERS;
  }
}

function saveOrders(orders: Order[]) {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders', e);
  }
}

export const StoreService = {
  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null) {
    try {
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch (e) {
      console.error('Failed to set current user', e);
    }
  },

  async login(email: string, _pass: string): Promise<User> {
    // Artificial latency matching Android network call
    await new Promise((r) => setTimeout(r, 400));
    const users = getStoredUsers();
    const cleanEmail = email.trim().toLowerCase();
    let found = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      // If user doesn't exist, create automatically or infer from email
      const role: UserRole = cleanEmail.includes('admin')
        ? 'admin'
        : cleanEmail.includes('livreur')
        ? 'livreur'
        : 'client';
      const name = email.split('@')[0];
      found = {
        uid: 'user_' + Date.now(),
        name: name,
        email: email,
        phone: '21 000 000',
        role: role,
        createdAt: Date.now(),
      };
      users.push(found);
      saveUsers(users);
    }

    this.setCurrentUser(found);
    return found;
  },

  async register(
    name: string,
    phone: string,
    email: string,
    _pass: string,
    role: UserRole
  ): Promise<User> {
    await new Promise((r) => setTimeout(r, 450));
    const users = getStoredUsers();
    const cleanEmail = email.trim().toLowerCase();

    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      this.setCurrentUser(existing);
      return existing;
    }

    const newUser: User = {
      uid: 'user_' + Date.now(),
      name,
      phone,
      email,
      role,
      createdAt: Date.now(),
    };

    users.push(newUser);
    saveUsers(users);
    this.setCurrentUser(newUser);
    return newUser;
  },

  signOut(): void {
    this.setCurrentUser(null);
  },

  async getClientOrders(clientId: string): Promise<Order[]> {
    await new Promise((r) => setTimeout(r, 200));
    const orders = getStoredOrders();
    return orders
      .filter((o) => o.clientId === clientId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  async getAvailableOrders(): Promise<Order[]> {
    await new Promise((r) => setTimeout(r, 200));
    const orders = getStoredOrders();
    return orders
      .filter((o) => o.status === 'pending')
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  async getLivreurOrders(livreurId: string): Promise<Order[]> {
    await new Promise((r) => setTimeout(r, 200));
    const orders = getStoredOrders();
    return orders
      .filter((o) => o.livreurId === livreurId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  async getAllOrders(): Promise<Order[]> {
    await new Promise((r) => setTimeout(r, 200));
    const orders = getStoredOrders();
    return [...orders].sort((a, b) => b.createdAt - a.createdAt);
  },

  async getAllUsers(): Promise<User[]> {
    await new Promise((r) => setTimeout(r, 200));
    return [...getStoredUsers()].sort((a, b) => b.createdAt - a.createdAt);
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    await new Promise((r) => setTimeout(r, 150));
    const orders = getStoredOrders();
    return orders.find((o) => o.id === orderId) || null;
  },

  async createOrder(data: {
    clientId: string;
    clientName: string;
    clientPhone: string;
    pickupAddress: string;
    dropAddress: string;
    description: string;
    price: number;
  }): Promise<Order> {
    await new Promise((r) => setTimeout(r, 350));
    const orders = getStoredOrders();
    const newOrder: Order = {
      id: 'ord_' + Math.floor(Math.random() * 90000 + 10000),
      clientId: data.clientId,
      clientName: data.clientName,
      clientPhone: data.clientPhone,
      pickupAddress: data.pickupAddress,
      dropAddress: data.dropAddress,
      description: data.description,
      price: data.price,
      status: 'pending',
      livreurId: null,
      livreurName: null,
      createdAt: Date.now(),
    };
    orders.unshift(newOrder);
    saveOrders(orders);
    return newOrder;
  },

  async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    livreurId?: string,
    livreurName?: string
  ): Promise<Order> {
    await new Promise((r) => setTimeout(r, 300));
    const orders = getStoredOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) {
      throw new Error('الطلب غير موجود');
    }

    const updated = { ...orders[idx], status: newStatus };
    if (livreurId !== undefined) {
      updated.livreurId = livreurId;
    }
    if (livreurName !== undefined) {
      updated.livreurName = livreurName;
    }

    orders[idx] = updated;
    saveOrders(orders);
    return updated;
  },
};
