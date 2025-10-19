import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Notification } from '@shared/types';
import { notificationsService } from '../../services/notificationsService';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  hasMore: true,
  page: 1,
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ page = 1 }: { page?: number }, { rejectWithValue }) => {
    try {
      const response = await notificationsService.getNotifications(page);
      return { notifications: response.items, hasMore: response.hasMore, page };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await notificationsService.markAsRead(notificationId);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationsService.markAllAsRead();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    updateUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.page === 1) {
          state.notifications = action.payload.notifications;
        } else {
          state.notifications.push(...action.payload.notifications);
        }
        state.hasMore = action.payload.hasMore;
        state.page = action.payload.page;
        state.unreadCount = action.payload.notifications.filter(n => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // Mark all as read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map(n => ({ ...n, read: true }));
        state.unreadCount = 0;
      });
  },
});

export const { clearError, addNotification, updateUnreadCount } = notificationsSlice.actions;
export default notificationsSlice.reducer;
