# Deployment Guide

## Overview

The UBSC Chapter Website can be deployed to multiple platforms. This guide covers deployment to Fly.io (recommended) and Vercel (alternative).

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Initial data seeded (roles, admin user)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Tests pass (when test infrastructure exists)
- [ ] Security review completed
- [ ] JWT secrets changed from defaults
- [ ] Email configuration verified
- [ ] Domain/DNS configured

## Environment Configuration for Production

### Required Environment Variables

```bash
# Build Identity
IS_DEVELOPMENT=false
IS_STAGING=false  # or true for staging
IS_PRODUCTION=true
DEBUG=false

# Database
DATABASE_URL="postgresql://..." # Pooled connection
DATABASE_URL_PROD="postgresql://..." # Direct connection (non-pooled)

# Security - MUST CHANGE THESE
JWT_SECRET="your-production-jwt-secret-here-use-strong-random-string"
ACT_JWT_SECRET="your-production-activation-secret-here-use-strong-random-string"

# Session Configuration
SESSION_SAMESITE=lax
SESSION_HTTP_ONLY=true
SESSION_SECURE=true  # MUST be true for HTTPS
SESSION_MAX_AGE=259200  # 72 hours

# Platform URLs
PLATFORM_URL="https://ubsc-chapter.ub.edu.bz"
PLATFORM_URL_DEVELOPMENT="http://localhost:5173"

# Email (Production credentials)
MAIL_DISPLAYNAME="UBSC Chapter"
MAIL_USERNAME="noreply@ubsc-chapter.ub.edu.bz"
MAIL_PASSWORD="your-email-password"
MAIL_SIGNATURE="UBSC Chapter IT Team"
PUBLIC_SUPPORT_EMAIL="support@ubsc-chapter.ub.edu.bz"
```

### Generating Secure Secrets

```bash
# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Deployment to Fly.io (Recommended)

Fly.io is configured as the primary deployment platform with full Docker support.

### Prerequisites

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Sign up/Login:**
   ```bash
   fly auth signup  # or fly auth login
   ```

### Initial Setup

1. **Configure Fly.io:**

   The `fly.toml` file is already configured:
   ```toml
   app = 'talentpool-six'
   primary_region = 'iad'
   
   [http_service]
     internal_port = 3000
     force_https = true
     auto_stop_machines = 'stop'
     auto_start_machines = true
     min_machines_running = 0
   ```

2. **Create App (if not exists):**
   ```bash
   fly apps create ubsc-chapter
   ```

3. **Set Secrets:**
   ```bash
   fly secrets set JWT_SECRET="your-secret-here"
   fly secrets set ACT_JWT_SECRET="your-activation-secret-here"
   fly secrets set DATABASE_URL="postgresql://..."
   fly secrets set DATABASE_URL_PROD="postgresql://..."
   fly secrets set MAIL_USERNAME="your-email"
   fly secrets set MAIL_PASSWORD="your-password"
   fly secrets set IS_PRODUCTION=true
   fly secrets set IS_DEVELOPMENT=false
   fly secrets set SESSION_SECURE=true
   ```

4. **Deploy:**
   ```bash
   fly deploy
   ```

### Database Setup on Fly.io

**Option 1: Use Neon (Recommended)**
- Create Neon database
- Set connection strings as secrets
- Apply migrations

**Option 2: Fly Postgres**
```bash
fly postgres create
fly postgres attach <postgres-app-name>
```

### Apply Database Migrations

```bash
# SSH into Fly.io machine
fly ssh console

# Run migrations
cd /app
node -e "require('dotenv').config(); require('drizzle-kit').migrate();"
```

Or run migrations from local machine:
```bash
DATABASE_URL="your-production-db-url" npm run db:migrate
```

### Custom Domain

1. **Add Certificate:**
   ```bash
   fly certs create ubsc-chapter.ub.edu.bz
   ```

2. **Configure DNS:**
   Add CNAME record:
   ```
   ubsc-chapter.ub.edu.bz → [your-app].fly.dev
   ```

3. **Verify:**
   ```bash
   fly certs check ubsc-chapter.ub.edu.bz
   ```

### Monitoring

```bash
# View logs
fly logs

# Check status
fly status

# View metrics
fly dashboard
```

### Scaling

```bash
# Scale machines
fly scale count 2

# Change machine size
fly scale vm shared-cpu-2x

# Set autoscaling
fly autoscale set min=1 max=3
```

## Deployment to Vercel (Alternative)

Vercel is configured as an alternative deployment option, primarily for development.

### Prerequisites

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

### Setup

1. **Link Project:**
   ```bash
   vercel link
   ```

2. **Configure Environment Variables:**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all required environment variables
   - Or use CLI:
     ```bash
     vercel env add JWT_SECRET
     vercel env add DATABASE_URL
     # ... etc
     ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Database for Vercel

**Use Neon or Vercel Postgres:**

1. **Neon (Recommended):**
   - Create Neon database
   - Configure connection strings in Vercel environment variables

2. **Vercel Postgres:**
   - Create Vercel Postgres database
   - Link to project
   - Connection strings automatically added to environment

### Notes on Vercel

- Uses `@sveltejs/adapter-vercel` when `IS_DEVELOPMENT=true`
- Serverless functions have limitations (execution time, memory)
- May require different configuration for file uploads
- Built-in edge network for global performance

## Database Hosting

### Neon (Recommended)

**Advantages:**
- Serverless PostgreSQL
- Automatic scaling
- Connection pooling (PgBouncer)
- Free tier available
- Excellent SvelteKit integration

**Setup:**
1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection strings (pooled and direct)
4. Use pooled connection for app, direct for migrations

### Other PostgreSQL Providers

