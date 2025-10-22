import { NotFoundError } from '~/domain/commons/errors/not-found'
import { ValidationError } from '~/domain/commons/errors/validation'

import { CartItem } from '~/domain/cart/entities/cart-item'

import { CartRepository } from '~/domain/cart/application/repositories/cart-repository'
import { ProductRepository } from '~/domain/catalog/application/repositories/product-repository'

import { Logger } from '~/infra/logger'

interface AddToCartUseCaseInput {
  userId: string
  productId: string
  quantity: number
}

export class AddToCartUseCase {
  constructor(
    private logger: Logger,
    private productRepository: ProductRepository,
    private cartRepository: CartRepository
  ) {}

  async execute({ userId, productId, quantity }: AddToCartUseCaseInput) {
    const product = await this.productRepository.findById(productId)

    if (!product) {
      this.logger.warn(`product not found`, { productId })
      throw new NotFoundError('product not found')
    }

    let cart = await this.cartRepository.findCartByUserId(userId)

    if (!cart) {
      this.logger.info(`creating new cart for user`, { userId })
      cart = await this.cartRepository.createCart(userId)
    }

    const existingCartItem = await this.cartRepository.findCartItemByUserIdAndProductId({
      userId,
      productId,
    })

    if (quantity > product.stock) {
      this.logger.warn(`insufficient stock for product`, {
        productId,
        stock: product.stock,
        requestedQuantity: quantity,
      })
      throw new ValidationError('insufficient stock for product')
    }

    if (!existingCartItem) {
      this.logger.info(`adding new product to cart`, { userId, productId, quantity })
      return this.cartRepository.createCartItem({
        userId,
        productId,
        quantity,
      })
    }

    const cartItem = CartItem.create(
      {
        productId: existingCartItem.productId,
        name: existingCartItem.name,
        quantity,
        product: existingCartItem.product,
      },
      existingCartItem.id
    )

    return this.cartRepository.updateCartItem({
      cartItemId: cartItem.id,
      quantity: cartItem.quantity,
    })
  }
}
