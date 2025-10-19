import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchNotifications, markAllAsRead } from '../store/slices/notificationsSlice';
import { formatDistanceToNow } from 'date-fns';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import { BellIcon } from '@heroicons/react/24/outline';

const NotificationsPage: FC = () => {
  const dispatch = useAppDispatch();
  const { notifications, isLoading, unreadCount } = useAppSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchNotifications({ page: 1 }));
  }, [dispatch]);

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  if (isLoading && notifications.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <div className="card">
        {notifications.length === 0 ? (
          <div className="text-center py-12 px-6">
            <BellIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  !notification.read ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
