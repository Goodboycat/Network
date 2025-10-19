import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Message, Conversation, SendMessageRequest } from '@shared/types';
import { messagesService } from '../../services/messagesService';

interface MessagesState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;
  unreadCount: number;
}

const initialState: MessagesState = {
  conversations: [],
  currentConversation: null,
  messages: {},
  isLoading: false,
  error: null,
  unreadCount: 0,
};

// Async thunks
export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const conversations = await messagesService.getConversations();
      return conversations;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const messages = await messagesService.getMessages(conversationId);
      return { conversationId, messages };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (data: SendMessageRequest, { rejectWithValue }) => {
    try {
      const message = await messagesService.sendMessage(data);
      return message;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  'messages/markAsRead',
  async (messageId: string, { rejectWithValue }) => {
    try {
      await messagesService.markAsRead(messageId);
      return messageId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.currentConversation = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const { conversationId } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(action.payload);
      
      // Update conversation's last message
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.lastMessage = action.payload;
      }
    },
    updateUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
        state.unreadCount = action.payload.reduce((sum, c) => sum + c.unreadCount, 0);
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages[action.payload.conversationId] = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        const { conversationId } = action.payload;
        if (!state.messages[conversationId]) {
          state.messages[conversationId] = [];
        }
        state.messages[conversationId].push(action.payload);
        
        // Update conversation's last message
        const conversation = state.conversations.find(c => c.id === conversationId);
        if (conversation) {
          conversation.lastMessage = action.payload;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentConversation, addMessage, updateUnreadCount } = messagesSlice.actions;
export default messagesSlice.reducer;
