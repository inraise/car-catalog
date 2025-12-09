import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import carRoutes from './routes/cars';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5063;
const NODE_ENV = process.env.NODE_ENV || 'development';

const getCorsOrigin = () => {
    if (NODE_ENV === 'production') {
        return process.env.FRONTEND_URL || 'http://localhost:3000';
    }
    return ['http://localhost:3000',
        'http://localhost:5063',
        'http://127.0.0.1:3000',
        'http://192.168.0.102:3000',
        'http://192.168.0.102:5063'];
};

const corsOptions = {
    origin: getCorsOrigin(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
    maxAge: 86400
};

if (NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
        next();
    });
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV,
        corsOrigin: corsOptions.origin,
        port: PORT
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

app.use('/api/*', (req, res) => {
    res.status(404).json({
        error: 'API endpoint not found',
        path: req.originalUrl,
        method: req.method
    });
});

if (NODE_ENV === 'production') {
    const path = require('path');

    // Serve static files from frontend build
    app.use(express.static(path.join(__dirname, '../../frontend/dist')));

    // Handle SPA routing
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
    });
}

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', err.stack);
    res.status(500).json({
        error: 'Internal server error',
        message: NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
    console.log(`CORS origin:`, corsOptions.origin);
    console.log(`API available at: http://localhost:${PORT}/api`);
});