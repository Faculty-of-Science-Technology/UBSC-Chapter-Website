# UBSC Chapter Website

A comprehensive management platform for the University of Belize ACM Student Chapter (UBSC) and similar organizations. This platform provides complete digital infrastructure for managing members, content, events, and organizational activities.

## Overview

The UBSC Chapter Website is built using modern web application patterns to deliver a full-featured management system with:

- **Identity & Access Management**: User registration, authentication, and role-based authorization
- **Content Management**: Blog posts, articles, and rich media content
- **Event Management**: Event creation, scheduling, and attendee tracking
- **Group Management**: Committees, teams, and organizational structures
- **Controlled Access**: Invite-based registration and permission systems
- **Internationalization**: Multi-language support for global reach
- **Media Management**: Centralized media storage and organization
- **Theme Management**: Customizable visual appearance

## Quick Start

### Prerequisites

- Node.js (LTS version recommended)
- PostgreSQL database
- Package manager (npm, pnpm, or yarn)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd <repository-directory>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize the database
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

The development server will start and typically display the local application URL in your terminal.

## Documentation

Comprehensive documentation is available in the [`docs/`](docs/) directory:

- **[Documentation Hub](docs/README.md)** - Start here for navigation to all guides
- **[Architecture Overview](docs/ARCHITECTURE.md)** - System design and architectural patterns
- **[Setup Guide](docs/SETUP.md)** - Detailed installation and configuration
- **[Development Guide](docs/DEVELOPMENT.md)** - Development workflow and coding standards
- **[Database Documentation](docs/DATABASE.md)** - Schema design and data models
- **[API Documentation](docs/API.md)** - Endpoints and integration
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions
- **[Features Documentation](docs/FEATURES.md)** - Feature catalog and capabilities
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions

## Technology Stack Used

This platform is built on modern web technologies:

- **Full-stack Framework**: Modern reactive component framework
- **Type Safety**: Comprehensive TypeScript integration
- **Relational Database**: PostgreSQL-based data persistence
- **ORM Layer**: Type-safe database queries and migrations
- **Secure Authentication**: Industry-standard password hashing and token management
- **Server-Side Rendering**: Performance-optimized page delivery
- **Responsive Design**: Mobile-first, accessible user interface
- **Modular Components**: Reusable, composable UI elements

For specific versions and implementation details, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check

# Linting and formatting
npm run lint
npm run format

# Database operations
npm run db:push      # Push schema changes
npm run db:generate  # Generate migrations
npm run db:studio    # Open database studio
npm run db:seed      # Seed database with sample data
```

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for detailed development workflows and best practices.

## ✅ Contributing

Contributions are welcome! Please follow these guidelines:

1. **Understand the Architecture**: Review [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) before making changes
2. **Follow Standards**: Adhere to coding standards in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
3. **Database Changes**: Use migration tools and update documentation in [docs/DATABASE.md](docs/DATABASE.md)
4. **Test Thoroughly**: Validate changes across different environments
5. **Document Changes**: Update relevant documentation when modifying functionality

## 📄 License

University of Belize ACM Student Chapter (UBSC) Management Platform

---

For detailed information, troubleshooting, and advanced topics, please refer to the [documentation](docs/README.md).
