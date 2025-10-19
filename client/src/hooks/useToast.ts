import { useCallback } from 'react';
import { useAppDispatch } from './redux';
import { addToast, removeToast } from '../store/slices/uiSlice';
import { TOAST_DURATION } from '@shared/constants';

export const useToast = () => {
  const dispatch = useAppDispatch();

  const showToast = useCallback(
    (
      type: 'success' | 'error' | 'info' | 'warning',
      message: string,
      duration: number = TOAST_DURATION
    ) => {
      const toast = { type, message, duration };
      dispatch(addToast(toast));

      // Auto remove toast after duration
      setTimeout(() => {
        // We don't have the ID here, so we'll use a different approach in the component
      }, duration);
    },
    [dispatch]
  );

  const success = useCallback(
    (message: string, duration?: number) => {
      showToast('success', message, duration);
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      showToast('error', message, duration);
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      showToast('info', message, duration);
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      showToast('warning', message, duration);
    },
    [showToast]
  );

  const dismiss = useCallback(
    (id: string) => {
      dispatch(removeToast(id));
    },
    [dispatch]
  );

  return {
    success,
    error,
    info,
    warning,
    dismiss,
  };
};
