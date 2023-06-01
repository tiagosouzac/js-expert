const assert = require("assert")
const { createSandbox } = require("sinon")
const Service = require("../src/service")

const sinon = createSandbox()

/**
 * @type {{ [key: string]: { api_url: string, mock_file: string } }}
 */
const mocks = {
  tatooine: {
    api_url: "https://swapi.dev/api/planets/1/",
    mock_file: require("./mocks/tatooine.json"),
  },
  alderaan: {
    api_url: "https://swapi.dev/api/planets/2/",
    mock_file: require("./mocks/alderaan.json"),
  },
}

;(async () => {
  const service = new Service()

  const stub = sinon.stub(service, service.makeRequest.name)
  stub.withArgs(mocks.tatooine.api_url).resolves(mocks.tatooine.mock_file)
  stub.withArgs(mocks.alderaan.api_url).resolves(mocks.alderaan.mock_file)

  {
    const expected = {
      name: "Tatooine",
      surface: "1",
      appearedIn: 5,
    }

    const result = await service.getPlanets(mocks.tatooine.api_url)
    assert.deepStrictEqual(result, expected)
  }

  {
    const expected = {
      name: "Alderaan",
      surface: "40",
      appearedIn: 2,
    }

    const result = await service.getPlanets(mocks.alderaan.api_url)
    assert.deepStrictEqual(result, expected)
  }
})()
