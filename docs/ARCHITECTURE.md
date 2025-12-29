# Architecture Documentation

## System Overview

The UBSC Chapter Website is built using modern web technologies with a focus on performance, scalability, and maintainability.

## Technology Stack

### Frontend
- **SvelteKit 2.x**: Full-stack framework for building web applications
- **Svelte 5.x**: Reactive component framework
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework
- **shadcn-svelte Components**: Pre-built UI components (bits-ui, formsnap, etc.)
- **Lucide Icons**: Icon library

### Backend
- **SvelteKit Server Routes**: API endpoints and server-side logic
- **Drizzle ORM**: TypeScript ORM for database interactions
- **PostgreSQL**: Primary database
- **Argon2**: Password hashing
- **JWT**: Token-based authentication
- **Nodemailer**: Email functionality

### Build & Development Tools
- **Vite**: Build tool and dev server
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript Compiler**: Type checking
- **Drizzle Kit**: Database migrations and schema management

### Deployment
- **Fly.io**: Primary deployment platform
- **Vercel**: Alternative deployment option
- **Docker**: Containerization
- **Neon Database**: PostgreSQL hosting

## Architecture Patterns

### Project Structure

```
UBSC-Chapter-Website/
├── src/
│   ├── lib/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── global/         # Global components (footer, etc.)
│   │   │   ├── public/         # Public-facing components (nav, widgets)
│   │   │   ├── compatibility/  # Compatibility layers
│   │   │   └── vendor/         # Third-party UI components (shadcn)
│   │   ├── server/             # Server-side code
│   │   │   ├── auth/           # Authentication service
│   │   │   ├── db/             # Database schema and queries
│   │   │   ├── invites/        # Invite code management
│   │   │   └── upload/         # File upload handling
│   │   ├── templates/          # Page templates
│   │   ├── types/              # TypeScript type definitions
│   │   └── i18n.ts            # Internationalization config
│   ├── routes/                 # SvelteKit routes
│   │   ├── (app)/             # App route group
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── events/            # Public event pages
│   │   ├── groups/            # Public group pages
│   │   └── about/             # About page
│   ├── app.css                # Global styles
│   ├── app.html               # HTML template
│   ├── app.d.ts               # App type definitions
│   └── hooks.server.ts        # Server hooks (auth middleware)
├── static/                     # Static assets
├── i18n/                       # Translation files
├── script/                     # Utility scripts
│   └── seed.ts                # Database seeding
├── docs/                       # Documentation
└── [config files]             # Various configuration files
```

### Routing Architecture

SvelteKit uses file-based routing:

- **`+page.svelte`**: Page component
- **`+page.server.ts`**: Server-side data loading and actions
- **`+server.ts`**: API endpoints
- **`+layout.svelte`**: Layout component
- **`+layout.server.ts`**: Layout server-side logic

#### Route Groups
- **`(app)`**: API routes for the application
- Routes without groups are public-facing

### Authentication Flow

1. **Registration**:
   - User provides credentials + invite code
   - Invite code is validated
   - Password is hashed with Argon2
   - User record is created in database
   - Invite code usage is tracked

2. **Login**:
   - User provides email/password
   - Password is verified against hash
   - JWT token is generated with user session data
   - Token includes user permissions from roles
   - Cookie is set with auth token

3. **Authorization**:
   - `hooks.server.ts` intercepts all requests
   - Verifies JWT token from cookie
   - Loads user session into `event.locals.user`
   - Protects routes based on authentication/permissions
   - Redirects unauthorized access

### Database Architecture

The application uses Drizzle ORM with PostgreSQL:

- **Schema Definition**: `src/lib/server/db/schema.ts`
- **Connection**: `src/lib/server/db/index.ts`
- **Migrations**: Managed via Drizzle Kit

See [DATABASE.md](DATABASE.md) for detailed schema documentation.

### Role-Based Access Control (RBAC)

The system implements RBAC with the following structure:

1. **Users** have one or more **Roles**
2. **Roles** have specific **Permissions**
3. **Permissions** control access to features:
   - `CanManageUsers`
   - `CanManageEvents`
   - `CanManageGroups`
   - `CanManagePosts`
   - `CanEditOthersPosts`
   - `CanManageRoles`
   - `CanManageInvites`
   - `CanManageTheme`

