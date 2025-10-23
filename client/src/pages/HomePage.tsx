import { useEffect, useState } from 'react';
import { useAppSelector } from '../store/store';
import { apiClient } from '../services/api';
import toast from 'react-hot-toast';

export default function HomePage() {
  const { user } = useAppSelector((state) => state.auth);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getFeed(page, 20);
      setPosts(response.data.items);
      setHasMore(response.data.pagination.hasMore);
    } catch (error: any) {
      toast.error('Failed to load feed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;

    try {
      const nextPage = page + 1;
      const response = await apiClient.getFeed(nextPage, 20);
      setPosts((prev) => [...prev, ...response.data.items]);
      setHasMore(response.data.pagination.hasMore);
      setPage(nextPage);
    } catch (error: any) {
      toast.error('Failed to load more posts');
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome back, {user?.displayName}!</h1>
        <p className="text-gray-600 dark:text-gray-400">Check out what's happening</p>
      </div>

      {/* Create Post Card */}
      <div className="card p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold">
            {user?.displayName?.charAt(0) || 'U'}
          </div>
          <button className="flex-1 text-left px-4 py-3 rounded-full bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors">
            What's on your mind?
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      {posts.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Follow some users to see their posts here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {/* Load More Button */}
          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loading}
              className="w-full btn btn-secondary"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Simple Post Card Component
function PostCard({ post }: { post: any }) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const handleLike = async () => {
    try {
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);
      await apiClient.likePost(post.id);
    } catch (error) {
      setLiked(liked);
      setLikesCount(likesCount);
      toast.error('Failed to like post');
    }
  };

  return (
    <div className="card p-6 hover:shadow-md transition-shadow">
      {/* Author Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold">
          {post.author?.displayName?.charAt(0) || 'U'}
        </div>
        <div>
          <h3 className="font-semibold">{post.author?.displayName}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            @{post.author?.username}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={post.media[0].url}
            alt="Post media"
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-dark-700">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition-colors ${
            liked
              ? 'text-red-500'
              : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill={liked ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{likesCount}</span>
        </button>

        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>{post.commentsCount}</span>
        </button>

        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          <span>{post.sharesCount}</span>
        </button>
      </div>
    </div>
  );
}
