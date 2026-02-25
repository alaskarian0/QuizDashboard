# Authentication System

This document describes the authentication system implemented for the Quiz Dashboard application.

## Overview

The authentication system uses JWT (JSON Web Tokens) for secure authentication with automatic token refresh and React Query for state management.

## Architecture

### Components

1. **API Layer** (`src/api/`)
   - `auth.ts` - Authentication API functions (login, logout, refresh, getMe)
   - `client.ts` - Axios instance with interceptors for automatic token attachment and refresh

2. **Types** (`src/types/`)
   - `auth.ts` - TypeScript types for authentication (User, LoginRequest, LoginResponse, etc.)

3. **Hooks** (`src/hooks/`)
   - `useAuth.ts` - Custom hook for authentication state and operations

4. **Providers** (`src/providers/`)
   - `QueryProvider.tsx` - React Query provider with error handling
   - `AuthProvider.tsx` - Authentication context provider with auto-logout

5. **Components** (`src/components/`)
   - `ProtectedRoute.tsx` - Route protection wrapper

## Features

### 1. Login

The login system:
- Accepts username and password
- Calls `POST /api/auth/login`
- Stores access token and refresh token in localStorage
- Stores user data in localStorage
- Invalidates and refetches user data on successful login

### 2. Token Management

**Access Token:**
- Stored in localStorage as `access_token`
- Sent with every API request via `Authorization: Bearer <token>` header
- Short-lived (typically 15-30 minutes)

**Refresh Token:**
- Stored in localStorage as `refresh_token`
- Used to obtain a new access token when expired
- Automatically refreshed by axios interceptor

### 3. Automatic Token Refresh

The axios interceptor in `src/api/client.ts`:
- Detects 401 (Unauthorized) responses
- Automatically attempts to refresh the token
- Queues failed requests during refresh
- Retries failed requests after successful refresh
- Logs out user if refresh fails

### 4. Protected Routes

The `ProtectedRoute` component:
- Checks authentication status
- Shows loading spinner while checking
- Redirects to login if not authenticated

### 5. Auto-Logout

The `AuthProvider` includes:
- JWT expiration checking
- Auto-logout when token expires
- Checks every minute

## API Endpoints

### Login
```
POST /api/auth/login
Body: { username: string, password: string }
Response: { access_token: string, refreshToken?: string, user: User }
```

### Refresh Token
```
POST /api/auth/refresh
Body: { refreshToken: string }
Response: { access_token: string, refreshToken?: string }
```

### Get Current User
```
GET /api/auth/me
Headers: { Authorization: Bearer <token> }
Response: User
```

## Usage Examples

### Using the useAuth Hook

```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login('username', 'password');
      // User is now logged in
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <button onClick={handleLogin}>Login</button>;
  }

  return (
    <div>
      <p>Welcome, {user?.username}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Using Protected Routes

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

function App() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
```

### Making Authenticated API Requests

```tsx
import apiClient from '@/api/client';

async function fetchData() {
  try {
    const response = await apiClient.get('/api/protected');
    return response.data;
  } catch (error) {
    console.error('API error:', error);
  }
}
```

## Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Security Considerations

1. **Token Storage**: Tokens are stored in localStorage. For production, consider using httpOnly cookies.

2. **HTTPS**: Always use HTTPS in production to prevent token interception.

3. **Token Expiration**: Access tokens should have a short expiration time (15-30 minutes).

4. **Refresh Token Rotation**: Implement refresh token rotation for better security.

5. **CORS**: Configure CORS properly on the backend to only allow requests from trusted origins.

## Error Handling

The system handles various error scenarios:

- **401 Unauthorized**: Attempts token refresh, then redirects to login
- **403 Forbidden**: Shows permission error
- **Network Errors**: Retries up to 3 times for queries, 2 times for mutations
- **Login Failures**: Shows error message to user

## Troubleshooting

### Login not working
1. Check that the backend is running on `http://localhost:3000`
2. Verify the API endpoint is correct in `.env`
3. Check browser console for error messages
4. Verify backend CORS settings

### Token refresh failing
1. Check that refresh token is stored in localStorage
2. Verify `/api/auth/refresh` endpoint exists
3. Check backend logs for refresh token validation errors

### Protected routes not working
1. Ensure QueryProvider wraps the app
2. Check that access token exists in localStorage
3. Verify useAuth hook is being used correctly
