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
query Products {
  products {
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

### updateProduct

```graphql
mutation Mutation($updateProductId: ID!, $input: CreateProductInput!) {
  updateProduct(id: $updateProductId, input: $input) {
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

### patchProduct

```graphql
mutation Mutation($patchProductId: ID!, $input: PatchProductInput!) {
  patchProduct(id: $patchProductId, input: $input) {
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

### deleteProduct

```graphql
mutation Mutation($deleteProductId: ID!) {
  deleteProduct(id: $deleteProductId)
}

```
