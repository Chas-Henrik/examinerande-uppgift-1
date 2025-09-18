import { Manufacturer } from "../models/manufacturer.js"
import { Product } from "../models/product.js"
import merge from "lodash/merge.js"

// *** Additional operations ***

export const getTotalStockValue = async () => {
  const [totals] = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalStockValue: { $sum: { $multiply: ["$price", "$amountInStock"] } },
      },
    },
  ])
  return totals.totalStockValue.toFixed(2)
}

export const getTotalStockValueByManufacturer = async () => {
  const totals = await Product.aggregate([
    {
      $lookup: {
        from: "manufacturers",
        localField: "manufacturer",
        foreignField: "_id",
        as: "manufacturerData",
      },
    },
    { $unwind: "$manufacturerData" },
    {
      $group: {
        _id: "$manufacturerData.name",
        totalStockValue: {
          $sum: { $multiply: ["$amountInStock", "$price"] },
        },
      },
    },
  ])
  totals.forEach(
    (item) =>
      (item.totalStockValue = parseFloat(item.totalStockValue.toFixed(2)))
  )
  return totals
}

export const getLowStockProducts = async (threshold = 10) => {
  return Product.find({ amountInStock: { $lt: threshold } })
}

export const getCriticalStockProducts = async (threshold = 5) => {
  return Product.find({ amountInStock: { $lt: threshold } }).select(
    "name sku amountInStock manufacturer.name manufacturer.contact.name manufacturer.contact.phone manufacturer.contact.email"
  )
}

export const getManufacturers = async () => {
  return Manufacturer.distinct("name")
}

// *** CRUD operations ***

export const createProduct = async (productData) => {
  return Product.create(productData)
}

export const findProducts = async () => {
  return Product.find()
}

export const findProductsWithFilterAndPagination = async (
  category,
  manufacturer,
  amountInStock,
  limit,
  page
) => {
  return await Product.aggregate([
    // 1. Filter Stage
    {
      $match: {
        ...(category && { category: { $regex: category, $options: "i" } }),
        ...(manufacturer && {
          "manufacturer.name": { $regex: manufacturer, $options: "i" },
        }),
        ...(amountInStock && { amountInStock: { $lte: amountInStock } }),
      },
    },

    // 2. Skip Stage (for pagination)
    { $skip: (page - 1) * limit },

    // 3. Limit Stage
    { $limit: limit },
  ])
}

export const findProduct = async (id) => {
  return Product.findById(id)
}

export const updateProduct = async (id, productData) => {
  return Product.replaceOne({ _id: id }, productData, {
    new: true,
    runValidators: true,
    upsert: false, // Do not create a new document if it doesn't exist
  })
}

export const patchProduct = async (id, productData) => {
  const existing = await Product.findById(id)
  if (!existing) return null

  // Deep merge the existing product with the patch input
  const mergedData = merge({}, existing.toObject(), productData)

  return Product.findByIdAndUpdate(
    id,
    { $set: mergedData },
    {
      new: true,
      runValidators: true,
      upsert: false, // Do not create a new document if it doesn't exist
    }
  )
}

export const deleteProduct = async (id) => {
  return Product.findByIdAndDelete(id)
}
