import { NotFoundError } from '~/domain/commons/errors/not-found'

import { CartRepository } from '~/domain/cart/application/repositories/cart-repository'
import { ProductRepository } from '~/domain/catalog/application/repositories/product-repository'

import { Logger } from '~/infra/logger'

interface CreateCartUseCaseInput {
  userId: string
  productId: string
  quantity: number
}

export class CreateCartUseCase {
  constructor(
    private logger: Logger,
    private cartRepository: CartRepository,
    private productRepository: ProductRepository
  ) {}

  async execute(input: CreateCartUseCaseInput) {
    const product = await this.productRepository.findById(input.productId)

    if (!product) {
      this.logger.error('product not found', { productId: input.productId })
      throw new NotFoundError('product not found')
    }

    if (product.stock < input.quantity) {
      this.logger.error('insufficient stock for product', {
        productId: input.productId,
        requestedQuantity: input.quantity,
        availableStock: product.stock,
      })
      throw new Error('insufficient stock for product')
    }

    const cartItem = await this.cartRepository.findCartItemByUserIdAndProductId({
      userId: input.userId,
      productId: input.productId,
    })

    if (cartItem) {
      await this.cartRepository.updateCartItem({
        cartItemId: cartItem.id,
        quantity: cartItem.quantity + input.quantity,
      })
      return
    }

    await this.cartRepository.createCart({
      userId: input.userId,
      productId: input.productId,
      quantity: input.quantity,
      name: product.name,
      price: product.price,
    })
  }
}
