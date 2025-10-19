import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { MapPinIcon, LinkIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import { useAppSelector } from '../hooks/redux';

const ProfilePage: FC = () => {
  const { username } = useParams();
  const { user } = useAppSelector((state) => state.auth);
  
  const isOwnProfile = user?.username === username;

  // Mock user data for now
  const profileUser = {
    id: '1',
    username: username || '',
    displayName: 'John Doe',
    avatar: '',
    coverImage: '',
    bio: 'Software developer | Tech enthusiast | Coffee lover ☕',
    location: 'San Francisco, CA',
    website: 'https://example.com',
    createdAt: new Date('2023-01-01'),
    followers: 1234,
    following: 567,
    postsCount: 89,
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cover Image */}
      <div className="card overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-primary-400 to-primary-600" />
        
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16">
            <Avatar
              src={profileUser.avatar}
              name={profileUser.displayName}
              size="2xl"
              className="ring-4 ring-white dark:ring-gray-800"
            />
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{profileUser.displayName}</h1>
              <p className="text-gray-500 dark:text-gray-400">@{profileUser.username}</p>
            </div>

            {isOwnProfile ? (
              <Button variant="outline">Edit Profile</Button>
            ) : (
              <Button variant="primary">Follow</Button>
            )}
          </div>

          {/* Bio */}
          {profileUser.bio && (
            <p className="mt-4 text-gray-700 dark:text-gray-300">{profileUser.bio}</p>
          )}

          {/* Info */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            {profileUser.location && (
              <div className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4" />
                {profileUser.location}
              </div>
            )}
            {profileUser.website && (
              <div className="flex items-center gap-1">
                <LinkIcon className="w-4 h-4" />
                <a
                  href={profileUser.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  {profileUser.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              Joined {new Date(profileUser.createdAt).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex gap-6 text-sm">
            <div>
              <span className="font-bold text-gray-900 dark:text-white">
                {profileUser.postsCount}
              </span>{' '}
              <span className="text-gray-600 dark:text-gray-400">Posts</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-white">
                {profileUser.followers}
              </span>{' '}
              <span className="text-gray-600 dark:text-gray-400">Followers</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-white">
                {profileUser.following}
              </span>{' '}
              <span className="text-gray-600 dark:text-gray-400">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Tab */}
      <div className="mt-6">
        <div className="card">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              <button className="py-4 px-1 border-b-2 border-primary-600 text-primary-600 dark:text-primary-400 font-medium text-sm">
                Posts
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium text-sm">
                Media
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium text-sm">
                Likes
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            <p className="text-center text-gray-500 dark:text-gray-400 py-12">
              No posts yet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
