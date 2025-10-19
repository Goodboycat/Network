import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from './redux';
import { addMessage } from '../store/slices/messagesSlice';
import { addNotification } from '../store/slices/notificationsSlice';
import { SocketEvent } from '@shared/types';
import { SOCKET_URL, STORAGE_KEYS } from '@shared/constants';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) return;

    // Initialize socket connection
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    // Connection events
    socket.on(SocketEvent.CONNECT, () => {
      console.log('Socket connected');
    });

    socket.on(SocketEvent.DISCONNECT, () => {
      console.log('Socket disconnected');
    });

    socket.on(SocketEvent.ERROR, (error: any) => {
      console.error('Socket error:', error);
    });

    // Message events
    socket.on(SocketEvent.MESSAGE_RECEIVED, (message: any) => {
      dispatch(addMessage(message));
    });

    // Notification events
    socket.on(SocketEvent.NOTIFICATION_RECEIVED, (notification: any) => {
      dispatch(addNotification(notification));
    });

    // User events
    socket.on(SocketEvent.USER_ONLINE, (data: any) => {
      console.log('User online:', data);
    });

    socket.on(SocketEvent.USER_OFFLINE, (data: any) => {
      console.log('User offline:', data);
    });

    // Cleanup
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, dispatch]);

  const emit = (event: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event: string, callback: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event: string, callback?: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return {
    socket: socketRef.current,
    emit,
    on,
    off,
    isConnected: socketRef.current?.connected || false,
  };
};
