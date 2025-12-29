# Development Guide

## Development Workflow

### Getting Started

1. Ensure you've completed the [Setup Guide](SETUP.md)
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser

### Hot Module Replacement (HMR)

The development server supports HMR. Changes to `.svelte`, `.ts`, `.js`, and `.css` files will automatically reload in the browser without losing state.

## Project Structure

### Key Directories

```
src/
├── lib/                    # Shared code
│   ├── components/        # Reusable components
│   ├── server/           # Server-side code
│   ├── templates/        # Page templates
│   └── types/            # TypeScript definitions
├── routes/               # Pages and API endpoints
└── app.css              # Global styles
```

### Component Organization

- **Global Components**: `src/lib/components/global/` - Site-wide components (footer, header)
- **Public Components**: `src/lib/components/public/` - Public-facing components
- **Vendor Components**: `src/lib/components/vendor/ui/` - Third-party UI components
- **Route Components**: Specific to individual routes

## Coding Standards

### TypeScript

1. **Always use TypeScript** - Avoid `.js` files unless necessary
2. **Define types for all data structures:**
   ```typescript
   interface User {
     id: string;
     email: string;
     firstName: string;
     lastName: string;
   }
   ```
3. **Use type imports:**
   ```typescript
   import type { PageData } from './$types';
   ```
4. **Avoid `any`** - Use specific types or `unknown`

### Svelte Components

1. **Use Svelte 5 Runes:**
   ```svelte
   <script lang="ts">
     let count = $state(0);
     let doubled = $derived(count * 2);
   </script>
   ```

2. **Component Structure:**
   ```svelte
   <script lang="ts">
     // Imports
     import { onMount } from 'svelte';
     
     // Props
     let { data }: { data: PageData } = $props();
     
     // State
     let count = $state(0);
     
     // Derived state
     let doubled = $derived(count * 2);
     
     // Functions
     function increment() {
       count++;
     }
     
     // Lifecycle
     onMount(() => {
       // ...
     });
   </script>
   
   <div>
     <!-- Template -->
   </div>
   
   <style>
     /* Component styles */
   </style>
   ```

3. **Props Naming:**
   - Use PascalCase for props that are components
   - Use camelCase for data props

### Styling

1. **Use Tailwind CSS** for styling:
   ```svelte
   <div class="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
   ```

2. **Use `cn()` helper** for conditional classes:
   ```typescript
   import { cn } from '$lib/utils';
   
   <div class={cn(
     "base-class",
     isActive && "active-class",
     variant === 'primary' && "primary-class"
   )}>
   ```

3. **Component-specific styles** in `<style>` tags when necessary:
   ```svelte
   <style>
     .custom-class {
       /* CSS that can't be done with Tailwind */
     }
   </style>
   ```

### Naming Conventions

1. **Files:**
   - Components: `PascalCase.svelte` (e.g., `UserProfile.svelte`)
   - Routes: lowercase with hyphens (e.g., `user-profile/+page.svelte`)
   - Utilities: `camelCase.ts` (e.g., `formatDate.ts`)

2. **Variables:**
   - Constants: `UPPER_SNAKE_CASE`
   - Variables: `camelCase`
   - Types/Interfaces: `PascalCase`

3. **Functions:**
   - Regular functions: `camelCase`
   - Component functions: `PascalCase`

## SvelteKit Patterns

### Page Data Loading

**Server-side data loading** (`+page.server.ts`):

```typescript
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  
  const posts = await db.query.Posts.findMany({
    limit: 10
  });
  
  return {
    user,
    posts
  };
};
```

### Form Actions

**Server-side form handling** (`+page.server.ts`):

```typescript
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod(schema));
    
    if (!form.valid) {
      return fail(400, { form });
    }
    
    // Process form data
    
    return { form };
  }
};
```

**Client-side form** (`+page.svelte`):

```svelte
<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  
  let { data } = $props();
  
  const { form, errors, enhance } = superForm(data.form);
</script>

<form method="POST" use:enhance>
  <input name="email" bind:value={$form.email} />
  {#if $errors.email}
    <span class="error">{$errors.email}</span>
  {/if}
  
  <button type="submit">Submit</button>
</form>
```

### API Routes

**Creating API endpoints** (`+server.ts`):

```typescript
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
  // Handle GET request
  return json({ success: true, data: {} });
};

export const POST: RequestHandler = async ({ request, locals }) => {
  const body = await request.json();
  
  // Validate and process
  
  return json({ success: true });
};
```

## Database Operations

### Querying Data

```typescript
import { db } from '$lib/server/db';
import { Users, Posts } from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';

// Simple query
const users = await db.select().from(Users).where(eq(Users.Email, email));

// Query with relations
const user = await db.query.Users.findFirst({
  where: eq(Users.Id, userId),
  with: {
    userRoles: {
      with: {
        role: true
      }
    }
  }
});

// Complex query
const posts = await db.select()
  .from(Posts)
  .where(and(
    eq(Posts.Status, 'published'),
    eq(Posts.Type, 'BLOG')
  ))
  .orderBy(desc(Posts.PublishedAt))
  .limit(10);
```

### Inserting Data

```typescript
// Single insert
const [newUser] = await db.insert(Users).values({
  FirstName: 'John',
  LastName: 'Doe',
  Email: 'john@example.com',
  // ... other fields
}).returning();

// Multiple inserts
await db.insert(Users).values([
  { /* user 1 */ },
  { /* user 2 */ }
]);
```

### Updating Data

