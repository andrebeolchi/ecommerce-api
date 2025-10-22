import { Entity } from '~/domain/commons/entity'
import { Optional } from '~/domain/commons/optional'

import { Product } from '~/domain/catalog/entities/product'

interface CartItemProps {
  cartId: string
  productId: string
  quantity: number
  product: Product
  createdAt: Date
  updatedAt: Date
}

export class CartItem extends Entity<CartItemProps> {
  static create(props: Optional<CartItemProps, 'createdAt' | 'updatedAt'>, id?: string) {
    const cartItem = new CartItem(
      {
        ...props,
        createdAt: props?.createdAt ?? new Date(),
        updatedAt: props?.updatedAt ?? new Date(),
      },
      id
    )
    return cartItem
  }

  get productId(): string {
    return this.props.productId
  }

  get cartId(): string {
    return this.props.cartId
  }

  get name(): string {
    return this.props.product.name
  }

  get quantity(): number {
    return this.props.quantity
  }

  get product(): Product {
    return this.props.product
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }
}
