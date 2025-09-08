import { Product } from "../models/product.js";
import mongoose from "mongoose";

export const resolvers = {
	Query: {

		// *** CRUD operations ***

		// products
        products: async (_p, { filter, limit, page }) => {
			const q = {};
			if (filter) {
				if (filter.category) q.category = new RegExp(filter.category, "i");
				if (filter.manufacturer) q["manufacturer.name"] = new RegExp(filter.manufacturer, "i");
				if (filter.amountInStock) q.amountInStock = { $lte: filter.amountInStock };
			}

			//offset = hoppa över X antal dokument (enkel paginering)
			const offset = parseInt(page-1) * parseInt(limit);

			return await Product.find(q).limit(limit).skip(offset);
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
			return await Product.create(args.input);
		},

		// updateProduct(id, input)
		updateProduct: async (_p, { id, input }) => {
			if (!mongoose.isValidObjectId(id)) return null;
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
			return await Product.findByIdAndUpdate(id, { $set: input }, {
				new: true,
				runValidators: false,
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
