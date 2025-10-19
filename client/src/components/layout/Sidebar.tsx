import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BellIcon,
  ChatBubbleLeftIcon,
  UserIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  BellIcon as BellIconSolid,
  ChatBubbleLeftIcon as ChatBubbleLeftIconSolid,
  UserIcon as UserIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from '@heroicons/react/24/solid';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { openModal } from '../../store/slices/uiSlice';
import clsx from 'clsx';

const Sidebar: FC = () => {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const { user } = useAppSelector((state) => state.auth);
  const { unreadCount: notificationCount } = useAppSelector((state) => state.notifications);
  const { unreadCount: messageCount } = useAppSelector((state) => state.messages);

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: HomeIcon,
      activeIcon: HomeIconSolid,
    },
    {
      name: 'Explore',
      path: '/explore',
      icon: MagnifyingGlassIcon,
      activeIcon: MagnifyingGlassIconSolid,
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: BellIcon,
      activeIcon: BellIconSolid,
      badge: notificationCount,
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: ChatBubbleLeftIcon,
      activeIcon: ChatBubbleLeftIconSolid,
      badge: messageCount,
    },
    {
      name: 'Profile',
      path: `/profile/${user?.username}`,
      icon: UserIcon,
      activeIcon: UserIconSolid,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Cog6ToothIcon,
      activeIcon: Cog6ToothIconSolid,
    },
  ];

  return (
    <aside
      className={clsx(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      <nav className="flex flex-col h-full p-4">
        <div className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-4 px-4 py-3 rounded-lg transition-colors relative',
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    {isActive ? (
                      <item.activeIcon className="w-6 h-6" />
                    ) : (
                      <item.icon className="w-6 h-6" />
                    )}
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </div>
                  {sidebarOpen && <span className="font-medium">{item.name}</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Create Post Button */}
        <button
          onClick={() => dispatch(openModal('createPost'))}
          className={clsx(
            'flex items-center gap-4 px-4 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors',
            !sidebarOpen && 'justify-center'
          )}
        >
          <PlusCircleIcon className="w-6 h-6" />
          {sidebarOpen && <span>Create Post</span>}
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
