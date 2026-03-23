import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletState {
  address: string | null;
  network: 'mainnet' | 'devnet' | 'testnet';
  isConnected: boolean;
  
  // Actions
  setAddress: (address: string | null) => void;
  setNetwork: (network: 'mainnet' | 'devnet' | 'testnet') => void;
  setConnected: (connected: boolean) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      address: null,
      network: 'devnet',
      isConnected: false,
      
      setAddress: (address) => set({ address }),
      setNetwork: (network) => set({ network }),
      setConnected: (isConnected) => set({ isConnected }),
      disconnect: () => set({ address: null, isConnected: false }),
    }),
    {
      name: 'suibox-wallet',
    }
  )
);

// UI状态管理
interface UIState {
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  
  // Actions
  toggleSidebar: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      theme: 'dark',
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'suibox-ui',
    }
  )
);

// 用户偏好设置
interface UserPreferences {
  language: 'en' | 'zh' | 'ko' | 'es';
  currency: 'SUI' | 'BOX' | 'USD';
  notifications: boolean;
  
  // Actions
  setLanguage: (lang: 'en' | 'zh' | 'ko' | 'es') => void;
  setCurrency: (currency: 'SUI' | 'BOX' | 'USD') => void;
  toggleNotifications: () => void;
}

export const usePreferences = create<UserPreferences>()(
  persist(
    (set) => ({
      language: 'en',
      currency: 'SUI',
      notifications: true,
      
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
    }),
    {
      name: 'suibox-preferences',
    }
  )
);

// NFT收藏夹
interface FavoritesState {
  favoriteIds: number[];
  
  // Actions
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      
      addFavorite: (id) => set((state) => ({
        favoriteIds: [...state.favoriteIds, id]
      })),
      removeFavorite: (id) => set((state) => ({
        favoriteIds: state.favoriteIds.filter(fid => fid !== id)
      })),
      isFavorite: (id) => get().favoriteIds.includes(id),
    }),
    {
      name: 'suibox-favorites',
    }
  )
);
