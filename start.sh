#!/bin/bash

echo "Запуск Car Catalog..."

if ! command -v node &> /dev/null; then
    echo "Node.js не установлен!"
    exit 1
fi

SERVER_IP=$(hostname -I | awk '{print $1}')
echo "IP сервера: $SERVER_IP"

if [ -f "/.dockerenv" ]; then
    echo "Запуск в Docker контейнере"
    export NODE_ENV=production
    export FRONTEND_URL="http://$SERVER_IP:3000"
elif [ "$1" == "--prod" ]; then
    echo "Запуск в production режиме"
    export NODE_ENV=production
    export FRONTEND_URL="http://$SERVER_IP"
else
    echo "Запуск в development режиме"
    export NODE_ENV=development
    export FRONTEND_URL="http://localhost:3000"
fi

export PORT=5063

echo "   Конфигурация:"
echo "   NODE_ENV: $NODE_ENV"
echo "   PORT: $PORT"
echo "   FRONTEND_URL: $FRONTEND_URL"

if [ "$NODE_ENV" = "production" ]; then
    echo "Запуск production сборки..."
    node backend/dist/server.js
else
    echo "Запуск в development режиме..."
    npm run dev
fi