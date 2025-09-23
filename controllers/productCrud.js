import { Product } from "../models/product.js"
import { Manufacturer } from "../models/manufacturer.js"
import { Contact } from "../models/contact.js"
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
    {
      $project: {
        _id: 0,
        manufacturer: "$_id",
        totalStockValue: 1,
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
  const products = await Product.find({
    amountInStock: { $lt: threshold },
  }).populate({
    path: "manufacturer",
    select: "name",
    populate: { path: "contact" },
  })
  return products.map((p) => ({
    id: p._id,
    name: p.name,
    sku: p.sku,
    amountInStock: p.amountInStock,
    manufacturer: {
      name: p.manufacturer?.name,
      contact: {
        name: p.manufacturer?.contact?.name,
        email: p.manufacturer?.contact?.email,
        phone: p.manufacturer?.contact?.phone,
      },
    },
  }))
}

export const getCriticalStockProducts = async (threshold = 5) => {
  const products = await Product.find({ amountInStock: { $lt: threshold } })
    .select("name sku amountInStock manufacturer")
    .populate({
      path: "manufacturer",
      select: "name contact",
      populate: {
        path: "contact",
        select: "name email phone",
      },
    })

  // Map to compact shape
  return products.map((p) => ({
    id: p._id,
    name: p.name,
    sku: p.sku,
    amountInStock: p.amountInStock,
    manufacturer: {
      name: p.manufacturer?.name,
      contact: {
        name: p.manufacturer?.contact?.name,
        email: p.manufacturer?.contact?.email,
        phone: p.manufacturer?.contact?.phone,
      },
    },
  }))
}

export const getManufacturers = async () => {
  return Manufacturer.distinct("name")
}

// *** CRUD operations ***

export const createProduct = async (productData) => {
  return Product.create(productData)
}

export const findProductsWithFilterAndPagination = async (
  category,
  manufacturerName,
  amountInStock,
  limit,
  page
) => {
  // Step 1: Aggregate to get product IDs matching manufacturer name
  const pipeline = [
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
      $match: {
        ...(category && { category: { $regex: category, $options: "i" } }),
        ...(manufacturerName && {
          "manufacturerData.name": { $regex: manufacturerName, $options: "i" },
        }),
        ...(amountInStock && { amountInStock: { $gte: amountInStock } }),
      },
    },
    { $skip: (page - 1) * limit },
    { $limit: limit },
    { $project: { _id: 1 } },
  ]

  const ids = await Product.aggregate(pipeline).then((res) =>
    res.map((r) => r._id)
  )

  // Step 2: Fetch full products with populate
  return Product.find({ _id: { $in: ids } }).populate({
    path: "manufacturer",
    populate: { path: "contact" },
  })
}

export const findProductById = async (id) => {
  return Product.findById(id).populate({
    path: "manufacturer",
    populate: { path: "contact" },
  })
}

export const updateProduct = async (id, productData) => {
  const existing = await Product.findById(id)
  if (!existing) return null

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
