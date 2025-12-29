# Setup Guide

## Prerequisites

Before setting up the project, ensure you have:

- **Node.js** 18.x or higher (22.11.0 recommended)
- **npm** 9.x or higher
- **PostgreSQL** database (or Neon account for cloud database)
- **Git** for version control
- A code editor (VS Code recommended)

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Faculty-of-Science-Technology/UBSC-Chapter-Website.git
cd UBSC-Chapter-Website
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies listed in `package.json`.

### 3. Database Setup

#### Option A: Using Neon (Recommended for Development)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string (both pooled and direct)

#### Option B: Using Local PostgreSQL

1. Install PostgreSQL locally
2. Create a new database:
   ```bash
   createdb ubsc_chapter
   ```

#### Option C: Using Docker

```bash
docker-compose up -d neon
```

This starts a Neon-compatible PostgreSQL container.

### 4. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and configure the following variables:

#### Essential Configuration

```bash
# Platform Identity
PLATFORM_NAME="UBSC Chapter"
PUBLIC_PLATFORM_NAME="UBSC Chapter"
PUBLIC_PLATFORM_SPONSOR_NAME="University of Belize ACM Chapter"
PUBLIC_PLATFORM_DESCRIPTION="University of Belize ACM Chapter Management Platform"
PLATFORM_URL="https://ubsc-chapter.ub.edu.bz"
PLATFORM_URL_DEVELOPMENT="http://localhost:5173"
PUBLIC_PLATFORM_VERSION="1.0.0"

# Build Identity
IS_DEVELOPMENT=true
IS_STAGING=false
IS_PRODUCTION=false
DEBUG=true

# Database - REQUIRED
# For Neon, use the pooled connection URL
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# For production, use the direct (non-pooled) connection
DATABASE_URL_PROD="postgresql://user:password@host/database?sslmode=require"

# JWT Secrets - CHANGE THESE!
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
ACT_JWT_SECRET="your-activation-secret-change-this-in-production"
```

#### Optional Configuration

```bash
# Session Properties
SESSION_SAMESITE=lax
SESSION_HTTP_ONLY=true
SESSION_SECURE=false  # Set to true in production with HTTPS
SESSION_MAX_AGE=259200  # 72 hours in seconds

# User Interface Properties
PUBLIC_UI_DEFAULT_COVER_IMAGE="[URL to default cover image]"
PUBLIC_UI_DEFAULT_AVATAR_IMAGE="/static/user_default.webp"
DEFAULT_PROFILE_PICTURE="https://ui-avatars.com/api/?name="

# Email Configuration (optional for local dev)
MAIL_DISPLAYNAME="UBSC Chapter"
MAIL_USERNAME="your-email@example.com"
MAIL_PASSWORD="your-email-password"
MAIL_SIGNATURE="UBSC Chapter IT Team"

# Support Email
PUBLIC_SUPPORT_EMAIL="support@ubsc.example.com"
```

### 5. Database Initialization

#### Generate Database Schema

```bash
# Push schema to database (for development)
npm run db:push
```

Or use migrations (recommended for production):

```bash
# Generate migration files
npm run db:generate

# Apply migrations
npm run db:migrate
```

#### Seed Initial Data

```bash
npm run db:seed
```

This creates:
- Default roles (Administrator, Moderator, Event Manager, Content Manager, Member)
- An admin user account:
  - **Username**: `admin`
  - **Email**: `admin@example.com`
  - **Password**: `admin123` (CHANGE THIS IMMEDIATELY!)
- A sample invite code

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 7. Initial Login

1. Navigate to `http://localhost:5173/auth/login`
2. Login with:
   - **Email**: `admin@example.com`
   - **Password**: `admin123`
3. **IMPORTANT**: Change the admin password immediately after first login

## Verification Steps

### 1. Check Database Connection

Open Drizzle Studio to browse your database:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:4983` (or similar) where you can view and edit database records.

### 2. Check Build

Ensure the application builds without errors:

```bash
npm run build
```

### 3. Run Type Checking

```bash
npm run check
```

### 4. Run Linting

```bash
npm run lint
```

## Common Setup Issues

### Database Connection Errors

**Problem**: `Error: Connection refused`

**Solution**:
- Verify database is running
- Check DATABASE_URL is correct
- Ensure database accepts connections from your IP
- For Neon, verify the connection string includes `?sslmode=require`

### Build Errors

**Problem**: `Cannot find module` errors

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Environment Variable Issues

**Problem**: Variables not loading

**Solution**:
- Ensure `.env` file exists in project root
- Restart development server after changing `.env`
- Check that variables are properly formatted (no spaces around `=`)

### Port Already in Use

**Problem**: Port 5173 is already in use

**Solution**:
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

## Development Tools Setup

### VS Code Extensions (Recommended)

Install these extensions for the best development experience:

- **Svelte for VS Code** (`svelte.svelte-vscode`)
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)
- **TypeScript** (built-in)

### VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[svelte]": {
    "editor.defaultFormatter": "svelte.svelte-vscode"
  },
  "eslint.validate": ["javascript", "typescript", "svelte"]
}
```

## Docker Setup (Alternative)

### Full Stack with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Services:
# - neon: PostgreSQL database
# - web-admin: Cloudbeaver (database GUI)
# - web: Application server
```

Access:
- **Application**: `http://localhost:3000`
- **Cloudbeaver**: `http://localhost:8978`
- **Database**: `localhost:55432`

### Docker Environment Variables

When using Docker, update `.env`:

```bash
DATABASE_URL="postgresql://postgres:postgres@neon:5432/ubsc"
```

## Next Steps

After completing setup:

1. Read the [Development Guide](DEVELOPMENT.md) to understand the development workflow
2. Review the [Architecture Documentation](ARCHITECTURE.md) to understand the system design
3. Check [FEATURES.md](FEATURES.md) to see what's implemented and what's planned
4. Explore the codebase starting with:
   - `src/routes/+page.svelte` - Landing page
   - `src/routes/dashboard/+page.svelte` - Dashboard
   - `src/lib/server/auth/index.ts` - Authentication logic
   - `src/lib/server/db/schema.ts` - Database schema

## Production Setup Notes

For production deployment:

1. Set `IS_DEVELOPMENT=false` and `IS_PRODUCTION=true`
2. Use strong, unique JWT secrets
3. Set `SESSION_SECURE=true`
4. Configure proper email credentials
5. Use DATABASE_URL_PROD for direct database connection
6. Enable HTTPS
7. Set appropriate CORS policies
8. Configure proper logging and monitoring

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed production deployment instructions.

## Troubleshooting

For additional help, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

## Getting Help

If you encounter issues not covered here:

1. Check the [Troubleshooting Guide](TROUBLESHOOTING.md)
2. Review the existing GitHub issues
3. Check the SvelteKit documentation: https://kit.svelte.dev
4. Check the Drizzle ORM documentation: https://orm.drizzle.team
