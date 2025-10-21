import { faker } from '@faker-js/faker'
import { Factory } from 'rosie'

import { User } from '~/domain/auth/entities/user'
import { Product } from '~/domain/catalog/entities/product'

export const userFactory = new Factory<User>().attrs({
  id: () => faker.string.uuid(),
  email: () => faker.internet.email(),
  password: () => faker.internet.password(),
  createdAt: () => faker.date.past(),
  updatedAt: () => faker.date.recent(),
})

export const productFactory = new Factory<Product>().attrs({
  id: () => faker.string.uuid(),
  imageUrl: () => faker.image.url(),
  name: () => faker.commerce.productName(),
  description: () => faker.commerce.productDescription(),
  price: () => +faker.commerce.price({ min: 800, max: 1000, dec: 2 }),
  stock: () => faker.number.int({ min: 0, max: 100 }),
  promotionalPrice: () => +faker.commerce.price({ min: 1, max: 800, dec: 2 }),
  promotionStartsAt: () => faker.date.past(),
  promotionEndsAt: () => faker.date.future(),
  createdAt: () => faker.date.past(),
  updatedAt: () => faker.date.recent(),
})
