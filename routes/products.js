import express from "express";
import mongoose from "mongoose";
import {
  createProduct,
  //   findProducts,
  findProductsWithFilterAndPagination,
  findProductById,
  updateProduct,
  patchProduct,
  deleteProduct,
  getTotalStockValue,
  getTotalStockValueByManufacturer,
  getLowStockProducts,
  getCriticalStockProducts,
  getManufacturers,
  getManufacturerById,
} from "../controllers/productCrud.js"
import { ZodProductSchema } from "../validation/productSchema.js"

const router = express.Router()

// *** Additional endpoints ***

// GET /api/products/total-stock-value
router.get("/products/total-stock-value", async (req, res) => {
  try {
    const totalStockValue = await getTotalStockValue()
    res.json({ totalStockValue })
  } catch (error) {
    console.error("Error fetching total stock value:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// GET /api/products/total-stock-value-by-manufacturer
router.get("/products/total-stock-value-by-manufacturer", async (req, res) => {
  try {
    const totalStockValueByManufacturer =
      await getTotalStockValueByManufacturer()
    res.json(totalStockValueByManufacturer)
  } catch (error) {
    console.error("Error fetching total stock value per manufacturer:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// GET /api/products/low-stock
router.get("/products/low-stock", async (req, res) => {
  try {
    const lowStockProducts = await getLowStockProducts() // Default threshold is 10
    res.json(lowStockProducts)
  } catch (error) {
    console.error("Error fetching low stock products:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// GET /api/products/critical-stock
router.get("/products/critical-stock", async (req, res) => {
  try {
    const criticalStockProducts = await getCriticalStockProducts(5) // Default threshold is 5
    res.json(criticalStockProducts)
  } catch (error) {
    console.error("Error fetching critical stock products:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// GET /api/manufacturers
router.get("/manufacturers", async (req, res) => {
  try {
    const manufacturers = await getManufacturers()
    res.json(manufacturers)
  } catch (error) {
    console.error("Error fetching manufacturers:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// GET /api/manufacturers/:id
router.get("/manufacturers/:id", async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid manufacturer ID" })
    }
    const manufacturer = await getManufacturerById(id)
    if (!manufacturer) {
      return res.status(404).json({ error: "Manufacturer not found" })
    }
    res.json(manufacturer)
  } catch (error) {
    console.error("Error fetching manufacturer:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// *** CRUD endpoints ***

// POST /products
router.post("/products", async (request, response) => {
  try {
    // const createdProduct = await createProduct(request.body);
    const safeResult = ZodProductSchema.safeParse(request.body)
    if (!safeResult.success) {
      return response.status(400).json({
        message: "Validation error",
        errors: safeResult.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      })
    }
    response.status(201).json(safeResult)
  } catch (error) {
    console.error("Error creating product:", error)
    response.status(500).json({ error: "Internal server error" })
  }
})

// GET /products
router.get("/products", async (req, res) => {
  try {
    const {
      category,
      manufacturer,
      amountInStock,
      limit = 10,
      page = 1,
    } = req.query

    if (isNaN(limit) || isNaN(page) || limit <= 0 || page <= 0) {
      return res.status(400).json({ error: "Invalid limit or page number" })
    }

    // const products = await findProducts()
    const filteredAndPaginatedProducts =
      await findProductsWithFilterAndPagination(
        category,
        manufacturer,
        parseInt(amountInStock),
        parseInt(limit),
        parseInt(page)
      )
    console.log(filteredAndPaginatedProducts)
    // res.json(products)
    res.json(filteredAndPaginatedProducts)
  } catch (error) {
    console.error("Error fetching products:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// GET /products/:id
router.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" })
    }
    const product = await findProductById(id)
    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }
    res.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// PUT /products/:id
router.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { manufacturer } = req.body
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" })
    }
    if (manufacturer && !mongoose.Types.ObjectId.isValid(manufacturer)) {
      return res.status(400).json({ error: "Invalid manufacturer ID" })
    }
    const existingManufacturer = await getManufacturerById(manufacturer)
    if (!existingManufacturer) {
      return res.status(404).json({ error: "Manufacturer not found" })
    }

    const updatedProduct = await updateProduct(id, req.body)
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" })
    }
    res.json(updatedProduct)
  } catch (error) {
    console.error("Error updating product:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// PATCH /products/:id
router.patch("/products/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { manufacturer } = req.body
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" })
    }
    if (manufacturer && !mongoose.Types.ObjectId.isValid(manufacturer)) {
      return res.status(400).json({ error: "Invalid manufacturer ID" })
    }
    const existingManufacturer = await getManufacturerById(manufacturer)
    if (!existingManufacturer) {
      return res.status(404).json({ error: "Manufacturer not found" })
    }

    const updatedProduct = await patchProduct(id, req.body)
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" })
    }
    res.json(updatedProduct)
  } catch (error) {
    console.error("Error patching product:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

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
