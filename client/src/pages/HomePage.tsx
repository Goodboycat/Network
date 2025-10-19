import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchFeed } from '../store/slices/postsSlice';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CreatePostCard from '../components/feed/CreatePostCard';
import PostCard from '../components/feed/PostCard';

const HomePage: FC = () => {
  const dispatch = useAppDispatch();
  const { feed, isLoading, hasMore, page } = useAppSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchFeed({ page: 1 }));
  }, [dispatch]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      dispatch(fetchFeed({ page: page + 1 }));
    }
  };

  const { loadMoreRef } = useInfiniteScroll({
    loading: isLoading,
    hasMore,
    onLoadMore: handleLoadMore,
  });

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Home</h1>
      
      <CreatePostCard />

      <div className="mt-6 space-y-4">
        {feed.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {isLoading && (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="large" />
          </div>
        )}

        {!isLoading && feed.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No posts yet. Start following people or create your first post!
            </p>
          </div>
        )}

        {hasMore && <div ref={loadMoreRef} className="h-10" />}
      </div>
    </div>
  );
};

export default HomePage;