```typescript
await db.update(Users)
  .set({ FirstName: 'Jane' })
  .where(eq(Users.Id, userId));
```

### Deleting Data

```typescript
await db.delete(Users).where(eq(Users.Id, userId));
```

### Transactions

```typescript
await db.transaction(async (tx) => {
  await tx.insert(Users).values(userData);
  await tx.insert(InviteCodeUsage).values(usageData);
  await tx.update(InviteCodes)
    .set({ CurrentUses: sql`${InviteCodes.CurrentUses} + 1` })
    .where(eq(InviteCodes.Id, inviteId));
});
```

## Authentication

### Protecting Routes

Routes are protected in `src/hooks.server.ts`:

```typescript
// Protect dashboard routes
if (event.url.pathname.startsWith('/dashboard')) {
  if (!event.locals.user) {
    throw redirect(302, '/auth/login');
  }
}

// Protect admin routes
if (event.url.pathname.startsWith('/dashboard/admin')) {
  if (!event.locals.user?.Administrator) {
    throw redirect(302, '/dashboard');
  }
}
```

### Accessing User in Pages

```typescript
// In +page.server.ts
export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user; // Authenticated user or null
  
  return { user };
};
```

### Checking Permissions

```typescript
// In server code
if (!locals.user?.Permissions.CanManagePosts) {
  throw error(403, 'Insufficient permissions');
}
```

## Form Validation

Using Zod and Superforms:

```typescript
import { z } from 'zod';

const userSchema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
```

## Internationalization

### Using Translations

```svelte
<script>
  import * as m from '$lib/paraglide/messages';
</script>

<h1>{m.welcome()}</h1>
<p>{m.welcome_description()}</p>
```

### Adding Translations

Edit `i18n/en.json` and `i18n/es.json`:

```json
{
  "new_key": "English text",
  "new_key_with_param": "Hello {name}"
}
```

## Testing

Currently, there is no test infrastructure set up. When adding tests:

1. Use Vitest for unit tests
2. Use Playwright for E2E tests
3. Place tests next to the code they test (`ComponentName.test.ts`)

## Code Quality

### Linting

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint -- --fix
```

### Formatting

```bash
# Check formatting
npm run format

# Auto-format code
npm run format
```

### Type Checking

```bash
# Type check all files
npm run check

# Watch mode for type checking
npm run check:watch
```

## Common Tasks

### Creating a New Page

1. Create route directory: `src/routes/new-page/`
2. Add `+page.svelte`:
   ```svelte
   <script lang="ts">
     import type { PageData } from './$types';
     let { data }: { data: PageData } = $props();
   </script>
   
   <h1>New Page</h1>
   ```
3. Optionally add `+page.server.ts` for server-side logic
4. Optionally add `+layout.svelte` for page-specific layout

### Creating a New API Endpoint

1. Create route directory: `src/routes/(app)/api/endpoint/`
2. Add `+server.ts`:
   ```typescript
   import type { RequestHandler } from './$types';
   import { json } from '@sveltejs/kit';
   
   export const POST: RequestHandler = async ({ request, locals }) => {
     // Handle request
     return json({ success: true });
   };
   ```

### Adding a Database Table

1. Edit `src/lib/server/db/schema.ts`
2. Define the table:
   ```typescript
   export const NewTable = pgTable('NewTable', {
     Id: uuid('id').primaryKey().defaultRandom(),
     Name: varchar('name', { length: 255 }).notNull(),
     CreatedAt: timestamp('created_at').defaultNow()
   });
   ```
3. Add relations if needed
4. Generate migration: `npm run db:generate`
5. Apply migration: `npm run db:migrate`

### Creating a New Component

1. Create file in appropriate directory (e.g., `src/lib/components/MyComponent.svelte`)
2. Define component:
   ```svelte
   <script lang="ts">
     interface Props {
       title: string;
       content?: string;
     }
     
     let { title, content = '' }: Props = $props();
   </script>
   
   <div>
     <h2>{title}</h2>
     {#if content}
       <p>{content}</p>
     {/if}
   </div>
   ```
3. Export from `index.ts` if needed for easier imports

## Performance Best Practices

1. **Lazy load components:**
   ```typescript
   const HeavyComponent = lazy(() => import('./HeavyComponent.svelte'));
   ```

2. **Optimize images:**
   - Use appropriate formats (WebP, AVIF)
   - Use responsive images
   - Lazy load images below the fold

3. **Database query optimization:**
   - Use indexes on frequently queried columns
   - Limit results with `.limit()`
   - Use pagination for large datasets
   - Select only needed columns

4. **Avoid unnecessary re-renders:**
   - Use `$derived` for computed values
   - Memoize expensive calculations

## Debugging

### Server-Side Debugging

Add console.logs in server code:
```typescript
console.log('Debug info:', data);
```

Logs appear in the terminal running `npm run dev`.

### Client-Side Debugging

1. Use browser DevTools
2. Add breakpoints in `.svelte` files
3. Use `console.log()` in script sections

### Database Debugging

Use Drizzle Studio:
```bash
npm run db:studio
```

Or check raw SQL queries:
```typescript
import { sql } from 'drizzle-orm';

const result = await db.execute(sql`SELECT * FROM "Users"`);
```

## Git Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feature/new-feature
   ```

2. Make changes and commit:
   ```bash
   git add .
   git commit -m "Add new feature"
   ```

3. Push and create pull request:
   ```bash
   git push origin feature/new-feature
   ```

## Additional Resources

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Svelte 5 Documentation](https://svelte.dev/docs/svelte/overview)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
