import { mock } from "jest-mock-extended"
import { VerifyTokenUseCase } from "~/domain/auth/application/use-cases/verify-token-use-case"
import { AddToCartUseCase } from "~/domain/cart/application/use-cases/add-to-cart-use-case"
import { Logger } from "~/infra/logger"
import { SchemaValidator } from "~/adapters/controllers/interfaces/schema-validator"
import { AddToCartController, Body } from "./add-to-cart-controller"
import { cartItemFactory, productFactory, userFactory } from "~/infra/fixtures"

describe('[controller] add to cart', () => {
  const logger = mock<Logger>()
  const verifyTokenUseCase = mock<VerifyTokenUseCase>()
  const addToCartUseCase = mock<AddToCartUseCase>()
  const schemaValidator = mock<SchemaValidator<Body>>()

  const addToCartController = new AddToCartController(
    logger,
    verifyTokenUseCase,
    addToCartUseCase,
    schemaValidator
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 200 and cart data on successful add to cart', async () => {
    const user = userFactory.build()
    const product = productFactory.build({ stock: 10 })
    const newCartItem = cartItemFactory.build({ quantity: 3 })

    const body = {
      productId: product.id,
      quantity: 3,
    }

    verifyTokenUseCase.execute.mockResolvedValueOnce(user)
    schemaValidator.execute.mockReturnValueOnce({ data: body, errors: [] })
    addToCartUseCase.execute.mockResolvedValueOnce(newCartItem)

    const result = await addToCartController.execute({
      body,
      headers: {
        authorization: 'Bearer valid-token',
      }
    })

    expect(result.status).toBe(200)
    expect(result.body).toEqual(newCartItem)
  })
})