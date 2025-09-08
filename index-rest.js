import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import router from "./routes/products.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api", router);

// Root route
app.get('/', (_req, res) => {
	res.json({ 
		message: 'Products API', 
		endpoints: {
			'GET /api/products': 'Get all products',
			'GET /api/products/:id': 'Get product by ID',
			'POST /api/products': 'Create new product',
			'PUT /api/products/:id': 'Update product',
			'PATCH /api/products/:id': 'Patch product',
			'DELETE /api/products/:id': 'Delete product',
			'GET /api/products/total-stock-value': 'Get total stock value of all products',
			'GET /api/products/total-stock-value-by-manufacturer': 'Get total stock value grouped by manufacturer',
			'GET /api/products/low-stock': 'Get products with low stock (less than 10)',
			'GET /api/products/critical-stock': 'Get products with critical stock (less than 5)',
			'GET /api/manufacturers': 'Get list of unique manufacturers'
		}
	});
});

const PORT = process.env.PORT || 3000;

connectDB()
	.then(() =>
		app.listen(PORT, () => console.log(`REST is running on http://localhost:${PORT}`))
	)
	.catch(console.error);
