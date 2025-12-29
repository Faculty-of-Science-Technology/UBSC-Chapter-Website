# Database Documentation

## Overview

The application uses PostgreSQL as its primary database, accessed through Drizzle ORM. The database schema is defined in `src/lib/server/db/schema.ts`.

## Database Schema

### Core Tables

#### Users
The central table for user management.

```typescript
Users {
  Id: uuid (primary key)
  AccountType: enum('org', 'student', 'owner')
  Administrator: boolean (default: false)
  FirstName: varchar(255)
  LastName: varchar(255)
  Email: varchar(64) (unique)
  Phone: varchar(15)
  Location: varchar(255)
  ProfilePicture: text (URL)
  CoverPhoto: text (URL)
  Password: text (hashed with Argon2)
  Username: varchar(16) (unique)
  ActivationCode: varchar(255) (unique)
  Bio: varchar(255)
  Hidden: boolean (default: false)
  InviteCodeUsed: varchar(255)
  CreatedAt: date
}
```

**Relationships:**
- Has many `UserRoles`
- Has many `InviteCodeUsage`
- Has many `Posts`
- Has many `EventAttendees`
- Has many `GroupMembers`

---

#### Roles
Role definitions for RBAC system.

```typescript
Roles {
  Id: uuid (primary key)
  Name: varchar(100) (unique)
  Description: text
  Type: enum('ADMIN', 'MODERATOR', 'EVENT_MANAGER', 'USER_MANAGER', 'CONTENT_MANAGER', 'MEMBER')
  Color: varchar(7) (default: '#0284c7')
  CanManageUsers: boolean (default: false)
  CanManageEvents: boolean (default: false)
  CanManageGroups: boolean (default: false)
  CanManagePosts: boolean (default: false)
  CanEditOthersPosts: boolean (default: false)
  CanManageRoles: boolean (default: false)
  CanManageInvites: boolean (default: false)
  CanManageTheme: boolean (default: false)
  CreatedAt: timestamp
}
```

**Default Roles:**
- Administrator (all permissions)
- Moderator (content management)
- Event Manager (event management)
- Content Manager (post management)
- Member (basic access)

**Relationships:**
- Has many `UserRoles`

---

#### UserRoles
Junction table linking users to roles (many-to-many).

```typescript
UserRoles {
  Id: uuid (primary key)
  UserId: uuid (foreign key → Users.Id, cascade delete)
  RoleId: uuid (foreign key → Roles.Id, cascade delete)
  AssignedBy: uuid (foreign key → Users.Id)
  CreatedAt: timestamp
}
```

---

### Invite System

#### InviteCodes
Manages invite codes for controlled registration.

```typescript
InviteCodes {
  Id: uuid (primary key)
  Code: varchar(32) (unique)
  CreatedBy: uuid (foreign key → Users.Id, cascade delete)
  MaxUses: integer (default: 1)
  CurrentUses: integer (default: 0)
  ExpiresAt: timestamp (nullable)
  IsActive: boolean (default: true)
  Description: text
  CreatedAt: timestamp
}
```

**Relationships:**
- Belongs to `Users` (CreatedBy)
- Has many `InviteCodeUsage`

---

#### InviteCodeUsage
Tracks invite code usage.

```typescript
InviteCodeUsage {
  Id: uuid (primary key)
  InviteCodeId: uuid (foreign key → InviteCodes.Id, cascade delete)
  UserId: uuid (foreign key → Users.Id, cascade delete)
  UsedAt: timestamp
}
```

---

### Content Management

#### Posts
Blog posts and events.

```typescript
Posts {
  Id: uuid (primary key)
  Title: varchar(255)
  Content: text
  Excerpt: text
  AuthorId: uuid (foreign key → Users.Id, cascade delete)
  Type: enum('EVENT', 'BLOG')
  PublishedAt: timestamp
  CreatedAt: timestamp
  UpdatedAt: timestamp
  Slug: varchar(255) (unique)
  FeaturedImage: text (URL)
  Status: varchar(20)
  ViewCount: integer (default: 0)
  
  // Event-specific fields
  EventDate: timestamp
  EventLocation: varchar(255)
  EventCapacity: integer
  RegistrationDeadline: timestamp
  EventType: varchar(50)
}
```

**Relationships:**
- Belongs to `Users` (AuthorId)
- Has many `PostTags`
- Has many `EventAttendees` (if Type = 'EVENT')

---

#### PostTags
Tags for categorizing posts.

```typescript
PostTags {
  Id: uuid (primary key)
  PostId: uuid (foreign key → Posts.Id, cascade delete)
  Tag: varchar(50)
  CreatedAt: timestamp
}
```

---

#### EventAttendees
Tracks event attendance.

```typescript
EventAttendees {
  Id: uuid (primary key)
  EventId: uuid (foreign key → Posts.Id, cascade delete)
  UserId: uuid (foreign key → Users.Id, cascade delete)
  Status: varchar(20) (e.g., 'registered', 'attended', 'cancelled')
  RegisteredAt: timestamp
  AttendedAt: timestamp (nullable)
}
```

---

### Organization Management

#### Groups
Student groups and committees.

```typescript
Groups {
  Id: uuid (primary key)
  Name: varchar(255) (unique)
  Description: text
  Type: enum('STANDARD', 'COMMITTEE')
  LeaderId: uuid (foreign key → Users.Id)
  CreatedAt: timestamp
  UpdatedAt: timestamp
  IsActive: boolean (default: true)
  CoverImage: text (URL)
}
```

**Relationships:**
- Belongs to `Users` (LeaderId)
- Has many `GroupMembers`

---

#### GroupMembers
Junction table for group membership.

