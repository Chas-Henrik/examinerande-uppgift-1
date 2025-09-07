import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import router from "./routes/products.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT || 3000;

connectDB()
	.then(() =>
		app.listen(PORT, () => console.log(`REST is running on http://localhost:${PORT}`))
	)
	.catch(console.error);
