import {query} from './db';
import bcrypt from 'bcryptjs';

const seed = async () => {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);

        query(`
            INSERT INTO users (email, password, name)
            VALUES ('test@test.com', $1, 'Test User') ON CONFLICT (email) DO NOTHING
        `, [hashedPassword]);

        const cars = [
            {
                brand: 'Toyota',
                model: 'Camry',
                year: 2018,
                price: 1650000,
                mileage: 89000,
                color: 'Black',
                vin: 'JTNB11HK8J3001234'
            },
            {
                brand: 'Toyota',
                model: 'RAV4',
                year: 2020,
                price: 2450000,
                mileage: 42000,
                color: 'White',
                vin: 'JTM6RFXV5L5012345'
            },
            {
                brand: 'Volkswagen',
                model: 'Passat',
                year: 2017,
                price: 1380000,
                mileage: 112000,
                color: 'Silver',
                vin: 'WVWZZZ3CZJE012346'
            },
            {
                brand: 'Volkswagen',
                model: 'Tiguan',
                year: 2019,
                price: 1980000,
                mileage: 67000,
                color: 'Grey',
                vin: 'WVGZZZ5N2KW012347'
            },
            {
                brand: 'BMW',
                model: '320i',
                year: 2016,
                price: 1750000,
                mileage: 123000,
                color: 'Blue',
                vin: 'WBA8A9C59GK012348'
            },
            {
                brand: 'BMW',
                model: 'X5',
                year: 2018,
                price: 3450000,
                mileage: 81000,
                color: 'Black',
                vin: 'WBAKS81030G012349'
            },
            {
                brand: 'Mercedes-Benz',
                model: 'C200',
                year: 2017,
                price: 1950000,
                mileage: 99000,
                color: 'White',
                vin: 'WDD2050421R012350'
            },
            {
                brand: 'Mercedes-Benz',
                model: 'GLE350',
                year: 2019,
                price: 4200000,
                mileage: 54000,
                color: 'Grey',
                vin: 'WDC1660571A012351'
            },
            {
                brand: 'Audi',
                model: 'A4',
                year: 2018,
                price: 1980000,
                mileage: 88000,
                color: 'Black',
                vin: 'WAUZZZF48JA012352'
            },
            {
                brand: 'Audi',
                model: 'Q5',
                year: 2020,
                price: 3250000,
                mileage: 36000,
                color: 'White',
                vin: 'WAUZZZFY9L2012353'
            },
            {
                brand: 'Hyundai',
                model: 'Solaris',
                year: 2021,
                price: 980000,
                mileage: 25000,
                color: 'Red',
                vin: 'KMHCT41BAMU012354'
            },
            {
                brand: 'Hyundai',
                model: 'Tucson',
                year: 2019,
                price: 1650000,
                mileage: 70000,
                color: 'Brown',
                vin: 'TMAJ3813KJJ012355'
            },
            {
                brand: 'Kia',
                model: 'Rio',
                year: 2020,
                price: 1050000,
                mileage: 33000,
                color: 'Blue',
                vin: 'KNADM412LMJ012356'
            },
            {
                brand: 'Kia',
                model: 'Sportage',
                year: 2018,
                price: 1550000,
                mileage: 89000,
                color: 'Black',
                vin: 'KNDPC3A22J7012357'
            },
            {
                brand: 'Ford',
                model: 'Focus',
                year: 2017,
                price: 870000,
                mileage: 120000,
                color: 'White',
                vin: 'WF05XXGCC5HK012358'
            },
            {
                brand: 'Ford',
                model: 'Kuga',
                year: 2019,
                price: 1580000,
                mileage: 65000,
                color: 'Orange',
                vin: 'WFDMXXESWMK012359'
            },
            {
                brand: 'Nissan',
                model: 'Qashqai',
                year: 2018,
                price: 1450000,
                mileage: 78000,
                color: 'Silver',
                vin: 'SJNFAAJ11U0123600'
            },
            {
                brand: 'Nissan',
                model: 'X-Trail',
                year: 2020,
                price: 2150000,
                mileage: 43000,
                color: 'Green',
                vin: 'JN1TBNW30L0123601'
            },
            {
                brand: 'Lexus',
                model: 'RX350',
                year: 2019,
                price: 4300000,
                mileage: 52000,
                color: 'Black',
                vin: 'JTJBZMCA7K20123602'
            },
            {
                brand: 'Skoda',
                model: 'Octavia',
                year: 2017,
                price: 1250000,
                mileage: 115000,
                color: 'Grey',
                vin: 'TMBJG7NE3J0123603'
            }
        ];

        for (const car of cars) {
            query(`
                INSERT INTO cars (brand, model, year, price, mileage, color, vin)
                VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (vin) DO NOTHING
            `, [car.brand, car.model, car.year, car.price, car.mileage, car.color, car.vin]);
        }

        console.log('Тестовые данные добавлены');
    } catch (error) {
        console.error('Ошибка при добавлении тестовых данных:', error);
    } finally {
        process.exit();
    }
};

seed();