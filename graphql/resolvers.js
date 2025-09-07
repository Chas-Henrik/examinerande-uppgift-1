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

	Product: {
        id: (doc) => String(doc._id),
	},
};
