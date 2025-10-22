import { FastifyInstance } from 'fastify'

import { addToCart } from './add-to-cart'
import { getCart } from './get-cart'

export async function cartRoutes(app: FastifyInstance) {
  app.route({
    method: 'GET',
    url: '/api/cart',
    handler: getCart,
  })

  app.route({
    method: 'POST',
    url: '/api/cart/add',
    handler: addToCart,
  })
}
