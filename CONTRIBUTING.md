# Contributing to Network

First off, thank you for considering contributing to Network! It's people like you that make Network such a great platform.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:
- Be respectful and inclusive
- Accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the problem
- **Expected behavior**
- **Actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - why is this enhancement needed?
- **Proposed solution**
- **Alternative solutions** you've considered
- **Additional context** or screenshots

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Follow the coding standards** outlined below
3. **Add tests** for new features
4. **Update documentation** if needed
5. **Ensure all tests pass**
6. **Create a Pull Request** with a clear description

## Development Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Docker (optional)

### Getting Started

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Network.git
cd Network

# Install dependencies
npm install

# Setup environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env

# Start database (with Docker)
docker-compose up -d postgres redis

# Run database migrations
cd server
npx prisma migrate dev
npx prisma db seed

# Start development servers
cd ..
npm run dev
```

## Coding Standards

### General Guidelines

- **Write clean, readable code**
- **Use TypeScript** for type safety
- **Follow existing code style**
- **Write meaningful commit messages**
- **Keep functions small and focused**
- **Add comments for complex logic**

### TypeScript Style

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  username: string;
}

async function getUserById(id: string): Promise<User> {
  return await prisma.user.findUnique({ where: { id } });
}

// ❌ Bad
function getUser(id) {
  return prisma.user.findUnique({ where: { id } });
}
```

### React/Frontend Guidelines

- Use **functional components** with hooks
- Follow **component composition** patterns
- Use **custom hooks** for reusable logic
- Keep components **small and focused**
- Use **TypeScript interfaces** for props

```tsx
// ✅ Good
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}

// ❌ Bad
export function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>;
}
```

### Backend Guidelines

- Use **async/await** instead of callbacks
- Implement proper **error handling**
- Use **service layer** for business logic
- Keep **controllers thin**
- Add **validation** for all inputs

```typescript
// ✅ Good
async function createPost(userId: string, data: CreatePostDto) {
  try {
    const post = await prisma.post.create({
      data: {
        ...data,
        authorId: userId,
      },
    });
    return post;
  } catch (error) {
    logger.error('Failed to create post:', error);
    throw new AppError('Failed to create post', 500, 'CREATE_POST_FAILED');
  }
}

// ❌ Bad
function createPost(userId, data) {
  return prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
}
```

## Git Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(auth): add OAuth 2.0 support

Implement Google and GitHub OAuth authentication
- Add OAuth routes and controllers
- Update user model for OAuth accounts
- Add OAuth configuration

Closes #123

---

fix(posts): resolve infinite scroll pagination bug

The feed was loading duplicate posts on scroll.
Fixed by properly tracking the last post ID.

Fixes #456
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- path/to/test.test.ts
```

### Writing Tests

```typescript
describe('UserService', () => {
  describe('getUserById', () => {
    it('should return user when found', async () => {
      const user = await userService.getUserById('user-123');
      expect(user).toBeDefined();
      expect(user.id).toBe('user-123');
    });

    it('should throw error when user not found', async () => {
      await expect(userService.getUserById('invalid')).rejects.toThrow();
    });
  });
});
```

## Project Structure

```
network/
├── client/           # Frontend React app
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   ├── store/       # Redux store
│   │   └── services/    # API services
├── server/           # Backend Node.js app
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── services/    # Business logic
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Express middleware
│   │   └── config/      # Configuration
├── shared/           # Shared types and utilities
└── docs/             # Documentation
```

## Documentation

- Update **README.md** for user-facing changes
- Update **API documentation** for API changes
- Add **JSDoc comments** for public functions
- Update **CHANGELOG.md** for notable changes

## Review Process

1. **Self-review** your code before submitting
2. **Address** all review comments
3. **Keep PRs** focused and small
4. **Update** your PR based on feedback
5. **Squash commits** before merging

## Questions?

Feel free to:
- Open an issue
- Ask in discussions
- Join our Discord community

Thank you for contributing! 🎉
