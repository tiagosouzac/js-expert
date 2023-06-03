const Base = require("./base/base")

class CarCategory extends Base {
  /**
   * @param {object} param0
   * @param {string} param0.id
   * @param {string} param0.name
   * @param {string[]} param0.carIds
   * @param {number} param0.price
   */
  constructor({ id, name, carIds, price }) {
    super({ id, name })

    this.carIds = carIds
    this.price = price
  }
}

module.exports = CarCategory
