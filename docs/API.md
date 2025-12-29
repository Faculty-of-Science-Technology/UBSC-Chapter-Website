# API Documentation

## Overview

The UBSC Chapter Website provides a RESTful API for authentication, user management, and content operations. API routes are organized under `src/routes/(app)/api/`.

## Base URL

- **Development**: `http://localhost:5173/api`
- **Production**: `https://ubsc-chapter.ub.edu.bz/api` (or your configured domain)

## Authentication

The API uses JWT (JSON Web Token) authentication with httpOnly cookies.

### Authentication Flow

1. **Register** → Receive auth token
2. **Login** → Receive auth token
3. **Subsequent Requests** → Token automatically sent via cookie
4. **Logout** → Token invalidated

### Headers

No special headers required - authentication is handled via cookies.

For CSRF protection, SvelteKit automatically handles tokens.

## API Endpoints

### Authentication

#### POST `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "securepassword123",
  "phone": "+501-123-4567",
  "inviteCode": "INVITE-CODE-HERE"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Invalid invite code"
}
```

**Validation Rules:**
- First name: Required, min 1 character
- Last name: Required, min 1 character
- Email: Required, valid email format, must be unique
- Username: Required, 3-16 characters, alphanumeric + underscore, must be unique
- Password: Required, minimum 8 characters
- Invite code: Required, must be valid and not expired

---

#### POST `/api/auth/login`

Authenticate and receive session token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "administrator": false,
    "permissions": {
      "CanManageUsers": false,
      "CanManageEvents": true,
      "CanManageGroups": false,
      "CanManagePosts": true,
      "CanEditOthersPosts": false,
      "CanManageRoles": false,
      "CanManageInvites": false,
      "CanManageTheme": false
    }
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Side Effect:** Sets `auth_token` httpOnly cookie with JWT.

---

#### POST `/api/auth/logout`

Invalidate current session.

**Request:** No body required

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Side Effect:** Clears `auth_token` cookie.

---

#### POST `/api/auth/validate-invite`

Validate an invite code before registration.

**Request Body:**
```json
{
  "inviteCode": "INVITE-CODE-HERE"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "valid": true,
  "message": "Invite code is valid"
}
```

**Response (Invalid - 200):**
```json
{
  "success": true,
  "valid": false,
  "message": "Invalid or expired invite code"
}
```

---

### User Management

#### POST `/api/users/[id]/profile-photo`

Upload user profile photo.

**Authentication:** Required - User must be authenticated and updating their own photo

**Request:** multipart/form-data
```
photo: [File]
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile photo updated",
  "url": "/api/media/[media-id]"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Invalid file type"
}
```

**Allowed File Types:** image/jpeg, image/png, image/webp, image/gif

**Max File Size:** Configurable (default: 5MB)

---

#### POST `/api/users/[id]/cover-photo`

Upload user cover photo.

**Authentication:** Required - User must be authenticated and updating their own photo

**Request:** multipart/form-data
```
photo: [File]
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Cover photo updated",
  "url": "/api/media/[media-id]"
}
```

**Similar validation as profile photo.**

---

### Media

#### GET `/api/media/[id]`

Retrieve uploaded media file.

**Authentication:** Optional (depends on media visibility settings)

**Response:** Binary file data with appropriate Content-Type header

**Example:**
```
GET /api/media/550e8400-e29b-41d4-a716-446655440000
```

Returns the image file with appropriate headers.

---

## Server-Side Form Actions

In addition to API endpoints, the application uses SvelteKit form actions for many operations. These are submitted via HTML forms with progressive enhancement.

### Dashboard Routes

#### Admin - Users (`/dashboard/admin/users`)

**Actions:**
- Create user
- Update user roles
- Delete user
- Toggle user status

#### Admin - Roles (`/dashboard/admin/roles`)

**Actions:**
- Create role
- Update role permissions
- Delete role

#### Admin - Invites (`/dashboard/admin/invites`)

**Actions:**
- Create invite code
- Deactivate invite code
- Delete invite code

#### Admin - Theme (`/dashboard/admin/theme`)

**Actions:**
- Update theme settings

#### Posts (`/dashboard/posts`)

**Actions:**
- Create post
- Update post
- Delete post
- Publish post

#### Events (`/dashboard/events`)

**Actions:**
- Create event
- Update event
- Delete event
- Manage attendees

#### Groups (`/dashboard/groups`)

**Actions:**
- Create group
- Update group
- Delete group
- Add/remove members

---

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": ["Error message for field"]
  }
}
```

### HTTP Status Codes

- **200**: Success
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Internal Server Error

---

## Authentication Implementation

### JWT Token Structure

