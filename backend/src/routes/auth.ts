import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {query} from '../db/db';

const router = express.Router();

// Middleware для логгирования запросов
router.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
});

// Регистрация
router.post('/register', async (req, res) => {
    try {
        const {email, password, name} = req.body;

        console.log('Registration attempt:', {email, name});

        // Проверка существования пользователя
        const userExists = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({error: 'Пользователь уже существует'});
        }

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создание пользователя
        const result = await query(
            'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
            [email, hashedPassword, name]
        );

        // Генерация JWT токена
        const token = jwt.sign(
            {userId: result.rows[0].id},
            process.env.JWT_SECRET!,
            {expiresIn: '24h'}
        );

        res.status(201).json({
            user: result.rows[0],
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});

// Логин
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        console.log('Login attempt:', email);

        // Установим CORS заголовки явно
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.header('Access-Control-Allow-Credentials', 'true');

        // Поиск пользователя
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({error: 'Неверный email или пароль'});
        }

        // Проверка пароля
        const validPassword = await bcrypt.compare(password, user.password);
        console.log('Password valid:', validPassword);

        if (!validPassword) {
            return res.status(400).json({error: 'Неверный email или пароль'});
        }

        // Генерация JWT токена
        const token = jwt.sign(
            {userId: user.id},
            process.env.JWT_SECRET!,
            {expiresIn: '24h'}
        );

        console.log('Login successful for user:', user.email);

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            token
        });
    } catch (error: any) {
        console.error('Login error details:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({error: 'Ошибка сервера'});
    }
});

// Получение текущего пользователя
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        console.log('Auth header:', authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({error: 'Требуется авторизация'});
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

        const result = await query('SELECT id, email, name FROM users WHERE id = $1', [decoded.userId]);

        if (!result.rows[0]) {
            return res.status(404).json({error: 'Пользователь не найден'});
        }

        res.json({user: result.rows[0]});
    } catch (error) {
        console.error('Get me error:', error);
        res.status(401).json({error: 'Неверный токен'});
    }
});

export default router;