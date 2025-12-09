import React, {createContext, useContext, useState, useEffect} from 'react';
import type {User} from '../types';
import {authAPI} from '../api/auth';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name?: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));

            // Проверяем валидность токена
            authAPI.getMe().catch(() => {
                logout();
            });
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const data = await authAPI.login(email, password);
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    };

    const register = async (email: string, password: string, name?: string) => {
        const data = await authAPI.register(email, password, name);
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        authAPI.logout();
    };

    return (
        <AuthContext.Provider value={{user, token, login, register, logout, isLoading}}>
            {children}
        </AuthContext.Provider>
    );
};