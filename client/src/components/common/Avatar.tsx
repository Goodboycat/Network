import { FC } from 'react';
import clsx from 'clsx';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  online?: boolean;
  className?: string;
}

const Avatar: FC<AvatarProps> = ({
  src,
  alt,
  name = '',
  size = 'md',
  online,
  className,
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-24 h-24 text-3xl',
  };

  const onlineIndicatorSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className={clsx('relative inline-block', className)}>
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className={clsx(
            'rounded-full object-cover ring-2 ring-white dark:ring-gray-800',
            sizeClasses[size]
          )}
        />
      ) : (
        <div
          className={clsx(
            'rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold ring-2 ring-white dark:ring-gray-800',
            sizeClasses[size]
          )}
        >
          {getInitials(name)}
        </div>
      )}
      {online && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800',
            onlineIndicatorSizes[size]
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
