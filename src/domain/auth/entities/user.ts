import { Entity } from '~/domain/commons/entity'
import { Optional } from '~/domain/commons/optional'

export interface UserProps {
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export class User extends Entity<UserProps> {
  static create(props: Optional<UserProps, 'createdAt' | 'updatedAt'>, id?: string) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    )
    return user
  }

  get email(): string {
    return this.props.email
  }

  get password(): string {
    return this.props.password
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }
}
