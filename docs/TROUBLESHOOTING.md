# Troubleshooting Guide

## Common Issues and Solutions

This guide covers common problems you might encounter when developing or deploying the UBSC Chapter Website.

## Setup & Installation Issues

### Database Connection Errors

#### Problem: "Connection refused" or "Cannot connect to database"

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**

1. **Check database is running:**
   ```bash
   # For Docker
   docker-compose ps
   
   # For local PostgreSQL
   systemctl status postgresql
   # or
   brew services list | grep postgresql
   ```

2. **Verify DATABASE_URL:**
   - Check `.env` file exists
   - Verify connection string format:
     ```
     postgresql://user:password@host:port/database?sslmode=require
     ```
   - For Neon, ensure `?sslmode=require` is included

3. **Test connection manually:**
   ```bash
   psql $DATABASE_URL
   ```

4. **Check firewall/security groups:**
   - Ensure database accepts connections from your IP
   - For Neon, verify IP allowlist settings

---

#### Problem: "SSL connection required"

**Solution:**
Add `?sslmode=require` to your DATABASE_URL:
```bash
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
```

---

#### Problem: "Database does not exist"

**Solution:**
Create the database:
```bash
# For local PostgreSQL
createdb ubsc_chapter

# For Neon, create via web interface
```

---

### Environment Variable Issues

#### Problem: Environment variables not loading

**Symptoms:**
- `undefined` values in code
- Build errors about missing variables
- Authentication failures

**Solutions:**

1. **Verify .env file exists:**
   ```bash
   ls -la .env
   ```

2. **Check file format:**
   - No spaces around `=`
   - No quotes unless value contains spaces
   - One variable per line
   ```bash
   CORRECT=value
   WRONG = "value"  # Spaces cause issues
   ```

3. **Restart development server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

4. **Check variable names:**
   - Private variables: Available only server-side
   - `PUBLIC_` prefix: Available client and server-side

---

### Installation Errors

#### Problem: `npm install` fails

**Solutions:**

1. **Clear cache and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install
   ```

2. **Check Node.js version:**
   ```bash
   node --version  # Should be 18.x or higher
   ```

3. **Use correct package manager:**
   - This project uses npm, not yarn or pnpm
   - Check for `.npmrc` file for specific configurations

4. **Check for Python (required for some native modules):**
   ```bash
   python --version  # Should be Python 3.x
   ```

---

## Development Issues

### Build Errors

#### Problem: TypeScript errors during build

**Solutions:**

1. **Run type checking:**
   ```bash
   npm run check
   ```

2. **Common fixes:**
   ```typescript
   // Fix: Type imports
   import type { PageData } from './$types';
   
   // Fix: Props in Svelte 5
   let { data }: { data: PageData } = $props();
   
   // Fix: Nullable values
   if (!user) return; // Guard against null
   ```

3. **Update TypeScript:**
   ```bash
   npm install typescript@latest --save-dev
   ```

---

#### Problem: "Cannot find module" errors

**Solutions:**

1. **Check import paths:**
   ```typescript
   // Correct
   import { db } from '$lib/server/db';
   
   // Wrong
   import { db } from '../../../lib/server/db';
   ```

2. **Verify file exists:**
   ```bash
   ls src/lib/server/db/index.ts
   ```

3. **Clear `.svelte-kit` cache:**
   ```bash
   rm -rf .svelte-kit
   npm run dev
   ```

---

#### Problem: Build succeeds but app crashes on load

**Solution:**
Check for:
- Missing environment variables
- Database connection issues
- Import errors (importing server-only code in client)
- Circular dependencies

**Debug:**
```bash
# Check build output
npm run build

