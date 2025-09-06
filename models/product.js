import mongoose from "mongoose";

// Contact-schema (embedded in Manufacturer field in Product)
const contactSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [
        /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email address",
        ],
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: [
        /^[\d\s()+-]{7,20}$/,
        "Invalid phone number",
        ],
    },
},
{ _id: false } // We don't want to create separate _id for embedded schema
);

// Manufacturer-schema (embedded in Product)
const manufacturerSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 255,
    },
    country: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    website: {
        type: String,
        required: false,
        trim: true,
        match: [
        /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/([\w/_-]+))*\/?$/,
        "Ogiltig URL",
        ],
    },
    description: {
        type: String,
        required: false,
        trim: true,
        maxlength: 1000,
    },
    address: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
    },
    contact: {
        type: contactSchema,
        required: true,
    },
},
{ _id: false }  // We don't want to create separate _id for embedded schema
);

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
        type: manufacturerSchema,
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
);

export const Product = mongoose.model("Product", productSchema);
