import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import carRoutes from './routes/cars';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        environment: NODE_ENV,
        port: PORT
    });
});

if (NODE_ENV === 'production') {
    try {
        const frontendPath = path.join(__dirname, '../../frontend/dist');
        console.log('Serving frontend from:', frontendPath);

        app.use(express.static(frontendPath));

        // SPA fallback
        app.get('*', (req, res) => {
            res.sendFile(path.join(frontendPath, 'index.html'));
        });
    } catch (error) {
        console.error('Error serving frontend:', error);
        app.get('/', (req, res) => {
            res.json({
                error: 'Frontend not built',
                message: 'Run: npm run build:frontend'
            });
        });
    }
}

app.listen(PORT, () => {
    console.log(`Car Catalog Server`);
    console.log(`Port: ${PORT}`);
    console.log(`Mode: ${NODE_ENV}`);

    if (NODE_ENV === 'production') {
        console.log(`Production ready at http://localhost:${PORT}`);
    } else {
        console.log(`Development API at http://localhost:${PORT}/api`);
    }
});