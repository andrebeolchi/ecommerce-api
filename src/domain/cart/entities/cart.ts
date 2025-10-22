import { Entity } from '~/domain/commons/entity'
import { Optional } from '~/domain/commons/optional'

import { CartItem } from './cart-item'

interface CartProps {
  userId: string
  items: CartItem[]
  createdAt: Date
  updatedAt: Date
}

export class Cart extends Entity<CartProps> {
  static create(props: Optional<CartProps, 'createdAt' | 'updatedAt'>, id?: string) {
    const cart = new Cart(
      {
        ...props,
        createdAt: props?.createdAt ?? new Date(),
        updatedAt: props?.updatedAt ?? new Date(),
      },
      id
    )
    return cart
  }

  get userId(): string {
    return this.props.userId
  }

  get items(): CartItem[] {
    return this.props.items
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  addItem(item: CartItem) {
    this.props.items.push(item)
  }

  removeItem(itemId: string) {
    this.props.items = this.props.items.filter(item => item.id !== itemId)
  }
}
