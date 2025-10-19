import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Toast from '../common/Toast';
import { useAppSelector } from '../../hooks/redux';

const MainLayout: FC = () => {
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
      <Toast />
    </div>
  );
};

export default MainLayout;
