import {faker} from '@faker-js/faker';

import {MongoClient} from 'mongodb';

const url = "mongodb://localhost:27017";
const dbName = "examinerande-uppgift-1";
const collectionName = "products";

async function seedDB() {
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Clear existing data
    await collection.deleteMany({});

    // Generate 1000 products
    const products = Array.from({ length: 1000 }).map(() => {
        const manufacturer = {
            name: faker.company.name(),
            country: faker.location.country(),
            website: faker.internet.url(),
            description: faker.lorem.sentence(),
            address: faker.location.streetAddress(),
            contact: faker.phone.number(),
        };

        return {
            name: faker.commerce.productName(),
            sku: faker.string.alphanumeric(8).toUpperCase(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            category: faker.commerce.department(),
            manufacturer,
            amountInstock: faker.number.int({ min: 0, max: 1000 }),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    });

    await collection.insertMany(products);
    console.log("✅ 1000 produkter seedade!");
    await client.close();
}

seedDB().catch(console.error);

// To run this script, use the command: node examinerande-uppgift-1/seed.js