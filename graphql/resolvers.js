import mongoose from "mongoose"
import merge from "lodash/merge.js"
import { Product } from "../models/product.js"
import { Manufacturer } from "../models/manufacturer.js"
import { Contact } from "../models/contact.js"

export const resolvers = {
  Query: {
    // *** CRUD operations ***

    // products
    products: async (_p, { filter, limit, page }) => {
      return await Product.aggregate([
        // Join manufacturer data
        {
          $lookup: {
            from: "manufacturers",
            localField: "manufacturer",
            foreignField: "_id",
            as: "manufacturer",
          },
        },
        { $unwind: "$manufacturer" },
        // Join contact data
        {
          $lookup: {
            from: "contacts",
            localField: "manufacturer.contact",
            foreignField: "_id",
            as: "manufacturer.contact",
          },
        },
        { $unwind: "$manufacturer.contact" },
        // Filter
        {
          $match: {
            ...(filter &&
              filter.category && {
                category: { $regex: filter.category, $options: "i" },
              }),
            ...(filter &&
              filter.manufacturer && {
                "manufacturer.name": {
                  $regex: filter.manufacturer,
                  $options: "i",
                },
              }),
            ...(filter &&
              filter.amountInStock && {
                amountInStock: { $lte: filter.amountInStock },
              }),
          },
        },
        // Pagination
        { $sort: { _id: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
     { $addFields: {
        id: { $toString: "$_id" },
        productId: { $toString: "$_id" },
        "manufacturer.id": { $toString: "$manufacturer._id" },
        "manufacturer.manufacturerId": { $toString: "$manufacturer._id" },
        "manufacturer.contact.id": { $toString: "$manufacturer.contact._id" },
        "manufacturer.contact.contactId": { $toString: "$manufacturer.contact._id" },
      } },
      ])
    },

    // product(id)
 product: async (_p, { id }) => {
      if (!mongoose.isValidObjectId(id)) return null;
      return Product.findById(id).populate({
        path: "manufacturer",
        populate: { path: "contact" },
      });
    },


    // *** Additional operations ***

    totalStockValue: async () => {
      const [totals] = await Product.aggregate([
        {
          $group: {
            _id: null,
            totalStockValue: {
              $sum: { $multiply: ["$price", "$amountInStock"] },
            },
          },
        },
      ])
      return totals.totalStockValue.toFixed(2)
    },

    totalStockValueByManufacturer: async () => {
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
      totalStockValue: { $round: ["$totalStockValue", 2] },
    },
  }
      ])
      totals.forEach(
        (item) =>
          (item.totalStockValue = parseFloat(item.totalStockValue.toFixed(2)))
      )
      console.log(totals)
      return totals
    },

    lowStockProducts: async () => {
      return await Product.find({ amountInStock: { $lt: 10 } }).populate({
        path: 'manufacturer',
        populate: {
          path: 'contact' // assuming manufacturer.contact is a ref
        }
      });
    },

    criticalStockProducts: async () => {
      return await Product.find({ amountInStock: { $lt: 5 } })
        .select("name sku amountInStock manufacturer")
        .populate({
          path: "manufacturer",
          select: "name contact",
          populate: {
            path: "contact",
            select: "name email phone",
          },
        })
    },

    manufacturers: async () => {
      return await Manufacturer.distinct("name")
    },
  },

  Mutation: {
    // addProduct(input)
    addProduct: async (_, { input }) => {
    let manufacturerId = input.manufacturerId;

    if (!manufacturerId && input.manufacturer) {
      const m = input.manufacturer;

      let contactId = m.contactId;
      if (!contactId && m.contact) {
        const createdContact = await Contact.create(m.contact);
        contactId = createdContact._id;
      }

      const createdManufacturer = await Manufacturer.create({
        name: m.name,
        country: m.country,
        website: m.website,
        description: m.description,
        address: m.address,
        contact: contactId, 
      });

      manufacturerId = createdManufacturer._id;
    }

    if (!manufacturerId) {
      throw new Error('Provide either manufacturerId or manufacturer.');
    }

    const created = await Product.create({
      name: input.name,
      sku: input.sku,
      description: input.description,
      price: input.price,
      category: input.category,
      amountInStock: input.amountInStock,
      manufacturer: manufacturerId,
    });


    return Product.findById(created._id).populate({
      path: 'manufacturer',
      populate: { path: 'contact' },
    });
  },

    // updateProduct(id, input)
    updateProduct: async (_p, { id, input }) => {
      if (!mongoose.isValidObjectId(id)) return null
      const { manufacturerId, ...rest } = input;
       const replaceDoc = {
    ...rest,
    manufacturer: manufacturerId,
  };
      const updatedProduct = await Product.findOneAndReplace(
        { _id: id },
        replaceDoc,
         {
        returnDocument: 'after', 
        runValidators: true,
        upsert: false,
        timestamps: true,  
      }
       ).populate({
        path: 'manufacturer',
        populate: {path: 'contact'}
      })
      return updatedProduct
    },

    // patchProduct(id, input)
    patchProduct: async (_p, { id, input }) => {
      if (!mongoose.isValidObjectId(id)) return null

      const existing = await Product.findById(id)
      if (!existing) return null

      // Deep merge the existing product with the patch input
     // const mergedData = merge({}, existing.toObject(), input)

       const { manufacturerId, ...rest } = input;
       const update = { ...rest };
       if (typeof manufacturerId !== 'undefined') {
       update.manufacturer = manufacturerId;
       }

      return await Product.findByIdAndUpdate(
        id,
        { $set: update },
        {
          new: true,
          runValidators: true,
          upsert: false, // Do not create a new document if it doesn't exist
        }
      ).populate({
        path: 'manufacturer',
        populate: {path: 'contact'}
      })
    },

    // deleteProduct(id)
    deleteProduct: async (_p, { id }) => {
      if (!mongoose.isValidObjectId(id)) return false
      const res = await Product.findByIdAndDelete(id)
      return res ? true : false
    },
  },

  Product: {
    id: (doc) => String(doc._id),
  },
}
