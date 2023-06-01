const { createSandbox } = require("sinon")
const assert = require("assert")
const Fibonacci = require("../src/fibonacci")

const sinon = createSandbox()

;(() => {
  {
    // Test how many times the "execute" function was executed
    const fibonacci = new Fibonacci()
    const spy = sinon.spy(fibonacci, fibonacci.execute.name)

    for (const sequency of fibonacci.execute(5)) {
    }

    const expectedCallCount = 6
    assert.strictEqual(spy.callCount, expectedCallCount)
  }

  {
    // Test if the "execute" function returns the expected values
    const fibonacci = new Fibonacci()
    const [...results] = fibonacci.execute(5)
    const expectedResults = [0, 1, 1, 2, 3]
    assert.deepStrictEqual(results, expectedResults)
  }
})()
