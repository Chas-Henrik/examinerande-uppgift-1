import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { Contact } from "./models/contact.js";
import { Manufacturer } from "./models/manufacturer.js";
import { Product } from "./models/product.js";
import dotenv from 'dotenv';

dotenv.config();


const MONGODB_URI =
  process.env.MONGODB_URI;

const CLEAR_COLLECTIONS = true;

const N_MANUFACTURERS = 100;   
const N_PRODUCTS = 1000;       


function uniqueValues(generatorFn, n) {
  const used = new Set();
  const arr = [];
  while (arr.length < n) {
    const v = generatorFn();
    if (!used.has(v)) {
      used.add(v);
      arr.push(v);
    }
  }
  return arr;
}

function buildPhone() {
  const cc = "+46"; 
  const segs = [
    faker.number.int({ min: 10, max: 99 }),         
    faker.number.int({ min: 100, max: 999 }),       
    faker.number.int({ min: 10, max: 99 }),         
    faker.number.int({ min: 10, max: 99 }),         
  ];
  const phone = `${cc} ${segs[0]} ${segs[1]} ${segs[2]} ${segs[3]}`;
  if (phone.replace(/\s/g, "").length < 7) return buildPhone();
  if (phone.length > 20) return buildPhone();
  return phone;
}

function buildWebsite() {
  return faker.internet.url({ protocol: "https" });
}

function buildContactPayloads(n) {
  const emails = uniqueValues(
    () => faker.internet.email({ provider: "example.com" }).toLowerCase(),
    n
  );

  return Array.from({ length: n }, (_, i) => ({
    name: faker.person.fullName(),
    email: emails[i],
    phone: buildPhone(),
  }));
}

function buildManufacturerPayloads(contacts) {
  return contacts.map((c) => ({
    name: faker.company.name(),
    country: faker.location.country(),
    website: buildWebsite(),
    description: faker.lorem.sentence(),
    address: faker.location.streetAddress(),
    contact: c._id, 
  }));
}

function buildSkuPool(n) {
  return uniqueValues(() => {
    const part = () => faker.string.alphanumeric({ length: 3 }).toUpperCase();
    const num = String(faker.number.int({ min: 0, max: 999999 })).padStart(4, "0");
    return `${part()}-${part()}-${num}`;
  }, n);
}

function buildProductPayloads(n, manufacturerIds) {
  const skus = buildSkuPool(n);

  return Array.from({ length: n }, (_, i) => ({
    name: faker.commerce.productName(),
    sku: skus[i], 
    description: faker.commerce.productDescription(),
    price: Number(
      faker.number.float({ min: 0, max: 2000, multipleOf: 0.01 }).toFixed(2)
    ),
    category: faker.commerce.department(),
    manufacturer: manufacturerIds[
      Math.floor(Math.random() * manufacturerIds.length)
    ], 
    amountInStock: faker.number.int({ min: 0, max: 1000 }),
  }));
}



async function seed() {
  console.log("🛰️  Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI, { dbName: "imsDatabase" });
  console.log("✅ Connected");

  try {
    if (CLEAR_COLLECTIONS) {
      console.log("🧹 Clearing collections...");
      await Promise.all([
        Product.deleteMany({}),
        Manufacturer.deleteMany({}),
        Contact.deleteMany({}),
      ]);
      console.log("✅ Cleared products, manufacturers, contacts");
    }

  
    console.log("🔧 Syncing indexes...");
    await Promise.all([
      Contact.syncIndexes(),
      Manufacturer.syncIndexes(),
      Product.syncIndexes(),
    ]);
    console.log("✅ Indexes synced");

    
    console.log(`👤 Creating ${N_MANUFACTURERS} contacts...`);
    const contactPayloads = buildContactPayloads(N_MANUFACTURERS);
    const contacts = await Contact.insertMany(contactPayloads, { ordered: true });
    console.log(`✅ Inserted contacts: ${contacts.length}`);

   
    console.log(`🏭 Creating ${contacts.length} manufacturers...`);
    const manufacturerPayloads = buildManufacturerPayloads(contacts);
    const manufacturers = await Manufacturer.insertMany(manufacturerPayloads, {
      ordered: true,
    });
    console.log(`✅ Inserted manufacturers: ${manufacturers.length}`);

    const manufacturerIds = manufacturers.map((m) => m._id);

 
    console.log(`📦 Creating ${N_PRODUCTS} products...`);
    const productPayloads = buildProductPayloads(N_PRODUCTS, manufacturerIds);
    const products = await Product.insertMany(productPayloads, { ordered: true });
    console.log(`✅ Inserted products: ${products.length}`);

    console.log("🎉 Seeding complete!");
  } catch (err) {
    console.error("❌ Seed failed:", err?.message);

    if (err?.writeErrors?.length) {
      for (const e of err.writeErrors) {
        console.error(" - writeError:", e.err?.errmsg || e.errmsg || e.message);
      }
    }
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected");
  }
}

seed();
