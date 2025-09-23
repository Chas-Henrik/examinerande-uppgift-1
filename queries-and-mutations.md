# Queries and mutations

Add your queries and mutations here.
A tip is to use [GraphQL Formatter](https://jsonformatter.org/graphql-formatter) to format them to make them easier to read.

## This is an example

```graphql
mutation {
  addSale(
    saleDate: "1427144809506"
    items: [
      {
        name: "printer paper"
        tags: ["office", "stationary"]
        price: 40.01
        quantity: 2
      }
    ]
    storeLocation: "Denver"
    customer: {
      gender: "M"
      age: 42
      email: "cauhowitwuta.sv"
      satisfaction: 4
    }
    couponUsed: true
    purchaseMethod: "Online"
  ) {
    id
  }
}
```

## Queries

### products

```graphql
query Products($filter: ProductFilter, $limit: Int, $page: Int) {
  products(filter: $filter, limit: $limit, page: $page) {
    amountInStock
    category
    createdAt
    description
    id
    manufacturer {
      address
      contact {
        email
        name
        phone
      }
      country
      description
      name
      website
    }
    name
    price
    sku
    updatedAt
  }
}

```

```json
{
  "filter": {
    "category": "meat",
    "manufacturer": "Tulip",
    "amountInStock": 20
  },
  "limit": 5,
  "page": 1
}
```

### product(id: ID!)

```graphql
query Query($productId: ID!) {
  product(id: $productId) {
    id
    name
    price
    sku
    amountInStock
    category
    createdAt
    description
    manufacturer {
      address
      contact {
        email
        name
        phone
      }
      country
      description
      name
      website
    }
    updatedAt
  }
}

```

```json
{
  "productId": "68be8063793d5b718b476ab0"
}
```


### totalStockValue

```graphql
query Products {
  totalStockValue
}

```

### totalStockValueByManufacturer

```graphql
query Products {
  totalStockValueByManufacturer {
    _id
    totalStockValue
  }
}

```

### lowStockProducts

```graphql
query Products {
  lowStockProducts {
    amountInStock
    category
    createdAt
    description
    id
    manufacturer {
      address
      contact {
        email
        name
        phone
      }
      country
      description
      name
      website
    }
    name
    price
    sku
    updatedAt
  }
}

```

### criticalStockProducts

```graphql
query Products {
  criticalStockProducts {
    amountInStock
    id
    manufacturer {
      contact {
        name
        email
        phone
      }
      name
    }
    name
    sku
  }
}

```

### manufacturers

```graphql
query Products {
  manufacturers
}

```

## Mutations

### addProduct

```graphql
mutation Mutation($input: CreateProductInput!) {
  addProduct(input: $input) {
    manufacturer {
      manufacturerId
    }
    amountInStock
    createdAt
    price
    name
    sku
  }
}

```

```json
{
  "input": {
    "name": "Salami",
    "sku": "SAL-TRF-200G-RSG-504", <--- UNIKT
    "description": "Truffle 300g Salami",
    "price": 9.99,
    "category": "Meat Products",
    "amountInStock": 45,
    "manufacturerId": "ETT MANUFACTURER_ID SOM REDAN FINNS I DATABASEN"
  }
}

```

### updateProduct

```graphql
mutation Mutation($updateProductId: ID!, $input: UpdateProductInput!) {
  updateProduct(id: $updateProductId, input: $input) {
    amountInStock
    createdAt
    price
    name
    sku
    updatedAt
  }
}
}

```

```json
{  "updateProductId": "68cbf698690bf3e3fe0104ea",
    "input": {
    "name": "Test wireliseesase",
    "sku": "PROX-WH-001",
    "description": "testast.",
    "price": 199.99,
    "category": "Electronics",
    "manufacturerId": "650fa12e4b1c2a3d8f1a9b77",
    "amountInStock": 120
  }
}

```

### patchProduct

```graphql
mutation Mutation($patchProductId: ID!, $input: PatchProductInput!) {
  patchProduct(id: $patchProductId, input: $input) {
    amountInStock
    createdAt
    price
    name
    sku
    updatedAt
    manufacturerId
  }
}
}

```

```json
{
  "patchProductId": "68cbf698690bf3e3fe0104ea",
  "input": {
    "name": "Gaming Laptop X15",
    "sku": "LAPTOP-X15-2025",
    "description": "High-performance gaming laptop with RTX 5090 GPU and Intel i11 CPU.",
    "price": 2499.99,
    "category": "Computers",
    "amountInStock": 15,
    "manufacturerId": "68cbf698690bf3e3fe01049c"
  }
}

```


### deleteProduct

```graphql
mutation Mutation($deleteProductId: ID!) {
  deleteProduct(id: $deleteProductId)
}

```

```json
{
  "deleteProductId": "68c16510f372eae5ead06eb4"
}

```
