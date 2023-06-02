const assert = require("assert")
const { describe, it, before, after } = require("mocha")
const supertest = require("supertest")

describe("API Suite Test", () => {
  let app

  before((done) => {
    app = require("../src/api.js")
    app.once("listening", done)
  })

  after((done) => app.close(done))

  describe("get:/contact", () => {
    it("should request the contact route and return HTTP Status 200", async () => {
      const response = await supertest(app).get("/contact").expect(200)
      assert.strictEqual(response.text, "Contact us page!")
    })
  })

  describe("post:/login", () => {
    it("should request the login route and return HTTP Status 200", async () => {
      const response = await supertest(app)
        .post("/login")
        .send({ username: "TiagoCastro", password: "12345678" })
        .expect(200)

      assert.strictEqual(response.text, "Logged in!")
    })

    it("should request the login route and return HTTP Status 401", async () => {
      const response = await supertest(app)
        .post("/login")
        .send({ username: "xuxadasilva", password: "1234" })
        .expect(401)

      assert.ok(response.unauthorized)
      assert.strictEqual(response.text, "Invalid credentials!")
    })
  })

  describe("404", async () => {
    it("should request an inexistent route and return HTTP Status 404", async () => {
      const response = await supertest(app).get("/inexistent-route").expect(404)
      assert.strictEqual(response.text, "Not found!")
    })
  })
})
