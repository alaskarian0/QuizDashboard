# Authentication System - Quick Reference Guide

## Quick Start

### 1. Environment Setup
Ensure your `.env` file contains:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 2. Using the useAuth Hook

```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const {
    user,              // User object | null
    isAuthenticated,   // boolean
    isLoading,         // boolean
    login,             // (username: string, password: string) => Promise<void>
    logout,            // () => void
    error,             // Error | null
    isLoginLoading     // boolean
  } = useAuth();

  const handleLogin = async () => {
    try {
      await login('admin', 'password');
      // Success - user is logged in
    } catch (err) {
      // Handle error
    }
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : isAuthenticated ? (
        <div>
          <p>Welcome, {user?.username}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin} disabled={isLoginLoading}>
          {isLoginLoading ? 'Logging in...' : 'Login'}
        </button>
      )}
    </div>
  );
}
```

### 3. Making Authenticated API Requests

```tsx
import apiClient from '@/api/client';

async function fetchProtectedData() {
  try {
    // Token automatically added by interceptor
    const response = await apiClient.get('/protected-endpoint');
    return response.data;
  } catch (error) {
    // 401 errors automatically trigger token refresh
    console.error('API Error:', error);
  }
}
```

### 4. Protecting Routes

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

## API Functions Reference

### `src/api/auth.ts`

#### `login(username, password)`
Authenticate user and store tokens.
```ts
const response = await login('admin', 'password');
// Returns: { access_token, refreshToken, user }
```

#### `logout()`
Clear all tokens and user data.
```ts
logout();
```

#### `refreshToken()`
Refresh expired access token.
```ts
const newToken = await refreshToken();
// Returns: string (new access token)
```

#### `getMe()`
Fetch current user from server.
```ts
const user = await getMe();
// Returns: User object
```

#### `getAccessToken()`
Get stored access token.
```ts
const token = getAccessToken();
// Returns: string | null
```

#### `isAuthenticated()`
Check if user is authenticated.
```ts
const auth = isAuthenticated();
// Returns: boolean
```

## Type Definitions

### User
```ts
interface User {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'user';
  createdAt?: string;
  updatedAt?: string;
}
```

### LoginRequest
```ts
interface LoginRequest {
  username: string;
  password: string;
}
```

### LoginResponse
```ts
interface LoginResponse {
  access_token: string;
  refreshToken?: string;
  user: User;
}
```

## Token Storage

Tokens are stored in localStorage:
- `access_token` - Short-lived JWT for API requests
- `refresh_token` - Long-lived token for getting new access tokens
- `user` - User data as JSON string

## Common Patterns

### Login Form
```tsx
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const { login, isLoginLoading } = useAuth();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await login(username, password);
    // Redirect happens automatically via auth state
  } catch (error) {
    // Show error to user
  }
};
```

### Logout Button
```tsx
const { logout } = useAuth();

<button onClick={logout}>Logout</button>
```

### Show User Info
```tsx
const { user, isAuthenticated } = useAuth();

{isAuthenticated && (
  <div>
    <p>Welcome, {user?.username}!</p>
    <p>Role: {user?.role}</p>
  </div>
)}
```

### Conditional Rendering Based on Role
```tsx
const { user } = useAuth();

{user?.role === 'admin' && (
  <AdminPanel />
)}
```

## Error Handling

### Handling Login Errors
```tsx
const { login, error } = useAuth();

const handleLogin = async () => {
  try {
    await login(username, password);
  } catch (err) {
    if (err.message.includes('401')) {
      alert('Invalid credentials');
    } else {
      alert('Network error');
    }
  }
};
```

### Handling API Errors
```tsx
import apiClient from '@/api/client';

try {
  const response = await apiClient.get('/data');
} catch (error) {
  if (error.response?.status === 401) {
    // Token refresh attempted automatically
    // If refresh fails, user will be logged out
  }
}
```

## Debugging

### Check Token in Browser Console
```javascript
// Get access token
localStorage.getItem('access_token');

// Get refresh token
localStorage.getItem('refresh_token');

// Get user data
JSON.parse(localStorage.getItem('user'));

// Clear all (logout manually)
localStorage.clear();
```

### Monitor Network Requests
1. Open DevTools → Network tab
2. Look for `Authorization` header in requests
3. Check for `/api/auth/login` requests
4. Check for `/api/auth/refresh` requests (automatic)

## Best Practices

1. **Always use the useAuth hook** - Don't directly access localStorage
2. **Handle loading states** - Show loaders during auth operations
3. **Display error messages** - Users need to know what went wrong
4. **Use ProtectedRoute** - For any route that requires authentication
5. **Check role before actions** - Not all authenticated users have the same permissions

## Troubleshooting Quick Fixes

### "Login does nothing"
- Check browser console for errors
- Verify backend is running
- Check API URL in `.env`

### "Immediately logged out after login"
- Check backend returns correct token format
- Verify token is being stored in localStorage
- Check for console errors

### "API requests fail with 401"
- Check token exists in localStorage
- Try logging out and back in
- Verify backend token validation

### "Cannot use useAuth outside provider"
- Ensure QueryProvider wraps your app
- Check `src/main.tsx` for provider setup

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000/api` |

## Related Files

- `src/api/auth.ts` - Auth API functions
- `src/api/client.ts` - Axios configuration
- `src/hooks/useAuth.ts` - Auth hook
- `src/types/auth.ts` - Type definitions
- `src/providers/QueryProvider.tsx` - React Query setup
- `src/providers/AuthProvider.tsx` - Auth context
- `src/components/ProtectedRoute.tsx` - Route protection

---

**Need Help?** See `AUTHENTICATION.md` for detailed documentation.
