import { FastifyReply, FastifyRequest } from 'fastify'

import { RegisterUseCase } from '~/domain/auth/application/use-cases/register-use-case'

import { RegisterController } from '~/adapters/controllers/auth/register-controller'

import { PrismaUserRepository } from '~/adapters/gateways/auth/prisma-user-repository'

import { PinoLogger } from '~/infra/logger/pino'
import { BcryptHasher } from '~/infra/password-hash/bcrypt-hasher'
import { ZodSchemaValidator } from '~/infra/validation/zod/schema-validator'
import { registerSchema, RegisterSchema } from '~/infra/validation/zod/schemas/register-schema'

const logger = new PinoLogger()

const authGateway = new PrismaUserRepository(logger)

const passwordHasher = new BcryptHasher()

const registerUseCase = new RegisterUseCase(logger, authGateway, passwordHasher)

const schemaValidator = new ZodSchemaValidator<RegisterSchema>(registerSchema)

const registerController = new RegisterController(logger, registerUseCase, schemaValidator)

export async function register(req: FastifyRequest, reply: FastifyReply) {
  const { body, status } = await registerController.execute({
    body: req.body as RegisterSchema,
  })

  return reply.status(status).send(body)
}
