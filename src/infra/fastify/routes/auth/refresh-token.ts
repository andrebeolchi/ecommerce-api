import { FastifyReply, FastifyRequest } from 'fastify'

import { RefreshTokenUseCase } from '~/domain/auth/application/use-cases/refresh-token-use-case'

import { RefreshTokenController } from '~/adapters/controllers/auth/refresh-token-controller'

import { PrismaUserRepository } from '~/adapters/gateways/auth/prisma-user-repository'

import { config } from '~/infra/config'
import { JoseJwtProvider } from '~/infra/jwt/jose-jwt-provider'
import { PinoLogger } from '~/infra/logger/pino'
import { AuthenticatedHeaderSchema } from '~/infra/validation/zod/schemas/authenticated-header'

const logger = new PinoLogger()

const gateway = new PrismaUserRepository(logger)

const jwtProvider = new JoseJwtProvider(config.jwt.secret)

const useCase = new RefreshTokenUseCase(logger, jwtProvider, gateway)

const controller = new RefreshTokenController(logger, useCase)

export async function refreshToken(req: FastifyRequest, reply: FastifyReply) {
  const { body, status } = await controller.execute({
    headers: req.headers as AuthenticatedHeaderSchema,
  })

  return reply.status(status).send(body)
}
