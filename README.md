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

## Установка и запуск

### Первый запуск

### 1. Настройка базы данных PostgreSQL

#### Установите PostgreSQL
#### Создайте базу данных:
###### CREATE DATABASE car_catalog;

#### Настройте подключение в файле .env
###### NODE_ENV=development
###### PORT=5000
###### FRONTEND_URL=http://localhost:5173
###### DATABASE_URL=postgresql://username:password@localhost:5432/car_catalog
###### JWT_SECRET=your_super_secret_jwt_key_change_in_production
###### JWT_EXPIRES_IN=7d
###### BCRYPT_SALT_ROUNDS=12

### 2. Установка + настройка БД + запуск

###### npm run setup && npm run dev

### Все последующие разы
###### npm run dev

### Приложение будет доступно:

##### Frontend: http://localhost:3000
##### Backend API: http://localhost:5000

### Тестовые пользователи

##### После выполнения seed скрипта будут созданы два пользователя:

Email: admin@example.com
Пароль: password123

Email: user@example.com
Пароль: password123

### Структура проекта
```
car-catalog/
├── frontend/                 # React приложение
│   ├── src/
│   │   ├── components/      # React компоненты
│   │   ├── pages/          # Страницы приложения
│   │   ├── contexts/       # React контексты
│   │   ├── utils/          # Вспомогательные функции
│   │   └── types/          # TypeScript типы
│   └── package.json
├── backend/                 # Node.js сервер
│   ├── src/
│   │   ├── controllers/    # Контроллеры
│   │   ├── middleware/     # Промежуточное ПО
│   │   ├── routes/         # Маршруты API
│   │   ├── database/       # Конфигурация БД
│   │   └── scripts/        # Скрипты миграций
│   └── package.json
└── package.json
```

### API Endpoints

#### Аутентификация

##### POST /api/auth/register - Регистрация
##### POST /api/auth/login - Вход
##### GET /api/auth/me - Получение текущего пользователя

#### Автомобили

##### GET /api/cars - Получение списка с пагинацией
##### GET /api/cars/:id - Получение одного автомобиля
##### POST /api/cars - Создание автомобиля
##### PUT /api/cars/:id - Обновление автомобиля
##### DELETE /api/cars/:id - Удаление автомобиля
