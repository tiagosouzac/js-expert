const { readFile } = require("fs/promises")
const errors = require("./errors")

const DEFAULT_OPTIONS = {
  maxLines: 4,
  fields: ["id", "name", "age", "profession"],
}

class File {
  /**
   * User format in the CSV file
   *
   * @typedef {object} User
   * @property {number} id
   * @property {string} name
   * @property {number} age
   * @property {string} profession
   */

  /**
   * Convert the CSV file to JSON format
   *
   * @param {string} filePath
   * @returns {Promise<User[]>}
   */
  static async csvToJson(filePath) {
    const content = await readFile(filePath, "utf8")
    const validation = this.isValid(content)

    if (!validation.valid) throw new Error(validation.error)

    return this.parseCSVToJSON(content)
  }

  /**
   * Verify if the file content header and length are valid
   *
   * @param {string} csvString
   * @param {{ maxLines: number, fields: string[] }} options
   * @returns {{ valid: boolean, error?: string }}
   */
  static isValid(csvString, options = DEFAULT_OPTIONS) {
    const [header, ...fileWithoutHeader] = csvString.trim().split(/\r?\n/)

    const isHeaderValid = header === options.fields.join(",")

    if (!isHeaderValid) {
      return {
        valid: false,
        error: errors.FILE_FIELDS,
      }
    }

    if (!fileWithoutHeader.length) {
      return {
        valid: false,
        error: errors.FILE_EMPTY,
      }
    }

    if (fileWithoutHeader.length > 4) {
      return {
        valid: false,
        error: errors.FILE_LENGTH,
      }
    }

    return {
      valid: true,
      error: undefined,
    }
  }

  /**
   * Parse the CSV string to JSON format
   *
   * @param {string} csvString
   * @returns {User[]}
   */
  static parseCSVToJSON(csvString) {
    const lines = csvString.trim().split(/\r?\n/)

    const firstLine = lines.shift()
    const headers = firstLine.split(",")

    return lines.map((line) => {
      const columns = line.split(",")
      const user = {}

      for (const index in columns) {
        const key = headers[index]
        const value = columns[index].trim()
        user[key] = value
      }

      return user
    })
  }
}

module.exports = File
