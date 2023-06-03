const { join } = require("path")
const { describe, it, before, beforeEach, afterEach } = require("mocha")
const { expect } = require("chai")
const sinon = require("sinon")
const CarService = require("../../src/services/carService")
const Transaction = require("../../src/entities/transaction")

const carsDatabase = join(__dirname, "..", "..", "database", "cars.json")

const mocks = {
  validCarCategory: require("../mocks/valid-car-category.json"),
  validCar: require("../mocks/valid-car.json"),
  validCustomer: require("../mocks/valid-customer.json"),
}

describe("CarService Suite Tests", () => {
  /** @type {CarService} */
  let carService
  /** @type {sinon.SinonSandbox} */
  let sandbox

  // Create a new instance of CarService before running the tests
  before(() => {
    carService = new CarService({ cars: carsDatabase })
  })

  // Create a sandbox before each test
  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  // Restore the sandbox after each test to make sure
  // the sandbox is clean before the next test
  afterEach(() => {
    sandbox.restore()
  })

  it("should retrieve a random position from an array", () => {
    const data = [0, 1, 2, 3, 4]
    const result = carService.getRandomPositionFromArray(data)

    expect(result).to.be.lte(data.length).and.be.gte(0)
  })

  it("should choose the first id from carIds in carCategory", () => {
    const carCategory = mocks.validCarCategory
    const carIdIndex = 0

    sandbox
      .stub(carService, carService.getRandomPositionFromArray.name)
      .returns(carIdIndex)

    const result = carService.chooseRandomCar(carCategory)
    const expected = carCategory.carIds[carIdIndex]

    expect(
      carService.getRandomPositionFromArray.calledOnce,
      "carService.getRandomPositionFromArray should only be called once"
    ).to.be.ok

    expect(
      result,
      "result should be the first position from carIds"
    ).to.be.equal(expected)
  })

  it("should return an available car given a category", async () => {
    const car = mocks.validCar
    const carCategory = Object.create(mocks.validCarCategory)
    carCategory.carIds = [car.id]

    sandbox
      .stub(carService.carRepository, carService.carRepository.find.name)
      .resolves(car)

    sandbox.spy(carService, carService.chooseRandomCar.name)

    const result = await carService.getAvailableCar(carCategory)
    const expected = car

    expect(
      carService.chooseRandomCar.calledOnce,
      "carService.chooseRandomCar should be called once"
    ).to.be.ok

    expect(
      carService.carRepository.find.calledWithExactly(car.id),
      "carService.carRepository.find should be called exactly with car.id"
    ).to.be.ok

    expect(result, "result should be the expected car").to.be.deep.equal(
      expected
    )
  })

  it("should calculate the final amount in real when a customer rent a car, given the car category, customer and number of days", async () => {
    const customer = Object.create(mocks.validCustomer)
    customer.age = 50

    const carCategory = Object.create(mocks.validCarCategory)
    carCategory.price = 37.6

    const numberOfDays = 5

    const expected = carService.currencyFormat.format(244.4)

    sandbox
      .stub(carService, "taxesBasedOnAge")
      .get(() => [{ from: 40, to: 50, tax: 1.3 }])

    const result = carService.calculateFinalPrice(
      carCategory,
      customer,
      numberOfDays
    )

    expect(result).to.be.deep.equal(expected)
  })

  it("should return a transaction receipt given a customer and a car category", async () => {
    const car = mocks.validCar

    const carCategory = {
      ...mocks.validCarCategory,
      price: 37.6,
      carIds: [car.id],
    }

    const customer = Object.create(mocks.validCustomer)
    customer.age = 20

    const numberOfDays = 5
    const dueDate = "10 de novembro de 2020"
    const now = new Date(2020, 10, 5)

    sandbox.useFakeTimers(now.getTime())

    sandbox
      .stub(carService.carRepository, carService.carRepository.find.name)
      .resolves(car)

    const expectedAmount = carService.currencyFormat.format(206.8)

    const expected = new Transaction({
      customer,
      car,
      amount: expectedAmount,
      dueDate,
    })

    const result = await carService.rent(customer, carCategory, numberOfDays)

    expect(result).to.be.deep.equal(expected)
  })
})
