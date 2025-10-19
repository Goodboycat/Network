import { FC, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { removeToast } from '../../store/slices/uiSlice';

const Toast: FC = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.ui.toasts);

  const icons = {
    success: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
    error: <XCircleIcon className="w-5 h-5 text-red-500" />,
    warning: <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />,
    info: <InformationCircleIcon className="w-5 h-5 text-blue-500" />,
  };

  const handleRemove = (id: string) => {
    dispatch(removeToast(id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          icon={icons[toast.type]}
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
};

interface ToastItemProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  icon: React.ReactNode;
  onRemove: (id: string) => void;
}

const ToastItem: FC<ToastItemProps> = ({
  id,
  type,
  message,
  duration = 5000,
  icon,
  onRemove,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  const bgColors = {
    success: 'bg-white dark:bg-gray-800 border-green-500',
    error: 'bg-white dark:bg-gray-800 border-red-500',
    warning: 'bg-white dark:bg-gray-800 border-yellow-500',
    info: 'bg-white dark:bg-gray-800 border-blue-500',
  };

  return (
    <Transition
      show={true}
      appear={true}
      enter="transform transition duration-300"
      enterFrom="translate-x-full opacity-0"
      enterTo="translate-x-0 opacity-100"
      leave="transform transition duration-200"
      leaveFrom="translate-x-0 opacity-100"
      leaveTo="translate-x-full opacity-0"
    >
      <div
        className={`flex items-start gap-3 p-4 rounded-lg shadow-lg border-l-4 ${bgColors[type]}`}
      >
        <div className="flex-shrink-0">{icon}</div>
        <p className="flex-1 text-sm text-gray-900 dark:text-gray-100">{message}</p>
        <button
          onClick={() => onRemove(id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </Transition>
  );
};

export default Toast;
