class Service {
  /**
   * @param {string} url
   * @returns {Promise}
   */
  async makeRequest(url) {
    return (await fetch(url)).json()
  }

  /**
   * @param {string} url
   * @returns {Promise<{ name: string, surface: string, appearedIn: number }>}
   */
  async getPlanets(url) {
    const response = await this.makeRequest(url)

    return {
      name: response.name,
      surface: response.surface_water,
      appearedIn: response.films.length,
    }
  }
}

module.exports = Service
