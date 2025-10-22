import { FastifyReply, FastifyRequest } from 'fastify'

import { VerifyTokenUseCase } from '~/domain/auth/application/use-cases/verify-token-use-case'
import { GetCartUseCase } from '~/domain/cart/application/use-cases/get-cart-use-case'

import { GetCartController } from '~/adapters/controllers/cart/get-cart-controller'

import { PrismaCartRepository } from '~/adapters/gateways/cart/prisma-cart-repository'

import { config } from '~/infra/config'
import { JoseJwtProvider } from '~/infra/jwt/jose-jwt-provider'
import { PinoLogger } from '~/infra/logger/pino'
import { AuthenticatedHeaderSchema } from '~/infra/validation/zod/schemas/authenticated-header'

const logger = new PinoLogger()

const cartRepository = new PrismaCartRepository(logger)

const getCartUseCase = new GetCartUseCase(logger, cartRepository)

const jwtProvider = new JoseJwtProvider(config.jwt.secret)

const verifyTokenUseCase = new VerifyTokenUseCase(jwtProvider)

const controller = new GetCartController(logger, verifyTokenUseCase, getCartUseCase)

export async function getCart(req: FastifyRequest, reply: FastifyReply) {
  const { body, status } = await controller.execute({
    headers: req.headers as AuthenticatedHeaderSchema,
  })

  return reply.status(status).send(body)
}
