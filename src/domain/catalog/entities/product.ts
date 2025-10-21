import { Entity } from '~/domain/commons/entity'
import { Optional } from '~/domain/commons/optional'

export interface ProductProps {
  imageUrl: string
  name: string
  description: string
  price: number
  stock: number

  promotionalPrice: number | null
  promotionStartsAt: Date | null
  promotionEndsAt: Date | null

  createdAt: Date
  updatedAt: Date
}

export class Product extends Entity<ProductProps> {
  static create(props: Optional<ProductProps, 'createdAt' | 'updatedAt'>, id?: string) {
    const product = new Product(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    )
    return product
  }

  get imageUrl(): string {
    return this.props.imageUrl
  }

  get name(): string {
    return this.props.name
  }

  get description(): string {
    return this.props.description
  }

  get price(): number {
    return this.props.price
  }

  get stock(): number {
    return this.props.stock
  }

  get promotionalPrice(): number | null {
    return this.props.promotionalPrice
  }

  get promotionStartsAt(): Date | null {
    return this.props.promotionStartsAt
  }

  get promotionEndsAt(): Date | null {
    return this.props.promotionEndsAt
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }
}
