import { PrismaClient } from '@prisma/client'

import { productFactory } from '../src/infra/fixtures'

const prisma = new PrismaClient()

async function main() {
  await prisma.product.deleteMany()

  const regularProducts = productFactory.buildList(25, {
    promotionalPrice: null,
    promotionStartsAt: null,
    promotionEndsAt: null,
  })
  const promotionalProducts = productFactory.buildList(25)

  await prisma.product.createMany({
    data: [...promotionalProducts, ...regularProducts],
    skipDuplicates: true,
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
