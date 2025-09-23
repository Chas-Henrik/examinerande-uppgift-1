
export const typeDefs = /* GraphQL */ `
    type Contact {
        id: ID!
        contactId: ID
        name: String!
        email: String!
        phone: String!
    }

    type Manufacturer {
        id: ID!
        manufacturerId: ID
        name: String!
        country: String!
        website: String
        description: String
        address: String!
        contact: Contact!
    }

    type Product {
        id: ID!
        productId: ID
        name: String!
        sku: String!
        description: String
        price: Float!
        category: String
        manufacturer: Manufacturer!
        amountInStock: Int!
        createdAt: String!
        updatedAt: String!
        manufacturerId: ID
    }

    type StockValueByManufacturer {
        _id: String!
        totalStockValue: Float!
    }

    type ManufacturerCriticalStockInfo {
        name: String!
        contact: Contact!
    }

    type ProductCriticalStockInfo {
        id: ID!
        name: String!
        sku: String!
        manufacturer: ManufacturerCriticalStockInfo!
        amountInStock: Int!
    }

	input ProductFilter {
		category: String
		manufacturer: String
		amountInStock: Int
	}

    type Query {
        products(filter: ProductFilter, limit: Int = 10, page: Int = 1): [Product!]!
        product(id: ID!): Product
        totalStockValue: Float
        totalStockValueByManufacturer: [StockValueByManufacturer!]!
        lowStockProducts: [Product!]!
        criticalStockProducts: [ProductCriticalStockInfo!]!
        manufacturers: [String!]!
    }

    input CreateContactInput {
        name: String!
        email: String!
        phone: String!
    }

    input PatchContactInput {
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
        contactId: ID
        contact: CreateContactInput!
    }

    input PatchManufacturerInput {
        name: String
        country: String
        website: String
        description: String
        address: String
        contact: PatchContactInput
    }

    input CreateProductInput {
          name: String!
          sku: String!
          description: String
          price: Float!
          category: String
          amountInStock: Int!
          manufacturerId: ID!
          
    }

    input UpdateProductInput {
     name: String!
     sku: String!
     description: String
     price: Float!
     category: String
     amountInStock: Int!
     manufacturerId: ID!   
    }

    input PatchProductInput {
        name: String
        sku: String
        description: String
        price: Float
        category: String
        manufacturer: PatchManufacturerInput
        amountInStock: Int
        manufacturerId: ID
    }

    type Mutation {
        addProduct(input: CreateProductInput!): Product!
        updateProduct(id: ID!, input: UpdateProductInput!): Product!
        patchProduct(id: ID!, input: PatchProductInput!): Product!
        deleteProduct(id: ID!): Boolean!
    }
`;