import { faker } from "@faker-js/faker";
import { connectDB } from "./db.js";      
import { Product } from "./models/product.js";
import mongoose from "mongoose";  

const N = 1000;

function buildPhone() {
    const digits = faker.number.int({ min: 1000000, max: 99999999999999999 }); 
    return `+${digits}`; 
  }

function buildManufacturer() {
  return {
    name: faker.company.name(),
    country: faker.location.country(),
    website: faker.internet.url(),
    description: faker.lorem.sentence(),
    address: faker.location.streetAddress(),
    contact: {
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      phone: buildPhone(),
    },
  };
}

function buildProduct() {
  return {
    name: faker.commerce.productName(),
    sku: faker.string.alphanumeric(8).toUpperCase(),
    description: faker.commerce.productDescription(),
    price: Number(faker.commerce.price({ min: 10, max: 2000 })),
    category: faker.commerce.department(),
    manufacturer: buildManufacturer(),
    amountInStock: faker.number.int({ min: 0, max: 1000 }),
  };
}

async function seedDB() {
  await connectDB();

  // töm befintlig collection
  await Product.deleteMany({});
  console.log("🧹 products rensad");

  // generera produkter
  const products = Array.from({ length: N }, buildProduct);

  await Product.insertMany(products);
  console.log(`🌱 ${N} produkter seedade!`);

  await mongoose.disconnect();
  console.log("👋 Klart & stängt");
}

seedDB().catch((err) => {
  console.error("❌ Seed fail:", err);
  process.exit(1);
});

// To run this script, use the command: node examinerande-uppgift-1/seed.js