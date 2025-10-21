import { useParams } from 'react-router-dom';

export default function ProfilePage() {
  const { username } = useParams();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="card p-12 text-center">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold">
          {username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <h1 className="text-3xl font-bold mb-2">@{username}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This is the profile page for {username}
        </p>
        <div className="flex items-center justify-center gap-8">
          <div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-500">Posts</div>
          </div>
          <div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-500">Followers</div>
          </div>
          <div>
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-gray-500">Following</div>
          </div>
        </div>
      </div>
    </div>
  );
}
