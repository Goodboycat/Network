# 🌐 Network - Next-Generation Social Platform

A modern, feature-rich social networking platform built with cutting-edge technologies.

## ✨ Features

### Core Features
- 🔐 **Secure Authentication** - JWT-based auth with OAuth 2.0 support (Google, GitHub)
- 💬 **Real-time Messaging** - WebSocket-powered instant messaging
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 🌙 **Dark Mode** - Built-in light/dark theme support
- 📸 **Media Sharing** - Upload and share images, videos, and files
- 👥 **Social Interactions** - Follow, like, comment, share posts
- 🔔 **Live Notifications** - Real-time notification system
- 🔍 **Advanced Search** - Smart search with filters and suggestions
- 📊 **Analytics Dashboard** - Comprehensive engagement metrics
- 🎨 **Customizable Profiles** - Personalize your profile with themes

### Advanced Features
- 🤖 **AI-Powered Content** - Smart content recommendations
- 🌍 **Multi-language Support** - Internationalization ready
- 📈 **Trending Topics** - Discover what's popular
- 🎥 **Live Streaming** - Share live video content
- 👁️ **Stories** - Ephemeral content that disappears after 24h
- 🏆 **Gamification** - Badges, achievements, and reputation system
- 🔒 **Privacy Controls** - Granular privacy settings
- 📱 **PWA Support** - Install as a native app

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication
- **React Query** - Server state management
- **Framer Motion** - Smooth animations

### Backend
- **Node.js 20** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe backend
- **PostgreSQL** - Relational database
- **Prisma** - Next-gen ORM
- **Redis** - Caching and sessions
- **Socket.io** - WebSocket server
- **JWT** - Authentication
- **Passport.js** - OAuth strategies
- **Bull** - Job queue for background tasks

### DevOps & Tools
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD pipeline
- **ESLint & Prettier** - Code quality
- **Jest & Vitest** - Testing frameworks
- **Nginx** - Reverse proxy
- **PM2** - Process manager

## 📦 Project Structure

```
network/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── features/      # Feature-based modules
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript types
│   └── public/            # Static assets
├── server/                # Backend application
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   ├── utils/         # Helper functions
│   │   └── config/        # Configuration
│   └── prisma/            # Database schema
├── shared/                # Shared types and utilities
├── docker/                # Docker configurations
└── docs/                  # Documentation

```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Goodboycat/Network.git
cd Network
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

3. **Configure environment**
```bash
# Copy environment templates
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit .env files with your configuration
```

4. **Setup database**
```bash
cd server
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

5. **Start development servers**
```bash
# Start all services (from root)
npm run dev

# Or start individually
npm run dev:client    # Frontend on http://localhost:5173
npm run dev:server    # Backend on http://localhost:3000
```

### Using Docker

```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📖 API Documentation

API documentation is available at `http://localhost:3000/api/docs` when running the server.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run client tests
npm run test:client

# Run server tests
npm run test:server

# Run with coverage
npm run test:coverage
```

## 🔒 Security

- All passwords are hashed using bcrypt
- JWT tokens with refresh token rotation
- CORS protection
- Rate limiting on all endpoints
- SQL injection prevention with Prisma
- XSS protection with sanitization
- CSRF tokens for forms
- Helmet.js for security headers

## 📈 Performance

- Code splitting and lazy loading
- Image optimization and lazy loading
- Redis caching for frequent queries
- Database query optimization with indexes
- CDN for static assets
- Compression middleware
- Service worker for offline support

## 🌍 Deployment

### Production Build

```bash
# Build all
npm run build

# Build client only
npm run build:client

# Build server only
npm run build:server
```

### Deploy to Production

```bash
# Using PM2
npm run start:prod

# Using Docker
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ by the Network team
- Powered by open-source technologies
- Inspired by the best social platforms

## 📞 Support

- 📧 Email: support@network.dev
- 💬 Discord: [Join our community](https://discord.gg/network)
- 🐛 Issues: [GitHub Issues](https://github.com/Goodboycat/Network/issues)

---

Made with 💙 by [Goodboycat](https://github.com/Goodboycat)
