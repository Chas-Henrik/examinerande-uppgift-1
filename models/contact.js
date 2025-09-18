import mongoose from "mongoose"

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
      match: [/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, "Invalid email address"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[\d\s()+-]{7,20}$/, "Invalid phone number"],
    },
  },
  {
    timestamps: true, collection: "contacts"
  },
)

export const Contact = mongoose.model("Contact", contactSchema, "contacts")