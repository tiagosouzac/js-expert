const BaseRepository = require("../repositories/base/baseRepository")
const Tax = require("../entities/tax")
const Transaction = require("../entities/transaction")

class CarService {
  constructor({ cars }) {
    this.carRepository = new BaseRepository({ file: cars })

    this.currencyFormat = new Intl.NumberFormat("pt-br", {
      style: "currency",
      currency: "BRL",
    })

    this.taxesBasedOnAge = Tax.taxesBasedOnAge
  }

  /**
   * Get a random car from a car category
   *
   * @param {CarCategory} carCategory
   *
   * @returns {Promise<Car>}
   */
  async getAvailableCar(carCategory) {
    const carId = this.chooseRandomCar(carCategory)
    const car = await this.carRepository.find(carId)

    return car
  }

  /**
   * Choose a random car from a car category based on the available cars ids
   *
   * @param {CarCategory} carCategory
   *
   * @returns {string} carId
   */
  chooseRandomCar(carCategory) {
    const randomCarIndex = this.getRandomPositionFromArray(carCategory.carIds)
    return carCategory.carIds[randomCarIndex]
  }

  /**
   * Get a random position from an array
   *
   * @param {Array} list
   *
   * @returns {number}
   */
  getRandomPositionFromArray(list) {
    return Math.floor(Math.random() * (list.length - 1))
  }

  /**
   * Calculate the final price based on the car category, customer age and number of days
   *
   * @param {CarCategory} carCategory
   * @param {Customer} customer
   * @param {number} numberOfDays
   *
   * @returns {string}
   */
  calculateFinalPrice(carCategory, customer, numberOfDays) {
    const { age } = customer
    const { price } = carCategory

    const { tax } = this.taxesBasedOnAge.find(
      (tax) => age >= tax.from && age <= tax.to
    )

    const finalPrice = tax * price * numberOfDays
    return this.currencyFormat.format(finalPrice)
  }

  /**
   * Rent a car for a customer
   *
   * @param {Customer} customer
   * @param {Car} car
   * @param {CarCategory} carCategory
   * @param {number} numberOfDays
   *
   * @returns {Promise<Transaction>}
   */
  async rent(customer, carCategory, numberOfDays) {
    const car = await this.getAvailableCar(carCategory)

    const finalPrice = this.calculateFinalPrice(
      carCategory,
      customer,
      numberOfDays
    )

    const today = new Date()
    today.setDate(today.getDate() + numberOfDays)

    const options = { year: "numeric", month: "long", day: "numeric" }
    const dueDate = today.toLocaleDateString("pt-br", options)

    return new Transaction({
      customer,
      car,
      amount: finalPrice,
      dueDate,
    })
  }
}

module.exports = CarService
