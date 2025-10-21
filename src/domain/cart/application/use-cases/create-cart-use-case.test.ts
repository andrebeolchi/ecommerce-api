import { CartRepository } from '~/domain/cart/application/repositories/cart-repository'
import { ProductRepository } from '~/domain/catalog/application/repositories/product-repository'

import { mockCartRepository } from '~/adapters/gateways/database/auth/mock-cart-repository'
import { mockProductRepository } from '~/adapters/gateways/database/auth/mock-product-repository'

import { cartItemFactory, productFactory, userFactory } from '~/infra/fixtures'
import { Logger } from '~/infra/logger'
import { mockLogger } from '~/infra/logger/mock'

import { createCartUseCase } from './create-cart-use-case'

describe('[use-case] create cart', () => {
  let cartRepository: CartRepository
  let productRepository: ProductRepository
  let logger: Logger

  beforeEach(() => {
    cartRepository = mockCartRepository
    productRepository = mockProductRepository
    logger = mockLogger
  })

  afterEach(() => {
    cartRepository = {} as CartRepository
    productRepository = {} as ProductRepository
    logger = {} as Logger
  })

  it('should update quantity if cart item already exists', async () => {
    const user = userFactory.build()
    const product = productFactory.build()
    const cartItem = cartItemFactory.build({ productId: product.id, quantity: 2 })

    jest.spyOn(productRepository, 'findById').mockResolvedValueOnce(product)
    jest.spyOn(cartRepository, 'findCartItemByUserIdAndProductId').mockResolvedValueOnce(cartItem)

    const result = createCartUseCase(
      {
        userId: user.id,
        productId: cartItem.productId,
        quantity: 3,
      },
      {
        logger,
        cartRepository,
        productRepository,
      }
    )

    await expect(result).resolves.toBeUndefined()
  })

  it('should create cart item if it does not exist', async () => {
    const user = userFactory.build()
    const product = productFactory.build()
    const cartItem = cartItemFactory.build({ productId: product.id })

    jest.spyOn(productRepository, 'findById').mockResolvedValueOnce(product)
    jest.spyOn(cartRepository, 'findCartItemByUserIdAndProductId').mockResolvedValueOnce(null)

    const result = createCartUseCase(
      {
        userId: user.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
      },
      {
        logger,
        cartRepository,
        productRepository,
      }
    )

    await expect(result).resolves.toBeUndefined()
  })

  it('should throw not found error if product does not exist', async () => {
    const user = userFactory.build()
    const cartItem = cartItemFactory.build()

    jest.spyOn(productRepository, 'findById').mockResolvedValueOnce(null)

    const result = createCartUseCase(
      {
        userId: user.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
      },
      {
        logger,
        cartRepository,
        productRepository,
      }
    )

    await expect(result).rejects.toThrow('product not found')
  })

  it('should throw error if insufficient stock for product', async () => {
    const user = userFactory.build()
    const product = productFactory.build({ stock: 2 })
    const cartItem = cartItemFactory.build()

    jest.spyOn(productRepository, 'findById').mockResolvedValueOnce(product)

    const result = createCartUseCase(
      {
        userId: user.id,
        productId: cartItem.productId,
        quantity: 5,
      },
      {
        logger,
        cartRepository,
        productRepository,
      }
    )

    await expect(result).rejects.toThrow('insufficient stock for product')
  })
})
