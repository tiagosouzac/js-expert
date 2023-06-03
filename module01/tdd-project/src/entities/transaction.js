class Transaction {
  /**
   * @param {Object} param0
   * @param {Customer} param0.customer
   * @param {Car} param0.car
   * @param {number} param0.amount
   * @param {string} param0.dueDate
   */
  constructor({ customer, car, amount, dueDate }) {
    this.customer = customer
    this.car = car
    this.amount = amount
    this.dueDate = dueDate
  }
}

module.exports = Transaction
