import { mock, MockProxy } from 'jest-mock-extended'

import { CartRepository } from '~/domain/cart/application/repositories/cart-repository'
import { ProductRepository } from '~/domain/catalog/application/repositories/product-repository'

import { cartItemFactory, productFactory, userFactory } from '~/infra/fixtures'
import { Logger } from '~/infra/logger'

import { CreateCartUseCase } from './create-cart-use-case'

describe('[use-case] create cart', () => {
  let createCartUseCase: CreateCartUseCase

  let cartRepository: MockProxy<CartRepository>
  let productRepository: MockProxy<ProductRepository>
  let logger: MockProxy<Logger>

  beforeEach(() => {
    cartRepository = mock<CartRepository>()
    productRepository = mock<ProductRepository>()
    logger = mock<Logger>()

    createCartUseCase = new CreateCartUseCase(logger, cartRepository, productRepository)
  })

  it('should update quantity if cart item already exists', async () => {
    const user = userFactory.build()
    const product = productFactory.build()
    const cartItem = cartItemFactory.build({ productId: product.id, quantity: 2 })

    productRepository.findById.mockResolvedValueOnce(product)
    cartRepository.findCartItemByUserIdAndProductId.mockResolvedValueOnce(cartItem)

    const result = createCartUseCase.execute({
      userId: user.id,
      productId: cartItem.productId,
      quantity: 3,
    })

    await expect(result).resolves.toBeUndefined()
  })

  it('should create cart item if it does not exist', async () => {
    const user = userFactory.build()
    const product = productFactory.build()
    const cartItem = cartItemFactory.build({ productId: product.id })

    productRepository.findById.mockResolvedValueOnce(product)
    cartRepository.findCartItemByUserIdAndProductId.mockResolvedValueOnce(null)

    const result = createCartUseCase.execute({
      userId: user.id,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
    })

    await expect(result).resolves.toBeUndefined()
  })

  it('should throw not found error if product does not exist', async () => {
    const user = userFactory.build()
    const cartItem = cartItemFactory.build()

    productRepository.findById.mockResolvedValueOnce(null)

    const result = createCartUseCase.execute({
      userId: user.id,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
    })

    await expect(result).rejects.toThrow('product not found')
  })

  it('should throw error if insufficient stock for product', async () => {
    const user = userFactory.build()
    const product = productFactory.build({ stock: 2 })
    const cartItem = cartItemFactory.build()

    productRepository.findById.mockResolvedValueOnce(product)

    const result = createCartUseCase.execute({
      userId: user.id,
      productId: cartItem.productId,
      quantity: 5,
    })

    await expect(result).rejects.toThrow('insufficient stock for product')
  })
})
