import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token getter function (will be set by AuthContext)
let getTokenFn = null;

export const setTokenGetter = (fn) => {
    getTokenFn = fn;
};

// Add auth token to requests
api.interceptors.request.use(async (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    if (getTokenFn) {
        try {
            const token = await getTokenFn();
            if (token) {
                console.log('Auth token found and added to header');
                config.headers.Authorization = `Bearer ${token}`;
            } else {
                console.log('No auth token returned by getter');
            }
        } catch (error) {
            console.error('Error getting token:', error);
        }
    } else {
        console.warn('No token getter set up for API');
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    (response) => {
        console.log(`API Response: ${response.status} from ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('API Error:', {
            status: error.response?.status,
            url: error.config?.url,
            data: error.response?.data
        });
        if (error.response?.status === 401) {
            console.warn('Unauthorized! Redirecting to login...');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const layoutApi = {
    saveLayout: async (layoutData) => {
        // Handle both old array style and new object style { widgets, canvasSettings }
        const payload = Array.isArray(layoutData) ? { widgets: layoutData } : layoutData;
        const response = await api.post('/layout/save-layout', payload);
        return response.data;
    },

    getLayout: async () => {
        const response = await api.get('/layout/get-layout');
        return response.data;
    },
};

export default api;
