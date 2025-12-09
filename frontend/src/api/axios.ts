import axios from 'axios';

const getBaseURL = () => {
    if (import.meta.env.PROD) {
        return '/api';
    }
    const {hostname, protocol} = window.location;
    const port = 5063;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `http://localhost:${port}/api`;
    }
    return `${protocol}//${hostname}:${port}/api`;
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false,
    timeout: 30000,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (import.meta.env.DEV) {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        }
        return config;
    },
    (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMessage = error.response?.data?.error || error.message || 'Ошибка сети';

        // Автоматический редирект на логин при 401
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Не делаем редирект если уже на странице логина
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        if (import.meta.env.DEV) {
            console.error('[API Response Error]', {
                url: error.config?.url,
                status: error.response?.status,
                message: errorMessage
            });
        }
        return Promise.reject({
            message: errorMessage,
            status: error.response?.status,
            data: error.response?.data
        });
    }
);

export default api;