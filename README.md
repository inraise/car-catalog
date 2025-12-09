# Каталог автомобилей

Веб-приложение для управления каталогом автомобилей с авторизацией.

## Технологии

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- React Hook Form
- Axios

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL
- JWT аутентификация
- bcryptjs для хеширования паролей

## Предварительные требования

- Node.js (версия 16 или выше)
- PostgreSQL (версия 12 или выше)
- npm

### Структура проекта
```
car-catalog/
├── frontend/          # React приложение
├── backend/           # Node.js сервер  
└── package.json       # Корневые скрипты
```

## Установка и запуск

### Первый запуск

### 1. Установка
###### npm run setup

### 2. Настройка базы данных PostgreSQL

#### Установите PostgreSQL
#### Создайте базу данных:
###### CREATE DATABASE car_catalog;

#### Или используйте Docker
```
docker run --name car-catalog-postgres \
-e POSTGRES_DB=car_catalog \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=password \
-p 5432:5432 \
-d postgres:16-alpine
```

#### Настройте подключение в файле .env
###### NODE_ENV=development
###### PORT=5000
###### FRONTEND_URL=http://localhost:5173
###### DATABASE_URL=postgresql://username:password@localhost:5432/car_catalog
###### JWT_SECRET=your_super_secret_jwt_key_change_in_production
###### JWT_EXPIRES_IN=7d
###### BCRYPT_SALT_ROUNDS=12

### 3. Настройка окружения

###### backend/.env
```
NODE_ENV=development
PORT=5063
HOST=localhost
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=24h
```

### 4. Инициализация базы данных
###### npm run db:setup

### 5. Запуск приложения
###### npm run dev


### Все последующие разы
###### npm run dev

### Скрипты запуска

```
# Установка всех зависимостей
npm run install:all

# Запуск в режиме разработки (localhost)
npm run dev

# Запуск в локальной сети (доступ с других устройств)
npm run dev:network

# Сборка для production
npm run prod:build

# Запуск production сервера
npm run prod:start

# Настройка базы данных (таблицы + тестовые данные)
npm run db:setup
```

### Для доступа из локальной сети
```
cd backend && HOST=0.0.0.0 PORT=5063 npm run dev
cd frontend && npm run dev -- --host 0.0.0.0
```

### Тестовые пользователи

##### После выполнения seed скрипта будут созданы два пользователя:

Email: admin@example.com
Пароль: password123

Email: user@example.com
Пароль: password123