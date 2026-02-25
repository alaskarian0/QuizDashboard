/**
 * Base API Client Configuration
 * Handles HTTP requests with proper error handling and authentication
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

interface ApiClientConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
}

interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = `${this.baseUrl}${endpoint}`;
    if (!params) return url;

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const { params, ...restOptions } = options;
    const url = this.buildUrl(endpoint, params);
    const headers = {
      ...this.defaultHeaders,
      ...this.getAuthHeaders(),
      ...restOptions.headers,
    };

    try {
      const response = await fetch(url, {
        ...restOptions,
        headers,
      });

      // Handle non-JSON responses (like 204 No Content)
      if (response.status === 204) {
        return undefined as T;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error(`Unexpected content type: ${contentType}`);
      }

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          statusCode: response.status,
          message: data.message || data.error || 'API request failed',
          error: data.error,
        };
        throw error;
      }

      // Handle NestJS wrapped responses (data.data pattern)
      return data?.data !== undefined ? data.data : data;
    } catch (error: any) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET', params });
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Set auth token
   */
  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  /**
   * Clear auth token
   */
  clearToken(): void {
    localStorage.removeItem('access_token');
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for custom instances if needed
export { ApiClient };
