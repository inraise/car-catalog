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

### 1. Клонирование и установка зависимостей

#### Установите зависимости для всех проектов
npm run install-all

### 2. Настройка базы данных PostgreSQL

#### Установите PostgreSQL
#### Создайте базу данных:
CREATE DATABASE car_catalog;

#### Настройте подключение в файле .env
###### DB_HOST=localhost
###### DB_PORT=5434
###### DB_NAME=car_catalog
###### DB_USER=ваш_логин
###### DB_PASSWORD=ваш_пароль

### 3. Инициализация базы данных

###### cd backend
###### npm run migrate
###### npm run seed

### 4. Запуск приложения
npm run dev

### Приложение будет доступно:

##### Frontend: http://localhost:3000
##### Backend API: http://localhost:5000

### Тестовые пользователи

##### После выполнения seed скрипта будут созданы два пользователя:

###### Обычный пользователь:

Email: test@test.com
Пароль: password123
###### Администратор:

Email: admin@admin.com
Пароль: password123

### Структура проекта
```
car-catalog/
├── backend/              # Node.js + Express сервер
│   ├── src/
│   │   ├── db/          # Конфигурация и миграции БД
│   │   ├── middleware/  # Middleware (аутентификация)
│   │   ├── routes/      # API маршруты
│   │   └── types/       # TypeScript типы
│   └── package.json
├── frontend/            # React приложение
│   ├── src/
│   │   ├── api/         # API клиенты
│   │   ├── components/  # React компоненты
│   │   ├── context/     # React контекст (Auth)
│   │   ├── pages/       # Страницы приложения
│   │   └── types/       # TypeScript типы
│   └── package.json
└── package.json         # Корневой package.json
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
