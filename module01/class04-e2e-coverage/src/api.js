const http = require("http")
const { once } = require("events")

const DEFAULT_USER = {
  username: "TiagoCastro",
  password: "12345678",
}

/** @type {{ [key: string]: (request: http.IncomingMessage, response: http.ServerResponse) => http.ServerResponse }} */
const routes = {
  "get:/contact": (_, response) => {
    response.write("Contact us page!")
    return response.end()
  },

  "post:/login": async (request, response) => {
    /** @type {{ username: string, password: string }} */
    const user = JSON.parse(await once(request, "data"))

    if (
      user.username.toLowerCase() !== DEFAULT_USER.username.toLowerCase() ||
      user.password !== DEFAULT_USER.password
    ) {
      response.writeHead(401)
      return response.end("Invalid credentials!")
    }

    return response.end("Logged in!")
  },

  default: (_, response) => {
    response.writeHead(404)
    return response.end("Not found!")
  },
}

/**
 * @param {http.IncomingMessage} request
 * @param {http.ServerResponse} response
 */
const handler = (request, response) => {
  const { url, method } = request
  const routeKey = `${method.toLowerCase()}:${url.toLowerCase()}`
  const chosen = routes[routeKey] || routes.default
  return chosen(request, response)
}

const app = http.createServer(handler)
app.listen(3000, () => console.log("Server running on port 3000! 🚀"))

module.exports = app
