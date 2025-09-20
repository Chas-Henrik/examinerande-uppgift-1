import { Product } from "../models/product.js";
import mongoose from "mongoose";
import merge from 'lodash/merge.js';
import { productValidationSchema, patchProductValidationSchema } from "../validation/productSchema.js";


export const resolvers = {
	Query: {

		// *** CRUD operations ***

		// products
        products: async (_p, { filter, limit, page }) => {
		return await Product.aggregate([
			// 1. Filter Stage
			{
				$match: {
				...(filter && filter.category && { category: { $regex: filter.category, $options: "i" } }),
				...(filter && filter.manufacturer && { "manufacturer.name": { $regex: filter.manufacturer, $options: "i" } }),
				...(filter && filter.amountInStock && { amountInStock: { $lte: filter.amountInStock } })
				}
			},

			// 2. Skip Stage (for pagination)
			{ $skip: (page - 1) * limit },

			// 3. Limit Stage
			{ $limit: limit }
			])
		},

		// product(id)
		product: async (_p, { id }) => {
			if (!mongoose.isValidObjectId(id)) return null;
			return Product.findById(id);
		},

		// *** Additional operations ***

		totalStockValue: async () => {
			const [totals] = await Product.aggregate([
				{
					$group: {
						_id: null,
						totalStockValue: { $sum: { $multiply: ["$price", "$amountInStock"] } }
					}
				}
			]);
			return totals.totalStockValue.toFixed(2);
		},

		totalStockValueByManufacturer: async () => {
			const totals = await Product.aggregate([
				{
					$group: {
						_id: "$manufacturer.name",
						totalStockValue: { $sum: { $multiply: ["$price", "$amountInStock"] } }
					}
				}
			]);
			totals.forEach(item => item.totalStockValue = parseFloat(item.totalStockValue.toFixed(2)));
			console.log(totals);
			return totals;
		},

		lowStockProducts: async () => {
			return await Product.find({ amountInStock: { $lt: 10 } });
		},

		criticalStockProducts: async () => {
			return await Product.find({ amountInStock: { $lt: 5 } }).select("name sku amountInStock manufacturer.name manufacturer.contact.name manufacturer.contact.phone manufacturer.contact.email");
		},

		manufacturers: async () => {
			return await Product.distinct("manufacturer.name");
		}

	},

	Mutation: {
		// addProduct(input)
		addProduct: async (_p, args) => {
			const result = productValidationSchema.safeParse(args.input);
			if (!result.success) {
        throw new Error(JSON.stringify(
					{ 
                error: "Validation failed", 
                details: result.error.issues.map(issue => ({
                    field: issue.path.join("."), 
                    message: issue.message       
                })) 
          }
				));
      }
			return await Product.create(args.input);
		},

		// updateProduct(id, input)
		updateProduct: async (_p, { id, input }) => {
			if (!mongoose.isValidObjectId(id)) return null;

			const result = productValidationSchema.safeParse(args.input);
			if (!result.success) {
        throw new Error(JSON.stringify(
					{ 
                error: "Validation failed", 
                details: result.error.issues.map(issue => ({
                    field: issue.path.join("."), 
                    message: issue.message       
                })) 
          }
				));
      }

			const updatedProduct = await Product.findOneAndReplace(
				{ _id: id },
				input,
				{
				new: true,
				runValidators: true,
				upsert: false, // Do not create a new document if it doesn't exist
				}
			);
			return updatedProduct;
		},

		// patchProduct(id, input)
		patchProduct: async (_p, { id, input }) => {
			if (!mongoose.isValidObjectId(id)) return null;
			
			const existing = await Product.findById(id);
			if (!existing) return null;

			const result = patchProductValidationSchema.safeParse(args.input);
			if (!result.success) {
        throw new Error(JSON.stringify(
					{ 
                error: "Validation failed", 
                details: result.error.issues.map(issue => ({
                    field: issue.path.join("."), 
                    message: issue.message       
                })) 
          }
				));
      }

			// Deep merge the existing product with the patch input
			const mergedData = merge({}, existing.toObject(), input);

			return await Product.findByIdAndUpdate(id, { $set: mergedData }, {
				new: true,
				runValidators: true,
				upsert: false  // Do not create a new document if it doesn't exist
			});
		},

		// deleteProduct(id)
		deleteProduct: async (_p, { id }) => {
			if (!mongoose.isValidObjectId(id)) return false;
			const res = await Product.findByIdAndDelete(id);
			return res ? true : false;
		},
	},

	Product: {
        id: (doc) => String(doc._id),
	},
};
