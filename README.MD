# Инструкция по локальной настройке и запуску проекта

## 1. Пререквизиты
- **Node.js**: версия \`>= 20.0.0\`
- **pnpm**: версия \`>= 9.0.0\` (рекомендуется: \`npm install -g pnpm\`)
- **MySQL Server 8.x**: запущен локально на порту \`3306\`, доступен пользователь \`root\`

## 2. Подготовка базы данных
Выполните вход в локальный MySQL через консоль или GUI-клиент:
\`\`\`bash
mysql -u root -p
\`\`\`

Создайте базу данных приложения:
\`\`\`sql
CREATE DATABASE IF NOT EXISTS tg_dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
\`\`\`

## 3. Настройка переменных окружения
В директории \`apps/api/\` создайте файл \`.env\`:
\`\`\`env
# Замените YOUR_ROOT_PASSWORD на актуальный пароль root вашего MySQL сервера
DATABASE_URL="mysql://root:YOUR_ROOT_PASSWORD@127.0.0.1:3306/tg_dashboard"
PORT=5000
HOST=0.0.0.0
CORS_ORIGIN="http://localhost:3000"
JWT_ACCESS_SECRET="dev-jwt-access-secret-key-32-chars-minimum"
JWT_REFRESH_SECRET="dev-jwt-refresh-secret-key-32-chars-minimum"
COOKIE_SECRET="dev-cookie-signer-secret-key-32-chars-minimum"
\`\`\`

## 4. Установка зависимостей и сборка общих пакетов
Выполните в корне монорепозитория:
\`\`\`bash
# Установка зависимостей во все пакеты воркспейса
pnpm install

# Сборка пакета общих контрактов (@app/contracts)
pnpm --filter @app/contracts build
\`\`\`

## 5. Инициализация схемы БД через Prisma
Примените миграции к локальной базе:
\`\`\`bash
cd apps/api
pnpm prisma migrate dev --name init_database
cd ../..
\`\`\`

## 6. Запуск проекта в режиме разработки
Запустите одновременно бэкенд и фронтенд одной командой из корня:
\`\`\`bash
pnpm dev
\`\`\`

- **Frontend (Web SPA)**: http://localhost:3000
- **Backend API (Fastify)**: http://localhost:5000

## 7. Проверка работоспособности
1. Создайте первого пользователя через API:
\`\`\`bash
curl -X POST http://localhost:5000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@example.com","password":"Password123","name":"Admin"}'
\`\`\`
2. Откройте браузер по адресу \`http://localhost:3000/login\`.
3. Введите указанные при регистрации данные.
4. Проверьте установку кук \`access_token\` и \`refresh_token\` (флаги \`HttpOnly\`, \`SameSite=Lax\`) и редирект в защищенный раздел \`/dashboard\`.