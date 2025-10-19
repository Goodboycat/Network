import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchConversations } from '../store/slices/messagesSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

const MessagesPage: FC = () => {
  const dispatch = useAppDispatch();
  const { conversationId } = useParams();
  const { conversations, isLoading } = useAppSelector((state) => state.messages);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <div className="card">
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-700">
          {/* Conversations List */}
          <div className="lg:col-span-1 p-4">
            <h2 className="text-lg font-semibold mb-4">Conversations</h2>
            {conversations.length === 0 ? (
              <div className="text-center py-12">
                <ChatBubbleLeftIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No conversations yet
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <p className="font-medium">{conversation.groupName || 'Conversation'}</p>
                    {conversation.lastMessage && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {conversation.lastMessage.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message View */}
          <div className="lg:col-span-2 p-4">
            {conversationId ? (
              <div className="flex flex-col h-[600px]">
                <div className="flex-1 overflow-y-auto">
                  {/* Messages will go here */}
                </div>
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[600px]">
                <div className="text-center">
                  <ChatBubbleLeftIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Select a conversation to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
