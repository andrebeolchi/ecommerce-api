import { faker } from '@faker-js/faker'
import { Factory } from 'rosie'

import { User } from '~/domain/auth/entities/user'

export const userFactory = new Factory<User>().attrs({
  id: () => faker.string.uuid(),
  email: () => faker.internet.email(),
  password: () => faker.internet.password(),
  createdAt: () => faker.date.past(),
  updatedAt: () => faker.date.recent(),
})
