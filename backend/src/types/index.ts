import { Request } from 'express';

export interface User {
    id: number;
    email: string;
    password: string;
    name?: string;
    created_at: Date;
}

export interface Car {
    id: number;
    brand: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    color: string;
    vin: string;
    created_at: Date;
}

// Расширяем стандартный Request от Express
export interface AuthRequest extends Request {
    userId?: number;
}

export interface PaginationParams {
    page: number;
    limit: number;
    sortBy: string;
    order: 'asc' | 'desc';
    search: string;
}