```typescript
GroupMembers {
  Id: uuid (primary key)
  GroupId: uuid (foreign key → Groups.Id, cascade delete)
  UserId: uuid (foreign key → Users.Id, cascade delete)
  JoinedAt: timestamp
  Role: varchar(50)
}
```

---

### System Configuration

#### ThemeSettings
Customizable theme configuration.

```typescript
ThemeSettings {
  Id: uuid (primary key)
  Key: varchar(100) (unique)
  Value: text
  Description: text
  UpdatedBy: uuid (foreign key → Users.Id)
  UpdatedAt: timestamp
}
```

---

#### MediaPool
Tracks uploaded media files.

```typescript
MediaPool {
  Id: uuid (primary key)
  FileName: varchar(255)
  MimeType: varchar(100)
  Size: integer
  Path: text
  UploadedBy: uuid (foreign key → Users.Id)
  UploadedAt: timestamp
}
```

---

## Enums

### accountTypeEnum
```typescript
'org' | 'student' | 'owner'
```

### roleTypeEnum
```typescript
'ADMIN' | 'MODERATOR' | 'EVENT_MANAGER' | 'USER_MANAGER' | 'CONTENT_MANAGER' | 'MEMBER'
```

### groupTypeEnum
```typescript
'STANDARD' | 'COMMITTEE'
```

### postTypeEnum
```typescript
'EVENT' | 'BLOG'
```

### jobTypeStatusEnum
```typescript
'pending' | 'approved' | 'rejected'
```
*Note: This enum is defined but not currently used in any tables.*

---

## Database Operations

### Connection

Database connections are managed in `src/lib/server/db/index.ts`:

```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle(pool);
```

### Migrations

Managed via Drizzle Kit:

```bash
# Generate migration from schema changes
npm run db:generate

# Push schema changes directly to database (development)
npm run db:push

# Run migrations
npm run db:migrate

# Pull schema from database
npm run db:pull

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### Seeding

Initial data seeding is handled by `script/seed.ts`:

```bash
npm run db:seed
```

**Seed Data:**
- Default roles (Administrator, Moderator, Event Manager, Content Manager, Member)
- Admin user account
- Sample invite code

---

## Database Best Practices

### Queries

1. **Use Drizzle's type-safe query builder:**
   ```typescript
   const users = await db.select().from(Users).where(eq(Users.Email, email));
   ```

2. **Use relations for joins:**
   ```typescript
   const userWithRoles = await db.query.Users.findFirst({
     where: eq(Users.Id, userId),
     with: {
       userRoles: {
         with: {
           role: true
         }
       }
     }
   });
   ```

3. **Always handle null/undefined:**
   ```typescript
   const user = await db.query.Users.findFirst({...});
   if (!user) {
     throw new Error('User not found');
   }
   ```

### Transactions

For operations that must succeed or fail together:

```typescript
await db.transaction(async (tx) => {
  await tx.insert(Users).values(userData);
  await tx.insert(InviteCodeUsage).values(usageData);
});
```

### Indexing

Consider adding indexes for:
- Frequently queried columns (Email, Username)
- Foreign keys (already indexed by PostgreSQL)
- Columns used in WHERE clauses

### Security

1. **Never store plain text passwords** - Always hash with Argon2
2. **Use parameterized queries** - Drizzle handles this automatically
3. **Validate input** - Use Zod schemas before database operations
4. **Set appropriate permissions** - Use RBAC system

---

## Schema Management

### Making Schema Changes

1. Edit `src/lib/server/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Review generated SQL in `drizzle/` directory
4. Apply migration: `npm run db:migrate`

### Development vs Production

- **Development**: Use `npm run db:push` for rapid iteration (skips migrations)
- **Production**: Always use migrations (`npm run db:migrate`)

---

## Database Configuration

Configuration is in `drizzle.config.ts`:

```typescript
export default defineConfig({
  schema: './src/lib/server/db/schema.ts',
  dbCredentials: {
    url: isDevelopment ? DATABASE_URL : DATABASE_URL_PROD
  },
  verbose: true,
  strict: true,
  dialect: 'postgresql'
});
```

**Environment Variables:**
- `DATABASE_URL`: Pooled connection (development, via PgBouncer)
- `DATABASE_URL_PROD`: Direct connection (production)

---

## Common Queries

### User Authentication
```typescript
// Find user by email
const user = await db.query.Users.findFirst({
  where: eq(Users.Email, email)
});

// Get user with roles and permissions
const userWithPermissions = await db.query.Users.findFirst({
  where: eq(Users.Id, userId),
  with: {
    userRoles: {
      with: {
        role: true
      }
    }
  }
});
```

### Posts and Events
```typescript
// Get recent published posts
const posts = await db.query.Posts.findMany({
  where: and(
    eq(Posts.Status, 'published'),
    eq(Posts.Type, 'BLOG')
  ),
  orderBy: desc(Posts.PublishedAt),
  limit: 10
});
```

### Invite Codes
```typescript
// Validate invite code
const invite = await db.query.InviteCodes.findFirst({
  where: and(
    eq(InviteCodes.Code, code),
    eq(InviteCodes.IsActive, true)
  )
});

if (!invite || invite.CurrentUses >= invite.MaxUses) {
  throw new Error('Invalid or expired invite code');
}
```

---

## Database Maintenance

### Backup
Neon provides automatic backups. For manual backups:
```bash
pg_dump DATABASE_URL > backup.sql
```

### Performance Monitoring
Use Drizzle Studio to:
- View query performance
- Analyze slow queries
- Monitor table sizes

### Cleanup
Regularly check for:
- Expired invite codes
- Orphaned media files
- Inactive user accounts
