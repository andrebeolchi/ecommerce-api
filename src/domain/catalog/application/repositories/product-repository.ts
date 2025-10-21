import { Product } from '~/domain/catalog/entities/product'

export interface ProductRepository {
  findById(productId: string): Promise<Product | null>
}
