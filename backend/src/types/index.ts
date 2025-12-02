import { Request } from 'express';

// Расширение стандартного Request от Express
export interface AuthRequest extends Request {
    userId?: number;
}