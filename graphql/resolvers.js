import ProductModel from "../models/product.js";
import mongoose from "mongoose";

export const resolvers = {
	Query: {
		// products
        products: async (_p, { limit, page }) => {

			//Skip = hoppa över X antal dokument (enkel paginering)
			const offset = parseInt(page-1) * parseInt(limit);

			return await ProductModel.find().limit(limit).skip(offset);
		},

		// product(id)
		product: async (_p, { id }) => {
			if (!mongoose.isValidObjectId(id)) return null;
			return ProductModel.findById(id);
		},
	},

	Mutation: {
		// addProduct(input)
		addProduct: async (_p, args) => {
			return await ProductModel.create(args.input);
		},

		// updateProduct(id, input)
		updateProduct: async (_p, { id, input }) => {
			if (!mongoose.isValidObjectId(id)) return null;
			const updatedProduct = await ProductModel.findOneAndReplace(
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
			return await ProductModel.findByIdAndUpdate(id, { $set: input }, {
				new: true,
				runValidators: false,
				upsert: false  // Do not create a new document if it doesn't exist
			});
		},

		// deleteProduct(id)
		deleteProduct: async (_p, { id }) => {
			if (!mongoose.isValidObjectId(id)) return false;
			const res = await ProductModel.findByIdAndDelete(id);
			return res ? true : false;
		},
	},

	Product: {
        id: (doc) => String(doc._id),
	},
};
