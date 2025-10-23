import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { logout } from '../../store/authSlice';
import { FiBell, FiMail, FiLogOut } from 'react-icons/fi';

export default function Header() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">Network</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <input
              type="search"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-full bg-gray-100 dark:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <Link
              to="/messages"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors relative"
            >
              <FiMail className="w-6 h-6" />
            </Link>

            <Link
              to="/notifications"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors relative"
            >
              <FiBell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold">
                  {user?.displayName?.charAt(0) || 'U'}
                </div>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link
                  to={`/profile/${user?.username}`}
                  className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                >
                  View Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors text-red-600 flex items-center gap-2"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
