import express from "express";
import mongoose from "mongoose";
import { createProduct, findProducts, findProduct, updateProduct, patchProduct, deleteProduct } from "../controllers/productCrud.js";

const router = express.Router();

// POST /products
router.post("/products", async (request, response) => {
	console.log(request.body);
	const createdProduct = await createProduct(request.body);
	response.status(201).json(createdProduct);
});

// GET /products
router.get("/products", async (req, res) => {
    try {
        const products = await findProducts();
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /products/:id
router.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }
        const product = await findProduct(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// PUT /products/:id
router.put("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }
        const updatedProduct = await updateProduct(id, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// PATCH /products/:id
router.patch("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }
        const updatedProduct = await patchProduct(id, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(updatedProduct);
    } catch (error) {
        console.error("Error patching product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// DELETE /products/:id
router.delete("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }
        const deletedProduct = await deleteProduct(id);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({ message: "Product deleted", product: deletedProduct });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
