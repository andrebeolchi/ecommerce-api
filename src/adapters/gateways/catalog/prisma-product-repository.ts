import { Product as PrismaProduct } from '@prisma/client'

import { Product } from '~/domain/catalog/entities/product'

import { ProductRepository } from '~/domain/catalog/application/repositories/product-repository'

import { prisma } from '~/infra/database/prisma'

import { Logger } from '~/infra/logger'

const createProductFromDoc = (doc: PrismaProduct): Product =>
  Product.create(
    {
      name: doc.name,
      description: doc.description,
      imageUrl: doc.imageUrl,
      price: doc.price,
      promotionalPrice: doc.promotionalPrice,
      promotionEndsAt: doc.promotionEndsAt,
      promotionStartsAt: doc.promotionStartsAt,
      stock: doc.stock,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    },
    doc.id
  )

export class PrismaCatalogRepository implements ProductRepository {
  constructor(private logger: Logger) {}

  async findById(productId: string): Promise<Product | null> {
    this.logger.info('fetching product by ID from the database', { productId })

    const doc = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!doc) {
      return null
    }

    return createProductFromDoc(doc)
  }

  async findAll(): Promise<Product[]> {
    this.logger.info('fetching all products from the database')

    const docs = await prisma.product.findMany()

    return docs.map(doc => createProductFromDoc(doc))
  }
}
