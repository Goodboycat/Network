import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiCompass, FiMail, FiBell, FiUser, FiSettings } from 'react-icons/fi';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/explore', icon: FiCompass, label: 'Explore' },
    { path: '/messages', icon: FiMail, label: 'Messages' },
    { path: '/notifications', icon: FiBell, label: 'Notifications' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-dark-700 min-h-screen p-4 hidden lg:block">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Trending Section */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 px-4 mb-3">
          TRENDING
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg cursor-pointer transition-colors"
            >
              <p className="text-sm font-semibold">#{`Trending${i}`}</p>
              <p className="text-xs text-gray-500">1.2K posts</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
