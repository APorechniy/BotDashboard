import { PrismaClient, Role } from '@prisma/client';
import argon2 from 'argon2';

if (!process.env.DATABASE_URL) {
    console.error('❌ ОШИБКА: Переменная DATABASE_URL не найдена в окружении!');
    process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Старт процесса сидирования базы данных...');
    const adminEmail = 'admin@dashboard.local';

    const existingUser = await prisma.user.findUnique({
        where: { email: adminEmail }
    });

    if (existingUser) {
        console.log(`ℹ️ Пользователь с email "${adminEmail}" уже существует в базе (ID: ${existingUser.id}).`);
        return;
    }

    console.log('⏳ Генерация Argon2id хэша для пароля...');
    const passwordHash = await argon2.hash('AdminSecret123!', {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4
    });

    const createdUser = await prisma.user.create({
        data: {
            email: adminEmail,
            name: 'Super Admin',
            passwordHash,
            role: Role.ADMIN
        }
    });

    console.log('✅ Администратор успешно создан:');
    console.log(`   ID:       ${createdUser.id}`);
    console.log(`   Email:    ${createdUser.email}`);
    console.log(`   Пароль:   AdminSecret123!`);
    console.log(`   Роль:     ${createdUser.role}`);
}

main()
    .catch((e) => {
        console.error('❌ Критическая ошибка при сидировании:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });