const { readFile } = require("fs/promises")

class BaseRepository {
  constructor({ file }) {
    this.file = file
  }

  /**
   * @description Return all items from the file or find an item by id
   * @param {string?} itemId
   */
  async find(itemId) {
    const content = await this.#readFileContent()
    if (!itemId) return content

    return content.find(({ id }) => id === itemId)
  }

  /**
   * @description Read the file content and return it as an JSON
   * @private
   */
  async #readFileContent() {
    const content = await readFile(this.file)
    return JSON.parse(content)
  }
}

module.exports = BaseRepository
