import mongoose from "mongoose"

// Product-schema (main document)
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 255,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 1,
      maxlength: 100,
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: 1000,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "The price cannot be negative"],
    },
    category: {
      type: String,
      required: false,
      trim: true,
      maxlength: 100,
    },
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manufacturer",
      required: true,
    },
    amountInStock: {
      type: Number,
      required: true,
      min: [0, "The stock cannot be negative"],
    },
  },
  {
    timestamps: true,
    collection: "products",
  }
)

export const Product = mongoose.model("Product", productSchema, "products")
