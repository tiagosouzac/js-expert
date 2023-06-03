const Base = require("./base/base")

class Customer extends Base {
  /**
   * @param {object} param0
   * @param {string} param0.id
   * @param {string} param0.name
   * @param {number} param0.age
   */
  constructor({ id, name, age }) {
    super({ id, name })

    this.age = age
  }
}

module.exports = Customer
