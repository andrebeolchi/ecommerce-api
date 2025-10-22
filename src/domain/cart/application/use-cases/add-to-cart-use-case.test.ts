import { mock, MockProxy } from 'jest-mock-extended'

import { CartRepository } from '~/domain/cart/application/repositories/cart-repository'
import { ProductRepository } from '~/domain/catalog/application/repositories/product-repository'

import { cartFactory, cartItemFactory, productFactory, userFactory } from '~/infra/fixtures'
import { Logger } from '~/infra/logger'

import { AddToCartUseCase } from './add-to-cart-use-case'

describe('[use-case] add to cart', () => {
  let logger: MockProxy<Logger>
  let productRepository: MockProxy<ProductRepository>
  let cartRepository: MockProxy<CartRepository>
  let addToCartUseCase: AddToCartUseCase

  beforeEach(() => {
    logger = mock<Logger>()
    productRepository = mock<ProductRepository>()
    cartRepository = mock<CartRepository>()

    addToCartUseCase = new AddToCartUseCase(logger, productRepository, cartRepository)
  })

  it('should create cart item if cart does not exist', async () => {
    const user = userFactory.build()
    const product = productFactory.build({ stock: 10 })
    const newCart = cartFactory.build({ userId: user.id })
    const newCartItem = cartItemFactory.build({ quantity: 3 })

    productRepository.findById.mockResolvedValueOnce(product)
    cartRepository.findCartByUserId.mockResolvedValueOnce(null)
    cartRepository.createCart.mockResolvedValueOnce(newCart)
    cartRepository.findCartItemByUserIdAndProductId.mockResolvedValueOnce(null)
    cartRepository.createCartItem.mockResolvedValueOnce(newCartItem)

    const result = await addToCartUseCase.execute({
      userId: user.id,
      productId: product.id,
      quantity: 3,
    })

    expect(result).toEqual(newCartItem)
  })

  it('should create cart item if cart exists', async () => {
    const user = userFactory.build()
    const product = productFactory.build({ stock: 10 })
    const existingCart = cartFactory.build({ userId: user.id })
    const newCartItem = cartItemFactory.build({ quantity: 4 })

    productRepository.findById.mockResolvedValueOnce(product)
    cartRepository.findCartByUserId.mockResolvedValueOnce(existingCart)
    cartRepository.findCartItemByUserIdAndProductId.mockResolvedValueOnce(null)
    cartRepository.createCartItem.mockResolvedValueOnce(newCartItem)

    const result = await addToCartUseCase.execute({
      userId: user.id,
      productId: product.id,
      quantity: 4,
    })

    expect(result).toEqual(newCartItem)
  })

  it('should update quantity if cart item already exists', async () => {
    const user = userFactory.build()
    const product = productFactory.build({ stock: 10 })
    const existingCartItem = cartItemFactory.build({ quantity: 2 })
    const updatedCartItem = { ...existingCartItem, quantity: 5 }

    productRepository.findById.mockResolvedValueOnce(product)
    cartRepository.findCartByUserId.mockResolvedValueOnce(cartFactory.build())
    cartRepository.findCartItemByUserIdAndProductId.mockResolvedValueOnce(existingCartItem)
    //@ts-expect-error mocking
    cartRepository.updateCartItem.mockResolvedValueOnce(updatedCartItem)

    const result = await addToCartUseCase.execute({
      userId: user.id,
      productId: product.id,
      quantity: 3,
    })

    expect(result).toEqual(updatedCartItem)
  })

  it('should throw NotFoundError if product does not exist', async () => {
    const user = userFactory.build()
    const nonExistentProductId = 'non-existent-product-id'

    productRepository.findById.mockResolvedValueOnce(null)

    const result = addToCartUseCase.execute({
      userId: user.id,
      productId: nonExistentProductId,
      quantity: 1,
    })

    await expect(result).rejects.toThrow('product not found')
  })

  it('should throw ValidationError if insufficient stock', async () => {
    const user = userFactory.build()
    const product = productFactory.build({ stock: 5 })

    productRepository.findById.mockResolvedValueOnce(product)
    cartRepository.findCartByUserId.mockResolvedValueOnce(cartFactory.build())
    cartRepository.findCartItemByUserIdAndProductId.mockResolvedValueOnce(null)

    const result = addToCartUseCase.execute({
      userId: user.id,
      productId: product.id,
      quantity: 10,
    })

    await expect(result).rejects.toThrow('insufficient stock for product')
  })
})
