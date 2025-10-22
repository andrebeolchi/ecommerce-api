import { Product } from '~/domain/catalog/entities/product'

export class ProductPresenter {
  static toJSON(product: Product) {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      imageUrl: product.imageUrl,
      price: product.price,
      promotionalPrice: product.promotionalPrice,
      promotionStartsAt: product.promotionStartsAt,
      promotionEndsAt: product.promotionEndsAt,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }
  }
}
