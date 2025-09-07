
export const typeDefs = /* GraphQL */ `
    type Contact {
        name: String!
        email: String!
        phone: String!
    }

    type Manufacturer {
        name: String!
        country: String!
        website: String
        description: String
        address: String!
        contact: Contact!
    }

    type Product {
        id: ID!
        name: String!
        sku: String!
        description: String
        price: Float!
        category: String
        manufacturer: Manufacturer!
        amountInStock: Int!
        createdAt: String!
        updatedAt: String!
    }

    type Query {
        products(limit: Int = 10, page: Int = 1): [Product!]!
        product(id: ID!): Product
    }

    input CreateContactInput {
        name: String!
        email: String!
        phone: String!
    }

    input UpdateContactInput {
        name: String
        email: String
        phone: String
    }

    input CreateManufacturerInput {
        name: String!
        country: String!
        website: String
        description: String
        address: String!
        contact: CreateContactInput!
    }

    input UpdateManufacturerInput {
        name: String
        country: String
        website: String
        description: String
        address: String
        contact: UpdateContactInput
    }

    input CreateProductInput {
        name: String!
        sku: String!
        description: String
        price: Float!
        category: String
        manufacturer: CreateManufacturerInput!
        amountInStock: Int!
    }

    input UpdateProductInput {
        name: String
        sku: String
        description: String
        price: Float
        category: String
        manufacturer: UpdateManufacturerInput
        amountInStock: Int
    }

    type Mutation {
        createProduct(input: CreateProductInput!): Product!
        updateProduct(id: ID!, input: UpdateProductInput!): Product!
        deleteProduct(id: ID!): Boolean!
    }
`;