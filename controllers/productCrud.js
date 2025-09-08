import ProductModel from "../models/product.js"

// *** Additional operations ***

export const getTotalStockValue = async () => {
	const [totals] = await ProductModel.aggregate([
		{
			$group: {
				_id: null,
				totalStockValue: { $sum: { $multiply: ["$price", "$amountInStock"] } }
			}
		}
	]);
	return totals.totalStockValue;
};

export const getTotalStockValuePerManufacturer = async () => {
	const totals = await ProductModel.aggregate([
		{
			$group: {
				_id: "$manufacturer.name",
				totalStockValue: { $sum: { $multiply: ["$price", "$amountInStock"] } }
			}
		}
	]);
	return totals;
};

export const getLowStockProducts = async (threshold = 10) => {
	return ProductModel.find({ amountInStock: { $lt: threshold } });
};

export const getCriticalStockProducts = async (threshold = 5) => {
	return ProductModel.find({ amountInStock: { $lt: threshold } }).select("name sku amountInStock manufacturer.name manufacturer.contact.name manufacturer.contact.phone manufacturer.contact.email");
};

export const getManufacturers = async () => {
	return ProductModel.distinct("manufacturer.name");
};

// *** CRUD operations ***

export const createProduct = async (productData) => {
	return ProductModel.create(productData);
};

export const findProducts = async () => {
	return ProductModel.find();
};

export const findProduct = async (id) => {
	return ProductModel.findById(id);
};

export const updateProduct = async (id, productData) => {
	return ProductModel.replaceOne({ _id: id }, productData, {
		new: true,
		runValidators: true,
		upsert: false  // Do not create a new document if it doesn't exist
	});
};

export const patchProduct = async (id, productData) => {
	return ProductModel.findByIdAndUpdate(id, { $set: productData }, {
		new: true,
		runValidators: false,
        upsert: false  // Do not create a new document if it doesn't exist
	});
};

export const deleteProduct = async (id) => {
    return ProductModel.findByIdAndDelete(id);
};