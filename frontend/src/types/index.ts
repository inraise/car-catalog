export interface User {
    id: number;
    email: string;
    name?: string;
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
    created_at: string;
}

export interface PaginationData {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    data?: T;
    error?: string;
}