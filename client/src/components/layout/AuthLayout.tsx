import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import Toast from '../common/Toast';

const AuthLayout: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400">
            Network
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Connect, Collaborate, Grow
          </p>
        </div>
        <Outlet />
      </div>
      <Toast />
    </div>
  );
};

export default AuthLayout;
