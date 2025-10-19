import { FC } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFoundPage: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400">404</h1>
        <h2 className="text-3xl font-semibold mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary">Go back home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
