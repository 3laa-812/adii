import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  balance: number;
  vehicles: Vehicle[];
  notificationsPrefs: {
    pushEnabled: boolean;
    smsEnabled: boolean;
  };
}

interface Vehicle {
  id: string;
  plate: string;
  rfidTag: string;
  image?: string;
  default: boolean;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  updateBalance: (balance: number) => void;
}

interface LoginCredentials {
  phoneOrEmail: string;
  password?: string;
  otp?: string;
}

interface SignupData {
  phone: string;
  name: string;
  email?: string;
  password?: string;
  otp: string;
}

// Mock API calls - replace with real API endpoints
const mockApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string; refreshToken: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    return {
      user: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        phone: '+201234567890',
        balance: 250.50,
        vehicles: [
          {
            id: '1',
            plate: 'ABC 123',
            rfidTag: 'RFID001',
            default: true,
          }
        ],
        notificationsPrefs: {
          pushEnabled: true,
          smsEnabled: true,
        }
      },
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
    };
  },
  
  signup: async (userData: SignupData): Promise<{ user: User; token: string; refreshToken: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      user: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        balance: 0,
        vehicles: [],
        notificationsPrefs: {
          pushEnabled: true,
          smsEnabled: true,
        }
      },
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
    };
  }
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await mockApi.login(credentials);
          
          // Store tokens in httpOnly cookies (simulated)
          Cookies.set('token', response.token, { 
            expires: 7, // 7 days
            secure: true,
            sameSite: 'strict' 
          });
          Cookies.set('refreshToken', response.refreshToken, { 
            expires: 30, // 30 days
            secure: true,
            sameSite: 'strict' 
          });
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      signup: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await mockApi.signup(userData);
          
          Cookies.set('token', response.token, { 
            expires: 7,
            secure: true,
            sameSite: 'strict' 
          });
          Cookies.set('refreshToken', response.refreshToken, { 
            expires: 30,
            secure: true,
            sameSite: 'strict' 
          });
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      
      setUser: (user) => {
        set({ user });
      },
      
      updateBalance: (balance) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, balance } });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        // Validate UUID format and clear invalid data
        if (state?.user?.id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(state.user.id)) {
          console.warn('Invalid user ID format detected, clearing auth data');
          localStorage.removeItem('auth-storage');
          Cookies.remove('token');
          Cookies.remove('refreshToken');
          return {
            user: null,
            token: null,
            isAuthenticated: false
          };
        }
      },
    }
  )
);