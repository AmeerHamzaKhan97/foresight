import axios from 'axios';
import toast from 'react-hot-toast';
import { MOCK_CREATORS, MOCK_SIGNALS } from './mockData';

const isGitHubPages = window.location.hostname.includes('github.io');
const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true' || isGitHubPages;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (useMock) {
    // Intercept and return mock data for specific routes
    if (config.url?.startsWith('/creators')) {
      const handle = config.url.split('/')[2]?.split('?')[0];
      const isSearch = config.url.includes('?query=');
      const isSignals = config.url.endsWith('/signals');

      if (isSignals && handle) {
        const signals = MOCK_SIGNALS[handle as keyof typeof MOCK_SIGNALS] || [];
        return Promise.reject({
          config,
          mockResponse: { data: { signals } }
        });
      }

      if (isSearch) {
        const query = new URLSearchParams(config.url.split('?')[1]).get('query') || '';
        const results = MOCK_CREATORS.filter(c => 
          c.handle.toLowerCase().includes(query.toLowerCase()) || 
          c.displayName?.toLowerCase().includes(query.toLowerCase())
        );
        return Promise.reject({
          config,
          mockResponse: { data: { creators: results } }
        });
      }

      if (handle) {
        const creator = MOCK_CREATORS.find(c => c.handle.toLowerCase() === handle.toLowerCase());
        if (creator) {
          return Promise.reject({
            config,
            mockResponse: { data: { creator } }
          });
        }
      }
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if it's an intercepted mock response
    if (error.mockResponse) {
      return Promise.resolve(error.mockResponse);
    }

    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    
    // Global error handling
    if (error.response?.status >= 400) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
