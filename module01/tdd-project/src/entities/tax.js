class Tax {
  /**
   * Get the taxes used to calculate the final
   * price based on the customer age
   *
   * @returns {{ from: number, to: number, tax: number }[] }
   */
  static get taxesBasedOnAge() {
    return [
      { from: 18, to: 25, tax: 1.1 },
      { from: 26, to: 30, tax: 1.5 },
      { from: 31, to: 100, tax: 1.3 },
    ]
  }
}

module.exports = Tax
