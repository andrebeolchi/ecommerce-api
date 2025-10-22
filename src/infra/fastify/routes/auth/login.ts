import { FastifyReply, FastifyRequest } from 'fastify'

import { LoginUseCase } from '~/domain/auth/application/use-cases/login-use-case'

import { LoginController } from '~/adapters/controllers/auth/login-controller'

import { PrismaUserRepository } from '~/adapters/gateways/auth/prisma-user-repository'

import { config } from '~/infra/config'
import { JoseJwtProvider } from '~/infra/jwt/jose-jwt-provider'
import { PinoLogger } from '~/infra/logger/pino'
import { BcryptHasher } from '~/infra/password-hash/bcrypt-hasher'
import { ZodSchemaValidator } from '~/infra/validation/zod/schema-validator'
import { loginSchema, LoginSchema } from '~/infra/validation/zod/schemas/login-schema'

const logger = new PinoLogger()

const authGateway = new PrismaUserRepository(logger)

const passwordHasher = new BcryptHasher()
const jwtProvider = new JoseJwtProvider(config.jwt.secret)

const loginUseCase = new LoginUseCase(logger, authGateway, passwordHasher, jwtProvider)

const schemaValidator = new ZodSchemaValidator<LoginSchema>(loginSchema)

const loginController = new LoginController(logger, loginUseCase, schemaValidator)

export async function login(req: FastifyRequest, reply: FastifyReply) {
  const { body, status } = await loginController.execute({
    body: req.body as LoginSchema,
  })

  return reply.status(status).send(body)
}
