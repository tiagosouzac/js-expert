const assert = require("assert")
const File = require("../src/file")
const errors = require("../src/errors")

;(async () => {
  {
    // Verify if the file is empty
    const filePath = "./tests/mocks/invalid-empty-file.csv"
    const result = File.csvToJson(filePath)
    const expected = new Error(errors.FILE_EMPTY)
    await assert.rejects(result, expected)
  }

  {
    // Verify if the header not contains the expected fields
    const filePath = "./tests/mocks/invalid-header.csv"
    const result = File.csvToJson(filePath)
    const expected = new Error(errors.FILE_FIELDS)
    await assert.rejects(result, expected)
  }

  {
    // Verify if the file length is greater than allowed
    const filePath = "./tests/mocks/invalid-length.csv"
    const result = File.csvToJson(filePath)
    const expected = new Error(errors.FILE_LENGTH)
    await assert.rejects(result, expected)
  }

  {
    // Verify if the file is valid
    const filePath = "./tests/mocks/valid.csv"
    const result = await File.csvToJson(filePath)
    const expected = [
      {
        id: 1,
        name: "xuxa da silva",
        age: 120,
        profession: "developer",
      },
      {
        id: 2,
        name: "jose da silva",
        age: 30,
        profession: "manager",
      },
      {
        id: 3,
        name: "zezin",
        age: 25,
        profession: "QA",
      },
      {
        id: 4,
        name: "ana",
        age: 20,
        profession: "analyst",
      },
    ]

    assert.deepEqual(result, expected)
  }
})()
