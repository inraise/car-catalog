import {query} from './db';

const migrate = async () => {
    try {
        query(`
            CREATE TABLE IF NOT EXISTS users
            (
                id
                SERIAL
                PRIMARY
                KEY,
                email
                VARCHAR
            (
                255
            ) UNIQUE NOT NULL,
                password VARCHAR
            (
                255
            ) NOT NULL,
                name VARCHAR
            (
                255
            ),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
        `);

        query(`
            CREATE TABLE IF NOT EXISTS cars
            (
                id
                SERIAL
                PRIMARY
                KEY,
                brand
                VARCHAR
            (
                255
            ) NOT NULL,
                model VARCHAR
            (
                255
            ) NOT NULL,
                year INTEGER NOT NULL,
                price DECIMAL
            (
                10,
                2
            ) NOT NULL,
                mileage INTEGER NOT NULL,
                color VARCHAR
            (
                255
            ) NOT NULL,
                vin VARCHAR
            (
                255
            ) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
        `);

        console.log('Таблицы созданы успешно');
    } catch (error) {
        console.error('Ошибка при создании таблиц:', error);
    } finally {
        process.exit();
    }
};

migrate();