import { Product } from '~/domain/catalog/entities/product'

import { ProductRepository } from '~/domain/catalog/application/repositories/product-repository'

export const mockProductRepository: ProductRepository = {
  findById: async (_: string) => ({}) as Product,
}
