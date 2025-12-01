import api from './axios';
import type {Car} from '../types';

export interface GetCarsParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
    search?: string;
}

export const carsAPI = {
    getCars: async (params: GetCarsParams = {}) => {
        const response = await api.get('/cars', { params });
        return response.data;
    },

    getCar: async (id: number) => {
        const response = await api.get(`/cars/${id}`);
        return response.data;
    },

    createCar: async (car: Omit<Car, 'id' | 'created_at'>) => {
        const response = await api.post('/cars', car);
        return response.data;
    },

    updateCar: async (id: number, car: Partial<Car>) => {
        const response = await api.put(`/cars/${id}`, car);
        return response.data;
    },

    deleteCar: async (id: number) => {
        const response = await api.delete(`/cars/${id}`);
        return response.data;
    },
};