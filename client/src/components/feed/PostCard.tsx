import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  ArrowPathRoundedSquareIcon,
  BookmarkIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from '@heroicons/react/24/solid';
import { Menu } from '@headlessui/react';
import Avatar from '../common/Avatar';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { likePost, unlikePost, deletePost } from '../../store/slices/postsSlice';
import { useToast } from '../../hooks/useToast';
import type { Post } from '@shared/types';
import clsx from 'clsx';

interface PostCardProps {
  post: Post;
}

const PostCard: FC<PostCardProps> = ({ post }) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const [showComments, setShowComments] = useState(false);

  const isOwnPost = user?.id === post.authorId;

  const handleLike = async () => {
    try {
      if (post.isLiked) {
        await dispatch(unlikePost(post.id)).unwrap();
      } else {
        await dispatch(likePost(post.id)).unwrap();
      }
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await dispatch(deletePost(post.id)).unwrap();
        toast.success('Post deleted successfully');
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
  };

  return (
    <div className="card p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.author.username}`}>
            <Avatar
              src={post.author.avatar}
              name={post.author.displayName}
              size="md"
            />
          </Link>
          <div>
            <Link
              to={`/profile/${post.author.username}`}
              className="font-semibold hover:underline"
            >
              {post.author.displayName}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{post.author.username} ·{' '}
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        {isOwnPost && (
          <Menu as="div" className="relative">
            <Menu.Button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 focus:outline-none z-10">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleDelete}
                    className={clsx(
                      'w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400',
                      active && 'bg-gray-100 dark:bg-gray-700'
                    )}
                  >
                    Delete Post
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        )}
      </div>

      {/* Content */}
      <div className="mb-3">
        <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className="mb-3 rounded-lg overflow-hidden">
          <img
            src={post.media[0].url}
            alt="Post media"
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 pt-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLike}
          className={clsx(
            'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
            post.isLiked
              ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          )}
        >
          {post.isLiked ? (
            <HeartIconSolid className="w-5 h-5" />
          ) : (
            <HeartIcon className="w-5 h-5" />
          )}
          <span className="text-sm">{post.likesCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChatBubbleOvalLeftIcon className="w-5 h-5" />
          <span className="text-sm">{post.commentsCount}</span>
        </button>

        <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <ArrowPathRoundedSquareIcon className="w-5 h-5" />
          <span className="text-sm">{post.sharesCount}</span>
        </button>

        <button
          className={clsx(
            'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ml-auto',
            post.isBookmarked
              ? 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          )}
        >
          {post.isBookmarked ? (
            <BookmarkIconSolid className="w-5 h-5" />
          ) : (
            <BookmarkIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Comments feature coming soon...
          </p>
        </div>
      )}
    </div>
  );
};

export default PostCard;
