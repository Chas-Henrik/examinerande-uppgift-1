import mongoose from "mongoose";

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
        "Invalid URL",
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      required: true,
    },
  },
  {
    timestamps: true, collection: "manufacturers"
  },
);

export const Manufacturer = mongoose.model("Manufacturer", manufacturerSchema, "manufacturers");