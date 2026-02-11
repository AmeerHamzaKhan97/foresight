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
      const urlParts = config.url.split('?')[0].split('/');
      const handle = urlParts[2];
      const isSearch = config.url.includes('?query=');
      const isSignals = config.url.endsWith('/signals');
      const isPost = config.method?.toLowerCase() === 'post';

      // Handle POST /creators (Add Creator)
      if (isPost && config.url === '/creators') {
        const body = JSON.parse(config.data || '{}');
        const handleFromUrl = body.url?.split('/').pop()?.replace('@', '');
        const creator = MOCK_CREATORS.find(c => c.handle.toLowerCase() === handleFromUrl?.toLowerCase());
        
        if (creator) {
          return Promise.reject({
            config,
            mockResponse: { data: { creator, message: 'Added from mock' } }
          });
        }
      }

      // Handle Signals
      if (isSignals && handle) {
        const signalKey = Object.keys(MOCK_SIGNALS).find(k => k.toLowerCase() === handle.toLowerCase());
        const signals = signalKey ? (MOCK_SIGNALS as any)[signalKey] : [];
        return Promise.reject({
          config,
          mockResponse: { data: { signals } }
        });
      }

      // Handle Search
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

      // Handle Paginated List (Base /creators)
      if (config.url === '/creators' || config.url.startsWith('/creators?')) {
        const params = new URLSearchParams(config.url.split('?')[1] || '');
        const page = parseInt(params.get('page') || '1');
        const limit = parseInt(params.get('limit') || '10');
        const startIndex = (page - 1) * limit;
        const pagedCreators = MOCK_CREATORS.slice(startIndex, startIndex + limit);

        return Promise.reject({
          config,
          mockResponse: {
            data: {
              creators: pagedCreators,
              pagination: {
                total: MOCK_CREATORS.length,
                page,
                limit,
                totalPages: Math.ceil(MOCK_CREATORS.length / limit)
              }
            }
          }
        });
      }

      // Handle Profile
      if (handle && !isPost) {
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

export interface Creator {
  _id: string;
  handle: string;
  displayName: string;
  status: 'PENDING' | 'ACTIVE' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
  affiliationScore?: number;
  credibilityScore?: number;
  profileImage?: string;
  metadata?: {
    followersCount?: number;
    description?: string;
  };
}

export interface GetCreatorsResponse {
  creators: Creator[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getCreators = async (page = 1, limit = 10): Promise<GetCreatorsResponse> => {
  const response = await api.get('/creators', { params: { page, limit } });
  return response.data;
};

export default api;
