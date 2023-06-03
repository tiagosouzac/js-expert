const { join } = require("path")
const { describe, it, before, beforeEach, afterEach } = require("mocha")
const { expect } = require("chai")
const sinon = require("sinon")
const CarService = require("../../src/services/carService")

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
})