- **Supabase**: PostgreSQL with additional services
- **Railway**: PostgreSQL with simple deployment
- **DigitalOcean Managed Database**: Traditional managed PostgreSQL
- **AWS RDS**: Enterprise-grade PostgreSQL

## CI/CD Setup

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linter
        run: npm run lint
        
      - name: Type check
        run: npm run check
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Fly.io
        uses: superfly/flyctl-actions/setup-flyctl@master
      
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### Setting up GitHub Secrets

1. Go to Repository Settings → Secrets and Variables → Actions
2. Add required secrets:
   - `FLY_API_TOKEN` (get from `fly auth token`)
   - Other environment-specific secrets

## SSL/TLS Configuration

### Fly.io
SSL is automatic with `force_https = true` in `fly.toml`.

### Vercel
SSL is automatic for all deployments.

### Custom Setup
If using custom reverse proxy:
- Use Let's Encrypt for free SSL certificates
- Configure certbot for automatic renewal
- Ensure proper redirect from HTTP to HTTPS

## Performance Optimization

### Build Optimizations

1. **Ensure production build:**
   ```bash
   NODE_ENV=production npm run build
   ```

2. **Check bundle size:**
   ```bash
   npm run build -- --analyze
   ```

### Runtime Optimizations

1. **Database Connection Pooling:**
   - Use pooled connection (PgBouncer on Neon)
   - Configure appropriate pool size

2. **Caching:**
   - Add Redis for session caching (future enhancement)
   - Use HTTP caching headers
   - Enable CDN for static assets

3. **Image Optimization:**
   - Use WebP/AVIF formats
   - Implement lazy loading
   - Use responsive images

## Backup Strategy

### Database Backups

**Neon:**
- Automatic daily backups
- Point-in-time recovery available
- Download backups from dashboard

**Manual Backup:**
```bash
pg_dump $DATABASE_URL_PROD > backup-$(date +%Y%m%d).sql
```

**Automated Backup Script:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
pg_dump $DATABASE_URL_PROD | gzip > backups/backup-$DATE.sql.gz
# Upload to S3, Google Cloud Storage, etc.
```

### Media Backups

If using local file storage:
- Regular backups of upload directory
- Consider S3 or cloud storage for production

## Monitoring and Logging

### Application Monitoring

**Recommended Services:**
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Datadog**: Full-stack monitoring

**Setup Example (Sentry):**
```bash
npm install @sentry/sveltekit
```

Configure in `hooks.server.ts`:
```typescript
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: IS_PRODUCTION ? 'production' : 'development'
});
```

### Log Management

**Fly.io:**
```bash
# Live logs
fly logs

# Export logs
fly logs > app-logs.txt
```

**Structured Logging:**
Consider adding a logging library:
```bash
npm install pino
```

## Health Checks

Add health check endpoint: `src/routes/health/+server.ts`

```typescript
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export const GET: RequestHandler = async () => {
  try {
    // Test database connection
    await db.execute(sql`SELECT 1`);
    
    return json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    }, { status: 503 });
  }
};
```

## Rollback Procedure

### Fly.io Rollback

```bash
# List releases
fly releases

# Rollback to previous release
fly deploy --image [previous-image-id]
```

### Vercel Rollback

1. Go to Vercel Dashboard
2. Select deployment
3. Click "Promote to Production"

### Database Rollback

```bash
# Restore from backup
psql $DATABASE_URL_PROD < backup-20240101.sql

# Or use Neon's point-in-time recovery
```

## Security Hardening

### Pre-Production Security Checklist

- [ ] Change all default credentials
- [ ] Use environment variables for secrets (never commit)
- [ ] Enable HTTPS only (`SESSION_SECURE=true`)
- [ ] Configure CSP headers
- [ ] Set up rate limiting
- [ ] Review CORS settings
- [ ] Audit dependencies for vulnerabilities
- [ ] Enable database SSL connections
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerts
- [ ] Review and test error handling
- [ ] Validate all user inputs

### Security Headers

Add to `hooks.server.ts`:

```typescript
response.headers.set('X-Frame-Options', 'DENY');
response.headers.set('X-Content-Type-Options', 'nosniff');
response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
```

## Post-Deployment Steps

1. **Verify Deployment:**
   - Check application loads
   - Test authentication flow
   - Verify database connectivity
   - Test critical user flows

2. **Seed Production Data:**
   ```bash
   # Run from local with production DATABASE_URL
   DATABASE_URL=$PROD_DB_URL npm run db:seed
   ```

3. **Create Admin Account:**
   - Login with seeded admin
   - Change default password
   - Create additional admin accounts if needed

4. **Configure Email:**
   - Test email sending
   - Verify SMTP settings
   - Check spam folder

5. **Monitor Logs:**
   - Watch for errors
   - Check performance metrics
   - Verify no security issues

## Troubleshooting Deployment

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common deployment issues and solutions.

## Maintenance

### Regular Tasks

- **Weekly:**
  - Review logs for errors
  - Check performance metrics
  - Monitor database size

- **Monthly:**
  - Update dependencies
  - Review security advisories
  - Test backup restoration
  - Clean up old data

- **Quarterly:**
  - Security audit
  - Performance review
  - Cost optimization review

## Cost Optimization

### Fly.io
- Use `auto_stop_machines` for low-traffic periods
- Optimize machine size based on actual usage
- Use shared CPU for development/staging

### Database
- Archive old data
- Optimize queries
- Use appropriate connection pooling
- Monitor storage usage

## Support and Resources

- **Fly.io Docs**: https://fly.io/docs
- **Vercel Docs**: https://vercel.com/docs
- **SvelteKit Deployment**: https://kit.svelte.dev/docs/adapters
- **Neon Docs**: https://neon.tech/docs