4. **Administrator** flag provides full access

### Internationalization (i18n)

The application supports multiple languages using Inlang/Paraglide:

- **Translation Files**: `i18n/en.json`, `i18n/es.json`
- **Configuration**: `project.inlang/settings.json`
- **Usage**: Import messages from `$lib/paraglide/messages`
- **Language Detection**: Handled by Paraglide SvelteKit integration

### State Management

- **Server State**: Managed through SvelteKit's data loading
- **Form State**: Managed using Superforms with Zod validation
- **Client State**: Svelte 5 runes (`$state`, `$derived`, `$effect`)
- **Theme State**: Mode Watcher for dark/light theme

### File Upload System

Located in `src/lib/server/upload/`:

- **Driver-based architecture**: Currently supports local filesystem
- **Media Pool**: Tracks uploaded files in database
- **File Types**: Images, documents, etc.
- **Storage Location**: Configurable per driver

### Component Architecture

#### Vendor Components (shadcn-svelte)
Pre-built UI components in `src/lib/components/vendor/ui/`:
- Accordion, Avatar, Button, Select, Textarea, etc.
- Built on top of bits-ui (headless components)
- Styled with Tailwind

#### Custom Components
- **Public Components**: Landing page sections, navigation
- **Dashboard Components**: Admin interfaces
- **Global Components**: Footer, headers

### Build Process

1. **Development**:
   ```bash
   npm run dev  # Vite dev server with HMR
   ```

2. **Production**:
   ```bash
   npm run build  # Vite build → SvelteKit adapter
   ```

3. **Adapters**:
   - **Development**: `@sveltejs/adapter-vercel`
   - **Production**: `@sveltejs/adapter-node`
   - Selected based on `IS_DEVELOPMENT` environment variable

### Environment Configuration

The application uses different adapters and database connections based on environment:

- **Development**: Vercel adapter, DATABASE_URL (pooled connection)
- **Production**: Node adapter, DATABASE_URL_PROD (direct connection)

Environment variables are managed through `.env` files (see `.env.example`).

## Security Considerations

1. **Password Security**: Argon2 hashing (more secure than bcrypt)
2. **JWT Tokens**: Signed with secret, stored in httpOnly cookies
3. **SQL Injection**: Prevented by Drizzle ORM's parameterized queries
4. **XSS Prevention**: Svelte's automatic escaping + sanitize-html library
5. **CSRF Protection**: SameSite cookies + SvelteKit's built-in protection
6. **Invite-only Registration**: Prevents unauthorized account creation

## Performance Optimizations

1. **Server-Side Rendering (SSR)**: Initial page load is server-rendered
2. **Code Splitting**: Automatic via SvelteKit
3. **Image Optimization**: Handled by deployment platform
4. **Database Connection Pooling**: PgBouncer on Neon
5. **Edge Deployment**: Fly.io for global distribution

## Extensibility Points

The architecture supports extension in these areas:

1. **Upload Drivers**: Add new storage backends (S3, Cloudflare R2, etc.)
2. **Authentication Providers**: Add OAuth, SAML, etc.
3. **Notification Channels**: Email is implemented, add SMS, push, etc.
4. **Additional Roles**: Extend RBAC with custom roles
5. **Custom Themes**: Extend ThemeSettings table
6. **API Extensions**: Add new API routes in `src/routes/(app)/api/`

## Technology Decisions

### Why SvelteKit?
- Modern, performant framework
- Built-in SSR and API routes
- Excellent developer experience
- Small bundle sizes

### Why Drizzle ORM?
- Type-safe database queries
- Minimal runtime overhead
- SQL-like syntax
- Great TypeScript integration

### Why Argon2?
- More secure than bcrypt
- Resistant to GPU attacks
- Winner of Password Hashing Competition

### Why PostgreSQL?
- Robust and reliable
- Excellent JSON support
- Strong ACID guarantees
- Wide ecosystem support

## Future Architecture Considerations

For future maintainers, consider:

1. **Caching Layer**: Add Redis for session caching
2. **Full-Text Search**: Implement PostgreSQL FTS or add Elasticsearch
3. **Real-time Features**: WebSocket support for live updates
4. **Microservices**: Split into separate services if needed
5. **Message Queue**: Add job queue for background tasks
6. **API Versioning**: Implement versioned API routes
