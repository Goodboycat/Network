import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  BellIcon,
  ChatBubbleLeftIcon,
  Bars3Icon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import Avatar from '../common/Avatar';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { useTheme } from '../../hooks/useTheme';
import clsx from 'clsx';

const Header: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { unreadCount: notificationCount } = useAppSelector((state) => state.notifications);
  const { unreadCount: messageCount } = useAppSelector((state) => state.messages);
  const { theme, changeTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const themeIcons = {
    light: <SunIcon className="w-5 h-5" />,
    dark: <MoonIcon className="w-5 h-5" />,
    system: <ComputerDesktopIcon className="w-5 h-5" />,
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              Network
            </Link>
          </div>

          {/* Center - Search */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users, posts, hashtags..."
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </form>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme Switcher */}
            <Menu as="div" className="relative">
              <Menu.Button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
                {themeIcons[theme]}
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => changeTheme('light')}
                      className={clsx(
                        'w-full px-4 py-2 text-left flex items-center gap-2',
                        active && 'bg-gray-100 dark:bg-gray-700',
                        theme === 'light' && 'text-primary-600'
                      )}
                    >
                      <SunIcon className="w-5 h-5" />
                      Light
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => changeTheme('dark')}
                      className={clsx(
                        'w-full px-4 py-2 text-left flex items-center gap-2',
                        active && 'bg-gray-100 dark:bg-gray-700',
                        theme === 'dark' && 'text-primary-600'
                      )}
                    >
                      <MoonIcon className="w-5 h-5" />
                      Dark
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => changeTheme('system')}
                      className={clsx(
                        'w-full px-4 py-2 text-left flex items-center gap-2',
                        active && 'bg-gray-100 dark:bg-gray-700',
                        theme === 'system' && 'text-primary-600'
                      )}
                    >
                      <ComputerDesktopIcon className="w-5 h-5" />
                      System
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>

            {/* Messages */}
            <Link
              to="/messages"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            >
              <ChatBubbleLeftIcon className="w-6 h-6" />
              {messageCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {messageCount > 9 ? '9+' : messageCount}
                </span>
              )}
            </Link>

            {/* Notifications */}
            <Link
              to="/notifications"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            >
              <BellIcon className="w-6 h-6" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Link>

            {/* Profile Menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2">
                <Avatar src={user?.avatar} name={user?.displayName} size="sm" />
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 focus:outline-none">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.displayName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">@{user?.username}</p>
                </div>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to={`/profile/${user?.username}`}
                      className={clsx(
                        'block px-4 py-2 text-sm',
                        active && 'bg-gray-100 dark:bg-gray-700'
                      )}
                    >
                      Your Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/settings"
                      className={clsx(
                        'block px-4 py-2 text-sm',
                        active && 'bg-gray-100 dark:bg-gray-700'
                      )}
                    >
                      Settings
                    </Link>
                  )}
                </Menu.Item>
                <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={clsx(
                          'block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400',
                          active && 'bg-gray-100 dark:bg-gray-700'
                        )}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