# Preview production build locally
npm run preview
```

---

### Drizzle ORM Issues

#### Problem: "Table does not exist"

**Solutions:**

1. **Push schema to database:**
   ```bash
   npm run db:push
   ```

2. **Or run migrations:**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

3. **Verify database connection:**
   ```bash
   npm run db:studio
   ```

---

#### Problem: Migration errors

**Symptoms:**
```
ERROR: column "column_name" already exists
```

**Solutions:**

1. **Review migration SQL:**
   Check `drizzle/` folder for generated SQL

2. **Drop and recreate (development only):**
   ```bash
   # WARNING: Deletes all data!
   npm run db:push -- --force
   ```

3. **Manual fix:**
   ```bash
   psql $DATABASE_URL
   # Manually adjust schema to match
   ```

4. **Start fresh (development only):**
   ```bash
   # Drop database and recreate
   npm run db:push
   npm run db:seed
   ```

---

### Authentication Issues

#### Problem: "Invalid token" or session not persisting

**Solutions:**

1. **Check JWT_SECRET is set:**
   ```bash
   grep JWT_SECRET .env
   ```

2. **Clear cookies:**
   - Open browser DevTools
   - Application/Storage → Cookies
   - Delete `auth_token` cookie
   - Try logging in again

3. **Verify cookie settings:**
   ```typescript
   // In development, ensure secure is false
   SESSION_SECURE=false  // .env file
   ```

4. **Check token expiration:**
   - Default is 72 hours
   - If system time is wrong, tokens may be invalid

---

#### Problem: "Unauthorized" on protected routes

**Solutions:**

1. **Verify user is logged in:**
   - Check for `auth_token` cookie in DevTools

2. **Check route protection in `hooks.server.ts`:**
   ```typescript
   // Ensure logic matches your needs
   if (event.url.pathname.startsWith('/dashboard')) {
     if (!event.locals.user) {
       throw redirect(302, '/auth/login');
     }
   }
   ```

3. **Verify permissions:**
   ```typescript
   // Check user has required permission
   if (!locals.user?.Permissions.CanManageEvents) {
     // Insufficient permissions
   }
   ```

---

### Form Submission Issues

#### Problem: Form submission fails silently

**Solutions:**

1. **Check form action exists:**
   ```typescript
   // +page.server.ts must export actions
   export const actions: Actions = {
     default: async ({ request }) => {
       // Handle form
     }
   };
   ```

2. **Verify CSRF protection:**
   - Ensure form is using SvelteKit's `use:enhance`
   ```svelte
   <form method="POST" use:enhance>
   ```

3. **Check validation errors:**
   ```svelte
   {#if $errors.email}
     <span class="error">{$errors.email}</span>
   {/if}
   ```

4. **Debug in browser:**
   - Open Network tab
   - Submit form
   - Check request/response

---

## Deployment Issues

### Fly.io Deployment

#### Problem: Deployment fails

**Solutions:**

1. **Check build logs:**
   ```bash
   fly logs
   ```

2. **Verify secrets are set:**
   ```bash
   fly secrets list
   ```

3. **Test build locally:**
   ```bash
   docker build -t test .
   docker run -p 3000:3000 test
   ```

4. **Check fly.toml configuration:**
   - Verify app name
   - Check internal port (should be 3000)
   - Ensure region is valid

---

#### Problem: App deployed but crashes

**Solutions:**

1. **Check logs:**
   ```bash
   fly logs --tail
   ```

2. **Common causes:**
   - Missing environment variables
   - Database connection issues
   - Port mismatch

3. **SSH into machine:**
   ```bash
   fly ssh console
   # Check environment, test database connection
   ```

---

### Vercel Deployment

#### Problem: Build fails on Vercel

**Solutions:**

1. **Check build logs in Vercel dashboard**

2. **Verify adapter configuration:**
   ```javascript
   // svelte.config.js
   // Should use adapter-vercel for Vercel
   ```

3. **Check Node.js version:**
   - Set in Vercel project settings
   - Should be 18.x or higher

4. **Environment variables:**
   - Ensure all required variables are set in Vercel dashboard

---

### Database Migration Issues in Production

#### Problem: Migrations fail in production

**Solutions:**

1. **Run migrations manually:**
   ```bash
   # From local machine
   DATABASE_URL=$PROD_DB_URL npm run db:migrate
   ```

2. **Check migration SQL:**
   - Review generated SQL before applying
   - Test in staging environment first

3. **Backup before migrating:**
   ```bash
   pg_dump $DATABASE_URL_PROD > backup.sql
   ```

---

## Performance Issues

### Slow Database Queries

**Solutions:**

1. **Add indexes:**
   ```typescript
   // In schema.ts
   export const Users = pgTable('Users', {
     Email: varchar('email', { length: 64 }).unique().notNull(),
     // .unique() automatically creates an index
   });
   ```

2. **Use query analysis:**
   ```bash
   npm run db:studio
   # View query performance
   ```

3. **Limit results:**
   ```typescript
   const posts = await db.query.Posts.findMany({
     limit: 10,  // Don't load all records
     offset: page * 10
   });
   ```

4. **Use select instead of findMany for large datasets:**
   ```typescript
   const users = await db.select({
     id: Users.Id,
     email: Users.Email
   }).from(Users).limit(100);
   ```

---

### Slow Page Loads

**Solutions:**

1. **Check Network tab:**
   - Identify slow requests
   - Optimize or cache

2. **Optimize images:**
   - Use WebP format
   - Implement lazy loading
   - Use appropriate sizes

3. **Code splitting:**
   - Already handled by SvelteKit
   - Verify heavy components are lazy-loaded

4. **Database query optimization:**
   - Load only needed data
   - Use pagination
   - Implement caching

---

## Runtime Errors

### "Cannot read property of undefined"

**Solutions:**

1. **Add null checks:**
   ```typescript
   // Before
   const name = user.firstName;
   
   // After
   const name = user?.firstName ?? 'Guest';
   ```

2. **Use optional chaining:**
   ```typescript
   const permission = user?.Permissions?.CanManageEvents ?? false;
   ```

3. **Guard clauses:**
   ```typescript
   if (!user) {
     return error(401, 'Unauthorized');
   }
   // Now safe to use user
   ```

---

### "Hydration mismatch" errors

**Solutions:**

1. **Ensure server and client render the same:**
   - Avoid using browser APIs during SSR
   - Use `browser` check from `$app/environment`

2. **Example fix:**
   ```typescript
   import { browser } from '$app/environment';
   
   let value = $state(0);
   
   $effect(() => {
     if (browser) {
       value = localStorage.getItem('key');
     }
   });
   ```

---

## Email Issues

### Emails not sending

**Solutions:**

1. **Verify email configuration:**
   ```bash
   grep MAIL .env
   ```

2. **Test SMTP connection:**
   ```bash
   # Use a tool like swaks
   swaks --to test@example.com \
     --from $MAIL_USERNAME \
     --server smtp.gmail.com:587 \
     --auth LOGIN \
     --auth-user $MAIL_USERNAME \
     --auth-password $MAIL_PASSWORD
   ```

3. **Check email provider settings:**
   - Gmail: May need "App Password" instead of account password
   - Enable "Less secure app access" if using Gmail

4. **Check spam folder**

---

## Docker Issues

### Container won't start

**Solutions:**

1. **Check logs:**
   ```bash
   docker-compose logs
   ```

2. **Rebuild:**
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up
   ```

3. **Check ports:**
   ```bash
   # Ensure ports aren't already in use
   lsof -i :3000
   lsof -i :5432
   ```

---

## Development Server Issues

### Port already in use

**Solutions:**

1. **Kill process on port:**
   ```bash
   # macOS/Linux
   lsof -ti:5173 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :5173
   taskkill /PID [PID] /F
   ```

2. **Use different port:**
   ```bash
   npm run dev -- --port 3000
   ```

---

### Hot reload not working

**Solutions:**

1. **Restart dev server**

2. **Clear .svelte-kit cache:**
   ```bash
   rm -rf .svelte-kit
   ```

3. **Check for syntax errors:**
   - A syntax error can break HMR

4. **Increase file watch limit (Linux):**
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

---

## Browser Issues

### "Mixed content" errors

**Solution:**
Ensure all resources use HTTPS in production, or use protocol-relative URLs.

---

### Session/Cookie issues

**Solutions:**

1. **Clear browser cache and cookies**

2. **Check cookie settings:**
   - In production: `SESSION_SECURE=true` (HTTPS only)
   - In development: `SESSION_SECURE=false`

3. **Verify domain in cookie:**
   - Cookies won't work across different domains

---

## Getting Additional Help

### Where to look:

1. **Application logs:**
   ```bash
   # Development
   Terminal running npm run dev
   
   # Production (Fly.io)
   fly logs
   ```

2. **Browser console:**
   - F12 → Console tab
   - Check for JavaScript errors

3. **Network tab:**
   - F12 → Network tab
   - Check failed requests

4. **Database logs:**
   ```bash
   npm run db:studio
   ```

### Debugging tips:

1. **Add console.logs:**
   ```typescript
   console.log('Debug:', { user, data });
   ```

2. **Use debugger:**
   ```typescript
   debugger;  // Browser will pause here
   ```

3. **Check TypeScript types:**
   ```bash
   npm run check
   ```

4. **Verify environment:**
   ```bash
   echo $NODE_ENV
   grep IS_DEVELOPMENT .env
   ```

---

## Still Stuck?

1. Review relevant documentation:
   - [SETUP.md](SETUP.md) for setup issues
   - [DEVELOPMENT.md](DEVELOPMENT.md) for development issues
   - [DEPLOYMENT.md](DEPLOYMENT.md) for deployment issues
   - [DATABASE.md](DATABASE.md) for database issues
   - [API.md](API.md) for API issues

2. Check official documentation:
   - [SvelteKit Docs](https://kit.svelte.dev/docs)
   - [Drizzle ORM Docs](https://orm.drizzle.team/docs)
   - [Fly.io Docs](https://fly.io/docs)

3. Search GitHub issues (for this project and dependencies)

4. Create a detailed issue report with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)
   - What you've tried so far
