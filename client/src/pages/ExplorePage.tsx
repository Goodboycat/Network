import { FC, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDebounce } from '../hooks/useDebounce';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ExplorePage: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'posts' | 'hashtags'>('all');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'users', label: 'Users' },
    { id: 'posts', label: 'Posts' },
    { id: 'hashtags', label: 'Hashtags' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Explore</h1>

      <div className="card p-6 mb-6">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users, posts, hashtags..."
          icon={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
        />
      </div>

      <div className="card">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {searchQuery ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Searching for "{debouncedSearch}"...
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Enter a search term to find users, posts, or hashtags
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
