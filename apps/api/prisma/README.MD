## Повседневный рабочий процесс с Prisma

### 1. Изменение схемы базы данных
1. Отредактируйте файл \`apps/api/prisma/schema.prisma\` (добавьте поля, таблицы, связи или индексы).
2. Создайте и сразу примените миграцию к локальной dev-базе:
\`\`\`bash
pnpm --filter @app/api prisma migrate dev --name <название_миграции>
\`\`\`
*Пример:* \`pnpm --filter @app/api prisma migrate dev --name add_telegram_bots_table\`

### 2. Обновление TypeScript-типов без создания миграции
Если схема не менялась, но нужно обновить сгенерированный клиент (например, после \`git pull\`):
\`\`\`bash
pnpm --filter @app/api prisma generate
\`\`\`

### 3. Полный сброс dev-базы (Hard Reset)
Если схема рассинхронизировалась или тестовые данные повреждены. 
Удаляет БД, накатывает все миграции с нуля и автоматически запускает \`seed.ts\`:
\`\`\`bash
pnpm --filter @app/api prisma migrate reset
\`\`\`

### 4. Ручной запуск сидирования (наполнение начальными данными)
\`\`\`bash
pnpm --filter @app/api run db:seed
\`\`\`

### 5. Просмотр и редактирование данных через GUI (Prisma Studio)
Запуск визуального редактора данных в браузере (порт 5555):
\`\`\`bash
pnpm --filter @app/api prisma studio
\`\`\`

---

### Сводная таблица команд

| Задача | Команда | Что делает под капотом |
|---|---|---|
| **Новая миграция** | \`pnpm --filter @app/api prisma migrate dev --name <name>\` | Генерирует SQL-файл, применяет его, генерирует TS-клиент, запускает seed |
| **Генерация типов** | \`pnpm --filter @app/api prisma generate\` | Пересобирает \`@prisma/client\` в node_modules |
| **Сброс БД** | \`pnpm --filter @app/api prisma migrate reset\` | \`DROP DATABASE\`, накатывает все миграции заново, запускает seed |
| **Сидирование** | \`pnpm --filter @app/api run db:seed\` | Выполняет \`prisma/seed.ts\` напрямую |
| **Веб-интерфейс** | \`pnpm --filter @app/api prisma studio\` | Запускает Web GUI на http://localhost:5555 |
| **Продакшн миграция** | \`prisma migrate deploy\` | Применяет только непримененные SQL-миграции без генерации новых |