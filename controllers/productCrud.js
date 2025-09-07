import ProductModel from "../models/product.js"

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
	return ProductModel.findByIdAndUpdate(id, productData, {
		new: true,
		runValidators: false,
        upsert: false  // Do not create a new document if it doesn't exist
	});
};

export const deleteProduct = async (id) => {
    return ProductModel.findByIdAndDelete(id);
};