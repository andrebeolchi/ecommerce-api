import { FastifyReply, FastifyRequest } from 'fastify'

import { GetProductByIdUseCase } from '~/domain/catalog/application/use-cases/get-product-by-id-use-case'

import { GetProductByIdController } from '~/adapters/controllers/catalog/get-product-by-id-controller'

import { PrismaProductRepository } from '~/adapters/gateways/catalog/prisma-product-repository'

import { PinoLogger } from '~/infra/logger/pino'
import { ZodSchemaValidator } from '~/infra/validation/zod/schema-validator'
import { GetProductsByIdSchema, getProductsByIdSchema } from '~/infra/validation/zod/schemas/get-products-by-id-schema'

const logger = new PinoLogger()

const productsRepository = new PrismaProductRepository(logger)

const useCase = new GetProductByIdUseCase(logger, productsRepository)

const schemaValidator = new ZodSchemaValidator<GetProductsByIdSchema>(getProductsByIdSchema)

const controller = new GetProductByIdController(logger, useCase, schemaValidator)

export async function getProductsById(req: FastifyRequest, reply: FastifyReply) {
  const { body, status } = await controller.execute({
    params: req.params as GetProductsByIdSchema,
  })

  return reply.status(status).send(body)
}
