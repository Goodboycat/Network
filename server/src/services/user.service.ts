import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { cacheService } from '../config/redis';

export class UserService {
  async getUserById(userId: string, currentUserId?: string) {
    const cacheKey = `user:${userId}`;
    
    // Try to get from cache
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatar: true,
        coverImage: true,
        location: true,
        website: true,
        isVerified: true,
        isPrivate: true,
        createdAt: true,
        stats: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Check if current user follows this user
    let isFollowing = false;
    if (currentUserId && currentUserId !== userId) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: userId,
          },
        },
      });
      isFollowing = !!follow;
    }

    const result = {
      ...user,
      followers: user._count.followers,
      following: user._count.following,
      postsCount: user._count.posts,
      isFollowing,
    };

    // Cache for 5 minutes
    await cacheService.set(cacheKey, result, 300);

    return result;
  }

  async getUserByUsername(username: string, currentUserId?: string) {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    return this.getUserById(user.id, currentUserId);
  }

  async updateProfile(userId: string, data: {
    displayName?: string;
    bio?: string;
    location?: string;
    website?: string;
    birthDate?: Date;
  }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatar: true,
        coverImage: true,
        location: true,
        website: true,
        birthDate: true,
      },
    });

    // Clear cache
    await cacheService.del(`user:${userId}`);

    return user;
  }

  async updateSettings(userId: string, settings: any) {
    const updated = await prisma.userSettings.upsert({
      where: { userId },
      update: settings,
      create: {
        userId,
        ...settings,
      },
    });

    // Clear cache
    await cacheService.del(`user:${userId}`);

    return updated;
  }

  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new AppError('Cannot follow yourself', 400, 'INVALID_OPERATION');
    }

    const followingUser = await prisma.user.findUnique({
      where: { id: followingId },
    });

    if (!followingUser) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      throw new AppError('Already following this user', 400, 'ALREADY_FOLLOWING');
    }

    await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: followingId,
        type: 'FOLLOW',
        title: 'New Follower',
        message: 'started following you',
        actorId: followerId,
        targetType: 'user',
        targetId: followerId,
      },
    });

    // Clear cache
    await cacheService.del(`user:${followerId}`);
    await cacheService.del(`user:${followingId}`);

    return { message: 'Successfully followed user' };
  }

  async unfollowUser(followerId: string, followingId: string) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (!follow) {
      throw new AppError('Not following this user', 400, 'NOT_FOLLOWING');
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    // Clear cache
    await cacheService.del(`user:${followerId}`);
    await cacheService.del(`user:${followingId}`);

    return { message: 'Successfully unfollowed user' };
  }

  async getFollowers(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [followers, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followingId: userId },
        skip,
        take: limit,
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
              isVerified: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.follow.count({ where: { followingId: userId } }),
    ]);

    return {
      items: followers.map((f) => f.follower),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  async getFollowing(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [following, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followerId: userId },
        skip,
        take: limit,
        include: {
          following: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
              isVerified: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.follow.count({ where: { followerId: userId } }),
    ]);

    return {
      items: following.map((f) => f.following),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  async searchUsers(query: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { displayName: { contains: query, mode: 'insensitive' } },
          ],
          status: 'ACTIVE',
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
          bio: true,
          isVerified: true,
          _count: {
            select: {
              followers: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: [{ isVerified: 'desc' }, { createdAt: 'desc' }],
      }),
      prisma.user.count({
        where: {
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { displayName: { contains: query, mode: 'insensitive' } },
          ],
          status: 'ACTIVE',
        },
      }),
    ]);

    return {
      items: users.map((u) => ({
        ...u,
        followers: u._count.followers,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }
}

export const userService = new UserService();
