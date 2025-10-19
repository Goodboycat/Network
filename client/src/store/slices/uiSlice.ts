import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark' | 'system';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  modals: Record<string, boolean>;
  toasts: ToastMessage[];
  isOnline: boolean;
}

const initialState: UIState = {
  theme: (localStorage.getItem('network_theme') as Theme) || 'system',
  sidebarOpen: true,
  modals: {},
  toasts: [],
  isOnline: navigator.onLine,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      localStorage.setItem('network_theme', action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = false;
    },
    addToast: (state, action: PayloadAction<Omit<ToastMessage, 'id'>>) => {
      const id = Date.now().toString();
      state.toasts.push({ ...action.payload, id });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  addToast,
  removeToast,
  setOnlineStatus,
} = uiSlice.actions;

export default uiSlice.reducer;
