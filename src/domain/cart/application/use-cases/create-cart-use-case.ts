import { NotFoundError } from '~/domain/commons/errors/not-found'

import { CartRepository } from '~/domain/cart/application/repositories/cart-repository'
import { ProductRepository } from '~/domain/catalog/application/repositories/product-repository'

import { Logger } from '~/infra/logger'

interface CreateCartUseCaseInput {
  userId: string
  productId: string
  quantity: number
}

interface CreateCartUseCaseDependencies {
  logger: Logger
  cartRepository: CartRepository
  productRepository: ProductRepository
}

export const createCartUseCase = async (
  input: CreateCartUseCaseInput,
  { logger, cartRepository, productRepository }: CreateCartUseCaseDependencies
) => {
  const product = await productRepository.findById(input.productId)

  if (!product) {
    logger.error('product not found', { productId: input.productId })
    throw new NotFoundError('product not found')
  }

  if (product.stock < input.quantity) {
    logger.error('insufficient stock for product', {
      productId: input.productId,
      requestedQuantity: input.quantity,
      availableStock: product.stock,
    })
    throw new Error('insufficient stock for product')
  }

  const cartItem = await cartRepository.findCartByUserIdAndProductId({
    userId: input.userId,
    productId: input.productId,
  })

  if (cartItem) {
    await cartRepository.updateCart({
      cartItemId: cartItem.id,
      quantity: cartItem.quantity + input.quantity,
    })
    return
  }

  await cartRepository.createCart({
    userId: input.userId,
    productId: input.productId,
    quantity: input.quantity,
    name: product.name,
    price: product.price,
  })
}
