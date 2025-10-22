import { CartItem as PrismaCartItem, Product as PrismaProduct, Cart as PrismaCart } from '@prisma/client'

import { User } from '~/domain/auth/entities/user'
import { Cart } from '~/domain/cart/entities/cart'
import { CartItem } from '~/domain/cart/entities/cart-item'
import { Product } from '~/domain/catalog/entities/product'

import {
  CartRepository,
  FindCartByUserIdAndProductIdParams,
} from '~/domain/cart/application/repositories/cart-repository'

import { prisma } from '~/infra/database/prisma'

import { Logger } from '~/infra/logger'

interface CartItemDoc extends PrismaCartItem {
  product: PrismaProduct
}

const createCartItemFromDoc = (doc: CartItemDoc): CartItem =>
  CartItem.create(
    {
      productId: doc.productId,
      quantity: doc.quantity,
      cartId: doc.cartId,
      product: Product.create(
        {
          name: doc.product.name,
          description: doc.product.description,
          imageUrl: doc.product.imageUrl,
          price: doc.product.price,
          promotionalPrice: doc.product.promotionalPrice,
          promotionEndsAt: doc.product.promotionEndsAt,
          promotionStartsAt: doc.product.promotionStartsAt,
          stock: doc.product.stock,
          createdAt: doc.product.createdAt,
          updatedAt: doc.product.updatedAt,
        },
        doc.product.id
      ),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    },
    doc.id
  )

interface CartDoc extends PrismaCart {
  items: CartItemDoc[]
}

const createCartFromDoc = (doc: CartDoc): Cart => {
  const items = doc.items.map(createCartItemFromDoc)

  return Cart.create(
    {
      userId: doc.userId,
      items,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    },
    doc.id
  )
}

export class PrismaCartRepository implements CartRepository {
  constructor(private logger: Logger) {}

  async createCart(cart: Cart): Promise<Cart> {
    const doc = await prisma.cart.create({
      data: {
        id: cart.id,
        userId: cart.userId,
        updatedAt: cart.updatedAt,
        createdAt: cart.createdAt,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    this.logger.info('cart created in the database', { cartId: doc.id })

    return createCartFromDoc(doc)
  }

  async findCartByUserId(userId: User['id']): Promise<Cart | null> {
    const doc = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!doc) {
      this.logger.info('no cart found for user', { userId })
      return null
    }

    return createCartFromDoc(doc)
  }

  async createCartItem(params: CartItem): Promise<CartItem> {
    const doc = await prisma.cartItem.create({
      data: {
        id: params.id,
        quantity: params.quantity,
        createdAt: params.createdAt,
        updatedAt: params.updatedAt,
        productId: params.productId,
        cartId: params.cartId,
      },
      include: {
        product: true,
      },
    })

    this.logger.info('cart item created in the database', { cartItemId: doc.id })

    return createCartItemFromDoc(doc)
  }

  async updateCartItem(params: CartItem): Promise<CartItem> {
    const doc = await prisma.cartItem.update({
      where: { id: params.id },
      data: {
        quantity: params.quantity,
        updatedAt: params.updatedAt,
      },
      include: {
        product: true,
      },
    })

    this.logger.info('cart item updated in the database', { cartItemId: doc.id })

    return createCartItemFromDoc(doc)
  }

  async removeCartItem(cartItemId: CartItem['id']): Promise<void> {
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    })

    this.logger.info('cart item removed from the database', { cartItemId })
  }

  async findCartItemByUserIdAndProductId(params: FindCartByUserIdAndProductIdParams): Promise<CartItem | null> {
    const doc = await prisma.cartItem.findFirst({
      where: {
        cart: {
          userId: params.userId,
        },
        productId: params.productId,
      },
      include: {
        product: true,
      },
    })

    if (!doc) {
      this.logger.info('no cart item found for user and product', {
        userId: params.userId,
        productId: params.productId,
      })
      return null
    }

    return createCartItemFromDoc(doc)
  }
}
