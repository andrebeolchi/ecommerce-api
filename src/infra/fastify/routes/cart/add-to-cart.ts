import { FastifyReply, FastifyRequest } from 'fastify'

import { VerifyTokenUseCase } from '~/domain/auth/application/use-cases/verify-token-use-case'
import { AddToCartUseCase } from '~/domain/cart/application/use-cases/add-to-cart-use-case'

import { AddToCartController } from '~/adapters/controllers/cart/add-to-cart-controller'

import { PrismaCartRepository } from '~/adapters/gateways/cart/prisma-cart-repository'
import { PrismaProductRepository } from '~/adapters/gateways/catalog/prisma-product-repository'

import { config } from '~/infra/config'
import { JoseJwtProvider } from '~/infra/jwt/jose-jwt-provider'
import { PinoLogger } from '~/infra/logger/pino'
import { ZodSchemaValidator } from '~/infra/validation/zod/schema-validator'
import { addToCartSchema, AddToCartSchema } from '~/infra/validation/zod/schemas/add-to-cart-schema'
import { AuthenticatedHeaderSchema } from '~/infra/validation/zod/schemas/authenticated-header'

const logger = new PinoLogger()

const productRepository = new PrismaProductRepository(logger)
const cartRepository = new PrismaCartRepository(logger)

const addToCartUseCase = new AddToCartUseCase(logger, productRepository, cartRepository)

const jwtProvider = new JoseJwtProvider(config.jwt.secret)
const verifyTokenUseCase = new VerifyTokenUseCase(jwtProvider)

const schemaValidator = new ZodSchemaValidator<AddToCartSchema>(addToCartSchema)

const controller = new AddToCartController(logger, verifyTokenUseCase, addToCartUseCase, schemaValidator)

export async function addToCart(req: FastifyRequest, reply: FastifyReply) {
  const { body, status } = await controller.execute({
    body: req.body as AddToCartSchema,
    headers: req.headers as AuthenticatedHeaderSchema,
  })

  return reply.status(status).send(body)
}
