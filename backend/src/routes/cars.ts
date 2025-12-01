import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { query } from '../db/db';
import { AuthRequest, PaginationParams } from '../types';

const router = express.Router();

// Получение всех автомобилей с пагинацией, сортировкой и поиском
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const {
            page = '1',
            limit = '10',
            sortBy = 'id',
            order = 'asc',
            search = ''
        } = req.query as any;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        // Построение запроса с поиском
        let whereClause = '';
        const queryParams: any[] = [];

        if (search) {
            whereClause = `WHERE brand ILIKE $1 OR model ILIKE $1 OR vin ILIKE $1`;
            queryParams.push(`%${search}%`);
        }

        // Получение общего количества
        const countQuery = `SELECT COUNT(*) FROM cars ${whereClause}`;
        const countResult = await query(countQuery, queryParams);
        const total = parseInt(countResult.rows[0].count);

        // Получение данных с пагинацией и сортировкой
        const validSortColumns = ['id', 'brand', 'model', 'year', 'price', 'mileage', 'color', 'vin', 'created_at'];
        const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'id';
        const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

        const dataQuery = `
      SELECT * FROM cars 
      ${whereClause} 
      ORDER BY ${sortColumn} ${sortOrder} 
      LIMIT $${queryParams.length + 1} 
      OFFSET $${queryParams.length + 2}
    `;

        const dataParams = [...queryParams, limitNum, offset];
        const dataResult = await query(dataQuery, dataParams);

        res.json({
            cars: dataResult.rows,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Получение одного автомобиля
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('SELECT * FROM cars WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Автомобиль не найден' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Создание автомобиля
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { brand, model, year, price, mileage, color, vin } = req.body;

        // Валидация
        if (!vin) {
            return res.status(400).json({ error: 'VIN обязателен' });
        }

        // Проверка уникальности VIN
        const vinExists = await query('SELECT * FROM cars WHERE vin = $1', [vin]);
        if (vinExists.rows.length > 0) {
            return res.status(400).json({ error: 'Автомобиль с таким VIN уже существует' });
        }

        const result = await query(
            `INSERT INTO cars (brand, model, year, price, mileage, color, vin) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
            [brand, model, year, price, mileage, color, vin]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Обновление автомобиля
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { brand, model, year, price, mileage, color, vin } = req.body;

        // Проверка существования автомобиля
        const carExists = await query('SELECT * FROM cars WHERE id = $1', [id]);
        if (carExists.rows.length === 0) {
            return res.status(404).json({ error: 'Автомобиль не найден' });
        }

        // Проверка уникальности VIN (если изменился)
        if (vin !== carExists.rows[0].vin) {
            const vinExists = await query('SELECT * FROM cars WHERE vin = $1 AND id != $2', [vin, id]);
            if (vinExists.rows.length > 0) {
                return res.status(400).json({ error: 'Автомобиль с таким VIN уже существует' });
            }
        }

        const result = await query(
            `UPDATE cars 
       SET brand = $1, model = $2, year = $3, price = $4, mileage = $5, color = $6, vin = $7
       WHERE id = $8 
       RETURNING *`,
            [brand, model, year, price, mileage, color, vin, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Удаление автомобиля
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query('DELETE FROM cars WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Автомобиль не найден' });
        }

        res.json({ message: 'Автомобиль удален' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

export default router;