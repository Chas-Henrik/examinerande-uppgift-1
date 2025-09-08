import { Product } from "../models/product.js"

// *** Additional operations ***

export const getTotalStockValue = async () => {
	const [totals] = await Product.aggregate([
		{
			$group: {
				_id: null,
				totalStockValue: { $sum: { $multiply: ["$price", "$amountInStock"] } }
			}
		}
	]);
	return totals.totalStockValue.toFixed(2);
};

export const getTotalStockValueByManufacturer = async () => {
	const totals = await Product.aggregate([
		{
			$group: {
				_id: "$manufacturer.name",
				totalStockValue: { $sum: { $multiply: ["$price", "$amountInStock"] } }
			}
		}
	]);
	totals.forEach(item => item.totalStockValue = parseFloat(item.totalStockValue.toFixed(2)));
	return totals;
};

export const getLowStockProducts = async (threshold = 10) => {
	return Product.find({ amountInStock: { $lt: threshold } });
};

export const getCriticalStockProducts = async (threshold = 5) => {
	return Product.find({ amountInStock: { $lt: threshold } }).select("name sku amountInStock manufacturer.name manufacturer.contact.name manufacturer.contact.phone manufacturer.contact.email");
};

export const getManufacturers = async () => {
	return Product.distinct("manufacturer.name");
};

// *** CRUD operations ***

export const createProduct = async (productData) => {
	return Product.create(productData);
};

export const findProducts = async () => {
	return Product.find();
};

export const findProductsWithFilterAndPagination = async (filter, limit, offset) => {
	return Product.find(filter).limit(limit).skip(offset);
};

export const findProduct = async (id) => {
	return Product.findById(id);
};

export const updateProduct = async (id, productData) => {
	return Product.replaceOne({ _id: id }, productData, {
		new: true,
		runValidators: true,
		upsert: false  // Do not create a new document if it doesn't exist
	});
};

export const patchProduct = async (id, productData) => {
	return Product.findByIdAndUpdate(id, { $set: productData }, {
		new: true,
		runValidators: false,
        upsert: false  // Do not create a new document if it doesn't exist
	});
};

export const deleteProduct = async (id) => {
    return Product.findByIdAndDelete(id);
};