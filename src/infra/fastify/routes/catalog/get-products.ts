import { FastifyReply, FastifyRequest } from 'fastify'

import { GetProductsUseCase } from '~/domain/catalog/application/use-cases/get-products-use-case'

import { GetProductsController } from '~/adapters/controllers/catalog/get-products-controller'

import { PrismaProductRepository } from '~/adapters/gateways/catalog/prisma-product-repository'

import { PinoLogger } from '~/infra/logger/pino'

const logger = new PinoLogger()

const productsRepository = new PrismaProductRepository(logger)

const useCase = new GetProductsUseCase(logger, productsRepository)

const controller = new GetProductsController(logger, useCase)

export async function getProducts(_req: FastifyRequest, reply: FastifyReply) {
  const { body, status } = await controller.execute()

  return reply.status(status).send(body)
}
