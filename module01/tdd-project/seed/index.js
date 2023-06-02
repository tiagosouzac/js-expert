const faker = require("faker")
const { join } = require("path")
const { writeFile, access, constants, mkdir } = require("fs/promises")
const Car = require("../src/entities/car")
const CarCategory = require("../src/entities/car-category")
const Customer = require("../src/entities/customer")

const seederBaseFolder = join(__dirname, "..", "database")
const ITEMS_AMOUNT = 2

const carCategory = new CarCategory({
  id: faker.random.uuid(),
  name: faker.vehicle.type(),
  carIds: [],
  price: faker.finance.amount(20, 100),
})

const cars = []
const customers = []

for (let i = 0; i < ITEMS_AMOUNT; i++) {
  const car = new Car({
    id: faker.random.uuid(),
    name: faker.vehicle.model(),
    releaseYear: faker.date.past().getFullYear(),
    available: true,
    gasAvailable: true,
  })

  const customer = new Customer({
    id: faker.random.uuid(),
    name: faker.name.findName(),
    age: faker.random.number({ min: 18, max: 50 }),
  })

  carCategory.carIds.push(car.id)
  cars.push(car)
  customers.push(customer)
}

const write = (filename, data) =>
  writeFile(join(seederBaseFolder, filename), JSON.stringify(data))

;(async () => {
  // Create the database folder if it doesn't exist
  try {
    await access(seederBaseFolder, constants.F_OK)
  } catch (error) {
    await mkdir(seederBaseFolder)
  }

  await write("cars.json", cars)
  await write("car-categories.json", [carCategory])
  await write("customers.json", customers)

  console.log({ cars, carCategory, customers })
})()
