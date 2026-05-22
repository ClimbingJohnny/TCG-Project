
import PrismaClient from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 例: ユーザー追加
  await prisma.user.create({
    data: {
      name: 'admin',
      email: 'admin@example.com',
    },
  })

  console.log('Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })