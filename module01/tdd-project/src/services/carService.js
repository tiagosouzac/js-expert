const BaseRepository = require("../repositories/base/baseRepository")
const CarCategory = require("../entities/car-category")
const Car = require("../entities/car")

class CarService {
  constructor({ cars }) {
    this.carRepository = new BaseRepository({ file: cars })
  }

  /**
   * Get a random car from a car category
   *
   * @param {CarCategory} carCategory
   *
   * @returns {Car}
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
}

module.exports = CarService
