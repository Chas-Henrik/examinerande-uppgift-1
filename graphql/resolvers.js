import { Product } from "../models/product.js";

export const resolvers = {
	Query: {
        products: async () => {
			return await Product.find({});
		},
	},

	Product: {
        id: (doc) => String(doc._id),
	},
};
