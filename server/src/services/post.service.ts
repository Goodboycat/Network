import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { PostType, PostVisibility } from '@prisma/client';

export class PostService {
  async createPost(userId: string, data: {
    content: string;
    type?: PostType;
    visibility?: PostVisibility;
    media?: any[];
  }) {
    const post = await prisma.post.create({
      data: {
        authorId: userId,
        content: data.content,
        type: data.type || 'TEXT',
        visibility: data.visibility || 'PUBLIC',
        media: data.media
          ? {
              create: data.media,
            }
          : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            isVerified: true,
          },
        },
        media: true,
        _count: {
          select: {
            likes: true,
            comments: true,
            shares: true,
          },
        },
      },
    });

    // Update user stats
    await prisma.userStats.update({
      where: { userId },
      data: { totalPosts: { increment: 1 } },
    });

    return this.formatPost(post);
  }

  async getPostById(postId: string, currentUserId?: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId, deletedAt: null },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            isVerified: true,
          },
        },
        media: true,
        _count: {
          select: {
            likes: true,
            comments: true,
            shares: true,
          },
        },
      },
    });

    if (!post) {
      throw new AppError('Post not found', 404, 'POST_NOT_FOUND');
    }

    // Check interactions if user is logged in
    let isLiked = false;
    let isBookmarked = false;

    if (currentUserId) {
      const [like, bookmark] = await Promise.all([
        prisma.like.findUnique({
          where: {
            userId_postId: {
              userId: currentUserId,
              postId,
            },
          },
        }),
        prisma.bookmark.findUnique({
          where: {
            userId_postId: {
              userId: currentUserId,
              postId,
            },
          },
        }),
      ]);

      isLiked = !!like;
      isBookmarked = !!bookmark;
    }

    return this.formatPost(post, isLiked, isBookmarked);
  }

  async getFeed(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    // Get following user IDs
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);
    followingIds.push(userId); // Include own posts

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          authorId: { in: followingIds },
          deletedAt: null,
          OR: [{ visibility: 'PUBLIC' }, { visibility: 'FOLLOWERS' }],
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
              isVerified: true,
            },
          },
          media: true,
          _count: {
            select: {
              likes: true,
              comments: true,
              shares: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.post.count({
        where: {
          authorId: { in: followingIds },
          deletedAt: null,
          OR: [{ visibility: 'PUBLIC' }, { visibility: 'FOLLOWERS' }],
        },
      }),
    ]);

    // Check user interactions
    const postsWithInteractions = await this.addUserInteractions(posts, userId);

    return {
      items: postsWithInteractions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  async getUserPosts(targetUserId: string, currentUserId?: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    // Check visibility
    const visibilityFilter = currentUserId === targetUserId
      ? {} // Show all posts if viewing own profile
      : { visibility: 'PUBLIC' };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          authorId: targetUserId,
          deletedAt: null,
          ...visibilityFilter,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
              isVerified: true,
            },
          },
          media: true,
          _count: {
            select: {
              likes: true,
              comments: true,
              shares: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.post.count({
        where: {
          authorId: targetUserId,
          deletedAt: null,
          ...visibilityFilter,
        },
      }),
    ]);

    const postsWithInteractions = currentUserId
      ? await this.addUserInteractions(posts, currentUserId)
      : posts.map((p) => this.formatPost(p));

    return {
      items: postsWithInteractions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  async likePost(userId: string, postId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      throw new AppError('Post not found', 404, 'POST_NOT_FOUND');
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.$transaction([
        prisma.like.delete({
          where: { id: existingLike.id },
        }),
        prisma.post.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } },
        }),
      ]);

      return { liked: false, message: 'Post unliked' };
    } else {
      // Like
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        prisma.post.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } },
        }),
      ]);

      // Create notification
      if (post.authorId !== userId) {
        await prisma.notification.create({
          data: {
            userId: post.authorId,
            type: 'LIKE',
            title: 'New Like',
            message: 'liked your post',
            actorId: userId,
            targetType: 'post',
            targetId: postId,
          },
        });
      }

      return { liked: true, message: 'Post liked' };
    }
  }

  async deletePost(userId: string, postId: string) {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      throw new AppError('Post not found', 404, 'POST_NOT_FOUND');
    }

    if (post.authorId !== userId) {
      throw new AppError('Unauthorized to delete this post', 403, 'FORBIDDEN');
    }

    await prisma.post.update({
      where: { id: postId },
      data: { deletedAt: new Date() },
    });

    return { message: 'Post deleted successfully' };
  }

  private formatPost(post: any, isLiked = false, isBookmarked = false) {
    return {
      id: post.id,
      author: post.author,
      content: post.content,
      type: post.type,
      visibility: post.visibility,
      media: post.media || [],
      likesCount: post._count?.likes || post.likesCount,
      commentsCount: post._count?.comments || post.commentsCount,
      sharesCount: post._count?.shares || post.sharesCount,
      viewsCount: post.viewsCount,
      isLiked,
      isBookmarked,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  private async addUserInteractions(posts: any[], userId: string) {
    const postIds = posts.map((p) => p.id);

    const [likes, bookmarks] = await Promise.all([
      prisma.like.findMany({
        where: { userId, postId: { in: postIds } },
        select: { postId: true },
      }),
      prisma.bookmark.findMany({
        where: { userId, postId: { in: postIds } },
        select: { postId: true },
      }),
    ]);

    const likedPosts = new Set(likes.map((l) => l.postId));
    const bookmarkedPosts = new Set(bookmarks.map((b) => b.postId));

    return posts.map((post) =>
      this.formatPost(post, likedPosts.has(post.id), bookmarkedPosts.has(post.id))
    );
  }
}

export const postService = new PostService();
