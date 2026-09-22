import axios from 'axios';

export const getApiUrl = (): string => {
  if (typeof window !== 'undefined') {
    // If NEXT_PUBLIC_API_URL is an external custom URL (not localhost), use it
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl && !envUrl.includes('localhost') && !envUrl.startsWith('/')) {
      return envUrl;
    }
    // For local IP, mobile browser, or localhost: use relative /api proxied by Next.js
    return '/api';
  }
  const internal = process.env.INTERNAL_BACKEND_URL || 'http://backend:4001';
  return `${internal}/api`;
};

export const getAssetUrl = (assetPath?: string | null): string => {
  if (!assetPath) return '';
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
    return assetPath;
  }
  return assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
};

export const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to headers automatically
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('laundryku_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Global response error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('laundryku_token');
      localStorage.removeItem('laundryku_user');
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);
