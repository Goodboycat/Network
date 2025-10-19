import { FC, useState } from 'react';
import { PhotoIcon, FaceSmileIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import Textarea from '../common/Textarea';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { createPost } from '../../store/slices/postsSlice';
import { useToast } from '../../hooks/useToast';
import { PostVisibility } from '@shared/types';

const CreatePostCard: FC = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.warning('Please write something before posting');
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(
        createPost({
          content: content.trim(),
          visibility: PostVisibility.PUBLIC,
        })
      ).unwrap();
      setContent('');
      toast.success('Post created successfully!');
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <div className="flex gap-3">
        <Avatar src={user?.avatar} name={user?.displayName} size="md" />
        
        <form onSubmit={handleSubmit} className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            resize="none"
            className="mb-3"
          />

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400 transition-colors"
                title="Add photo"
              >
                <PhotoIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400 transition-colors"
                title="Add emoji"
              >
                <FaceSmileIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400 transition-colors"
                title="Add location"
              >
                <MapPinIcon className="w-5 h-5" />
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={isLoading}
              disabled={!content.trim()}
            >
              Post
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostCard;
