import { CartRepository } from '~/domain/cart/application/repositories/cart-repository'
import { ProductRepository } from '~/domain/catalog/application/repositories/product-repository'

import { mockCartRepository } from '~/adapters/gateways/database/auth/mock-cart-repository'
import { mockProductRepository } from '~/adapters/gateways/database/auth/mock-product-repository'

import { cartFactory, cartItemFactory, productFactory, userFactory } from '~/infra/fixtures'
import { Logger } from '~/infra/logger'
import { mockLogger } from '~/infra/logger/mock'

import { editCartUseCase } from './edit-cart-use-case'

describe('[use-case] edit cart', () => {
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

  it('should edit cart item quantity successfully', async () => {
    const user = userFactory.build()
    const cartItems = cartItemFactory.buildList(2)
    const cart = cartFactory.build({ userId: user.id, items: cartItems })

    const targetCartItem = cartItems[0]
    const product = productFactory.build({ id: targetCartItem.productId, stock: 10 })

    jest.spyOn(cartRepository, 'findCartByUserId').mockResolvedValueOnce(cart)
    jest.spyOn(productRepository, 'findById').mockResolvedValueOnce(product)
    jest.spyOn(cartRepository, 'updateCartItem').mockResolvedValueOnce({
      ...targetCartItem,
      quantity: 5,
    })

    const result = editCartUseCase(
      { userId: user.id, cartItemId: targetCartItem.id, quantity: 5 },
      { logger, cartRepository, productRepository }
    )

    await expect(result).resolves.toEqual({
      ...targetCartItem,
      quantity: 5,
    })
  })

  it('should throw NotFoundError if cart not found', async () => {
    const user = userFactory.build()
    jest.spyOn(cartRepository, 'findCartByUserId').mockResolvedValueOnce(null)

    const result = editCartUseCase(
      { userId: user.id, cartItemId: 'non-existent-cart-item-id', quantity: 2 },
      { logger, cartRepository, productRepository }
    )

    await expect(result).rejects.toThrowError('cart not found')
  })

  it('should throw NotFoundError if cart item not found', async () => {
    const user = userFactory.build()
    const cart = cartFactory.build({ userId: user.id, items: cartItemFactory.buildList(2) })

    jest.spyOn(cartRepository, 'findCartByUserId').mockResolvedValueOnce(cart)

    const result = editCartUseCase(
      { userId: user.id, cartItemId: 'non-existent-cart-item-id', quantity: 2 },
      { logger, cartRepository, productRepository }
    )

    await expect(result).rejects.toThrowError('cart item not found')
  })

  it('should throw NotFoundError if product not found', async () => {
    const user = userFactory.build()
    const cartItems = cartItemFactory.buildList(2)
    const cart = cartFactory.build({ userId: user.id, items: cartItems })

    const targetCartItem = cartItems[0]

    jest.spyOn(cartRepository, 'findCartByUserId').mockResolvedValueOnce(cart)
    jest.spyOn(productRepository, 'findById').mockResolvedValueOnce(null)

    const result = editCartUseCase(
      { userId: user.id, cartItemId: targetCartItem.id, quantity: 2 },
      { logger, cartRepository, productRepository }
    )

    await expect(result).rejects.toThrowError('product not found')
  })

  it('should throw ValidationError if insufficient stock for product', async () => {
    const user = userFactory.build()
    const cartItems = cartItemFactory.buildList(2)
    const cart = cartFactory.build({ userId: user.id, items: cartItems })

    const targetCartItem = cartItems[0]
    const product = productFactory.build({ id: targetCartItem.productId, stock: 3 })

    jest.spyOn(cartRepository, 'findCartByUserId').mockResolvedValueOnce(cart)
    jest.spyOn(productRepository, 'findById').mockResolvedValueOnce(product)

    const result = editCartUseCase(
      { userId: user.id, cartItemId: targetCartItem.id, quantity: 5 },
      { logger, cartRepository, productRepository }
    )

    await expect(result).rejects.toThrowError('insufficient stock for product')
  })

  it('should remove cart item when quantity is zero', async () => {
    const user = userFactory.build()
    const cartItems = cartItemFactory.buildList(2)
    const cart = cartFactory.build({ userId: user.id, items: cartItems })

    const targetCartItem = cartItems[0]
    const product = productFactory.build({ id: targetCartItem.productId, stock: 10 })

    jest.spyOn(cartRepository, 'findCartByUserId').mockResolvedValueOnce(cart)
    jest.spyOn(productRepository, 'findById').mockResolvedValueOnce(product)
    jest.spyOn(cartRepository, 'removeCartItem').mockResolvedValueOnce(targetCartItem)

    const result = editCartUseCase(
      { userId: user.id, cartItemId: targetCartItem.id, quantity: 0 },
      { logger, cartRepository, productRepository }
    )

    await expect(result).resolves.toBeNull()
  })

  it('should remove cart item when quantity is less than zero', async () => {
    const user = userFactory.build()
    const cartItems = cartItemFactory.buildList(2)
    const cart = cartFactory.build({ userId: user.id, items: cartItems })

    const targetCartItem = cartItems[0]
    const product = productFactory.build({ id: targetCartItem.productId, stock: 10 })

    jest.spyOn(cartRepository, 'findCartByUserId').mockResolvedValueOnce(cart)
    jest.spyOn(productRepository, 'findById').mockResolvedValueOnce(product)
    jest.spyOn(cartRepository, 'removeCartItem').mockResolvedValueOnce(targetCartItem)

    const result = editCartUseCase(
      { userId: user.id, cartItemId: targetCartItem.id, quantity: -3 },
      { logger, cartRepository, productRepository }
    )

    await expect(result).resolves.toBeNull()
  })
})
