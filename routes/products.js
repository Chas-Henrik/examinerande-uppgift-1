import express from "express";
import mongoose from "mongoose";
import { createProduct, findProducts, findProduct, updateProduct, patchProduct, deleteProduct } from "../controllers/productCrud.js";

const router = express.Router();

// POST /products
router.post("/", async (request, response) => {
	console.log(request.body);
	const createdProduct = await createProduct(request.body);
	response.status(201).json(createdProduct);
});

// GET /products
router.get("/", async (req, res) => {
    const products = await findProducts();
    res.json(products);
});

// GET /products/:id
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
    }
    const product = await findProduct(id);
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
});

// PUT /products/:id
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
    }
    const updatedProduct = await updateProduct(id, req.body);
    if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
    }
    res.json(updatedProduct);
});

// PATCH /products/:id
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
    }
    const updatedProduct = await patchProduct(id, req.body);
    if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
    }
    res.json(updatedProduct);
});

// DELETE /products/:id
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
    }
    const deletedProduct = await deleteProduct(id);
    if (!deletedProduct) {
        return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted", product: deletedProduct });
});

export default router;
