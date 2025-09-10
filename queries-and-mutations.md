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
  "input": {
    "amountInStock": 45,
    "category": "Meat Products",
    "description": "Truffle 300g Salami",
    "manufacturer": {
      "address": "Box 4103, SE-422 04 Hisings Backa (Gothenburg), Sweden",
      "contact": {
        "email": "foods.se@danishcrown.com",
        "name": "Mr Tulip",
        "phone": "+46 (0)31-65 50 50"
      },
      "country": "Sweden",
      "description": "Manufacturer of various meat products",
      "name": "Tulip Food Company AB",
      "website": "www.tulip.se"
    },
    "name": "Salami",
    "price": 9.99,
    "sku": "SAL-TRF-300G-REG-004"
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

```json
{
  "input": {
    "category": "Meat Products",
    "description": "Truffle 300g Salami",
    "manufacturer": {
      "address": "Box 4103, SE-422 04 Hisings Backa (Gothenburg), Sweden",
      "contact": {
        "email": "foods.se@danishcrown.com",
        "name": "Mr Tulip",
        "phone": "+46 (0)31-65 50 50"
      },
      "country": "Sweden",
      "description": "Manufacturer of various meat products",
      "name": "Tulip Food Company AB",
      "website": "www.tulip.se"
    },
    "name": "Salami",
    "price": 8.99,
    "sku": "SAL-TRF-300G-REG-004",
    "amountInStock": 43
  },
  "updateProductId": "68c16510f372eae5ead06eb4"
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

```json
{
  "input": {
    "price": 9.49,
    "amountInStock": 23,
    "manufacturer": {
      "contact": {
        "name": "Mrs Tulipa",
        "phone": "+46 (0)31-65 50 80"
      }
    }
  },
  "patchProductId": "68c16510f372eae5ead06eb4"
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
