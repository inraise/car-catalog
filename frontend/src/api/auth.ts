import api from './axios';

export const authAPI = {
    register: async (email: string, password: string, name?: string) => {
        const response = await api.post('/auth/register', { email, password, name });
        return response.data;
    },

    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};