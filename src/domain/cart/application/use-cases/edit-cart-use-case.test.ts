import { mock, MockProxy } from 'jest-mock-extended'

import { CartRepository } from '~/domain/cart/application/repositories/cart-repository'
import { ProductRepository } from '~/domain/catalog/application/repositories/product-repository'

import { cartFactory, cartItemFactory, productFactory, userFactory } from '~/infra/fixtures'
import { Logger } from '~/infra/logger'

import { EditCartUseCase } from './edit-cart-use-case'

describe('[use-case] edit cart', () => {
  let editCartUseCase: EditCartUseCase

  let cartRepository: MockProxy<CartRepository>
  let productRepository: MockProxy<ProductRepository>
  let logger: MockProxy<Logger>

  beforeEach(() => {
    cartRepository = mock<CartRepository>()
    productRepository = mock<ProductRepository>()
    logger = mock<Logger>()

    editCartUseCase = new EditCartUseCase(logger, cartRepository, productRepository)
  })

  it('should edit cart item quantity successfully', async () => {
    const user = userFactory.build()
    const cartItems = cartItemFactory.buildList(2)
    const cart = cartFactory.build({ userId: user.id, items: cartItems })

    const targetCartItem = cartItems[0]
    const product = productFactory.build({ id: targetCartItem.productId, stock: 10 })

    cartRepository.findCartByUserId.mockResolvedValueOnce(cart)
    productRepository.findById.mockResolvedValueOnce(product)

    //@ts-expect-error mocking
    cartRepository.updateCartItem.mockResolvedValueOnce({
      ...targetCartItem,
      quantity: 5,
    })

    const result = editCartUseCase.execute({ userId: user.id, cartItemId: targetCartItem.id, quantity: 5 })

    await expect(result).resolves.toEqual({
      ...targetCartItem,
      quantity: 5,
    })
  })

  it('should throw NotFoundError if cart not found', async () => {
    const user = userFactory.build()
    cartRepository.findCartByUserId.mockResolvedValueOnce(null)

    const result = editCartUseCase.execute({ userId: user.id, cartItemId: 'non-existent-cart-item-id', quantity: 2 })

    await expect(result).rejects.toThrow('cart not found')
  })

  it('should throw NotFoundError if cart item not found', async () => {
    const user = userFactory.build()
    const cart = cartFactory.build({ userId: user.id, items: cartItemFactory.buildList(2) })

    jest.spyOn(cartRepository, 'findCartByUserId').mockResolvedValueOnce(cart)

    const result = editCartUseCase.execute({ userId: user.id, cartItemId: 'non-existent-cart-item-id', quantity: 2 })

    await expect(result).rejects.toThrow('cart item not found')
  })

  it('should throw NotFoundError if product not found', async () => {
    const user = userFactory.build()
    const cartItems = cartItemFactory.buildList(2)
    const cart = cartFactory.build({ userId: user.id, items: cartItems })

    const targetCartItem = cartItems[0]

    cartRepository.findCartByUserId.mockResolvedValueOnce(cart)
    productRepository.findById.mockResolvedValueOnce(null)

    const result = editCartUseCase.execute({ userId: user.id, cartItemId: targetCartItem.id, quantity: 2 })

    await expect(result).rejects.toThrow('product not found')
  })

  it('should throw ValidationError if insufficient stock for product', async () => {
    const user = userFactory.build()
    const cartItems = cartItemFactory.buildList(2)
    const cart = cartFactory.build({ userId: user.id, items: cartItems })

    const targetCartItem = cartItems[0]
    const product = productFactory.build({ id: targetCartItem.productId, stock: 3 })

    cartRepository.findCartByUserId.mockResolvedValueOnce(cart)
    productRepository.findById.mockResolvedValueOnce(product)

    const result = editCartUseCase.execute({ userId: user.id, cartItemId: targetCartItem.id, quantity: 5 })

    await expect(result).rejects.toThrowError('insufficient stock for product')
  })

  it('should remove cart item when quantity is zero', async () => {
    const user = userFactory.build()
    const cartItems = cartItemFactory.buildList(2)
    const cart = cartFactory.build({ userId: user.id, items: cartItems })

    const targetCartItem = cartItems[0]
    const product = productFactory.build({ id: targetCartItem.productId, stock: 10 })

    cartRepository.findCartByUserId.mockResolvedValueOnce(cart)
    productRepository.findById.mockResolvedValueOnce(product)
    cartRepository.removeCartItem.mockResolvedValueOnce(targetCartItem)

    const result = editCartUseCase.execute({ userId: user.id, cartItemId: targetCartItem.id, quantity: 0 })

    await expect(result).resolves.toBeNull()
  })

  it('should remove cart item when quantity is less than zero', async () => {
    const user = userFactory.build()
    const cartItems = cartItemFactory.buildList(2)
    const cart = cartFactory.build({ userId: user.id, items: cartItems })

    const targetCartItem = cartItems[0]
    const product = productFactory.build({ id: targetCartItem.productId, stock: 10 })

    cartRepository.findCartByUserId.mockResolvedValueOnce(cart)
    productRepository.findById.mockResolvedValueOnce(product)
    cartRepository.removeCartItem.mockResolvedValueOnce(targetCartItem)

    const result = editCartUseCase.execute({ userId: user.id, cartItemId: targetCartItem.id, quantity: -3 })

    await expect(result).resolves.toBeNull()
  })
})
