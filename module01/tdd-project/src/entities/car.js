const Base = require("./base/base")

class Car extends Base {
  /**
   * @param {object} param0
   * @param {string} param0.id
   * @param {string} param0.name
   * @param {number} param0.releaseYear
   * @param {boolean} param0.available
   * @param {boolean} param0.gasAvailable
   */
  constructor({ id, name, releaseYear, available, gasAvailable }) {
    super({ id, name })

    this.releaseYear = releaseYear
    this.available = available
    this.gasAvailable = gasAvailable
  }
}

module.exports = Car
