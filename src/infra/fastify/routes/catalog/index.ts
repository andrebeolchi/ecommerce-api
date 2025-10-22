import { FastifyInstance } from 'fastify'

import { getProducts } from './get-products'
import { getProductsById } from './get-products-by-id'

export async function catalogRoutes(app: FastifyInstance) {
  app.route({
    method: 'GET',
    url: '/api/products',
    handler: getProducts,
  })

  app.route({
    method: 'GET',
    url: '/api/products/:id',
    handler: getProductsById,
  })
}