```json
{
  "Id": "user-uuid",
  "Email": "user@example.com",
  "Username": "username",
  "FirstName": "John",
  "LastName": "Doe",
  "Administrator": false,
  "Permissions": {
    "CanManageUsers": false,
    "CanManageEvents": true,
    // ... other permissions
  },
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Token Generation

**Location:** `src/lib/server/auth/index.ts`

```typescript
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

const token = jwt.sign(userSession, JWT_SECRET, {
  expiresIn: '72h'
});
```

### Token Verification

**Location:** `src/hooks.server.ts`

```typescript
const authToken = cookies.get('auth_token');
const authResult = await AuthService.verifyToken(authToken);

if (authResult.success && authResult.user) {
  event.locals.user = authResult.user;
}
```

### Cookie Configuration

```typescript
cookies.set('auth_token', token, {
  path: '/',
  httpOnly: true,
  secure: !IS_DEVELOPMENT,
  sameSite: 'lax',
  maxAge: 60 * 60 * 72 // 72 hours
});
```

---

## Permission System

### Permission Checking

**In Server Code:**
```typescript
import { error } from '@sveltejs/kit';

if (!locals.user) {
  throw error(401, 'Authentication required');
}

if (!locals.user.Permissions.CanManageEvents) {
  throw error(403, 'Insufficient permissions');
}
```

**In Page Load Functions:**
```typescript
export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user?.Administrator && !locals.user?.Permissions.CanManageUsers) {
    throw redirect(302, '/dashboard');
  }
  
  // Load data...
};
```

### Available Permissions

- `CanManageUsers`: Create, update, delete users
- `CanManageEvents`: Create, update, delete events
- `CanManageGroups`: Create, update, delete groups
- `CanManagePosts`: Create, update, delete posts
- `CanEditOthersPosts`: Edit posts created by other users
- `CanManageRoles`: Create, update, delete roles
- `CanManageInvites`: Create, manage invite codes
- `CanManageTheme`: Update theme settings

---

## Rate Limiting

**Status:** Not implemented

**Recommendation:** Implement rate limiting for production:
- Authentication endpoints: 5 requests/minute
- Registration: 3 requests/hour
- API endpoints: 100 requests/minute

---

## CORS Configuration

**Current:** No CORS headers (same-origin only)

**For API Access:** Add CORS headers in `hooks.server.ts`:

```typescript
response.headers.set('Access-Control-Allow-Origin', 'https://allowed-domain.com');
response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
```

---

## Webhooks

**Status:** Not implemented

**Future Consideration:** Add webhook support for:
- New user registration
- Event creation
- Post publication

---

## API Versioning

**Current Version:** v1 (implicit)

**Future:** Consider adding versioning:
- `/api/v1/auth/login`
- `/api/v2/auth/login`

---

## Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5173/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "password": "password123",
    "inviteCode": "VALID-CODE"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5173/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

**Authenticated Request:**
```bash
curl -X GET http://localhost:5173/dashboard \
  -b cookies.txt
```

### Using Postman/Insomnia

1. Import the API endpoints
2. Enable cookie management
3. Login first to set auth cookie
4. Subsequent requests will include cookie automatically

---

## Security Considerations

1. **Password Hashing:** Argon2 with appropriate cost parameters
2. **JWT Secrets:** Change defaults in production
3. **Cookie Security:** httpOnly, secure (in production), SameSite
4. **Input Validation:** All inputs validated with Zod schemas
5. **SQL Injection:** Protected by Drizzle ORM
6. **XSS:** Protected by Svelte's automatic escaping
7. **CSRF:** Protected by SvelteKit's built-in CSRF protection

---

## API Extension Guide

### Adding a New Endpoint

1. Create route: `src/routes/(app)/api/endpoint/+server.ts`
2. Define handlers:
   ```typescript
   import type { RequestHandler } from './$types';
   import { json } from '@sveltejs/kit';
   
   export const POST: RequestHandler = async ({ request, locals }) => {
     // Validate authentication
     if (!locals.user) {
       return json({ success: false, message: 'Unauthorized' }, { status: 401 });
     }
     
     // Process request
     const body = await request.json();
     
     // Return response
     return json({ success: true, data: {} });
   };
   ```

3. Add validation schema
4. Document the endpoint
5. Add tests (when test infrastructure exists)

---

## Future API Features

- [ ] Pagination for list endpoints
- [ ] Search/filter parameters
- [ ] Bulk operations
- [ ] GraphQL endpoint option
- [ ] Rate limiting
- [ ] API key authentication (for external integrations)
- [ ] Webhook system
- [ ] Real-time updates via WebSockets
