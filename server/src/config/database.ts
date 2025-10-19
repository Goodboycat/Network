import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

// Log database queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e: any) => {
    logger.debug(`Query: ${e.query}`);
    logger.debug(`Duration: ${e.duration}ms`);
  });
}

prisma.$on('error', (e: any) => {
  logger.error(`Database error: ${e.message}`);
});

// Test database connection
prisma.$connect()
  .then(() => {
    logger.info('✅ Database connected successfully');
  })
  .catch((error) => {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  logger.info('Database connection closed');
});

export { prisma };
