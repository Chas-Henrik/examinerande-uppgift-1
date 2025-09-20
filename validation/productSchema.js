import { z } from "zod";

// Contact schema
const contactValidationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .trim(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, "Invalid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s()+-]{7,20}$/, "Invalid phone number"),
});

// Manufacturer schema
const manufacturerValidationSchema = z.object({
  name: z
    .string()
    .min(2, "Manufacturer name must be at least 2 characters")
    .max(255, "Manufacturer name must be at most 255 characters")
    .trim(),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country must be at most 100 characters")
    .trim(),
  website: z
    .string()
    .trim()
    .regex(/^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/([\w/_-]+))*\/?$/, "Invalid URL")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  address: z.string().max(500, "Address must be at most 500 characters").trim(),
  contact: contactValidationSchema,
});

// Product schema
export const productValidationSchema = z.object({
  name: z
    .string()
    .min(1, "Name must be at least 1 character")
    .max(255, "Name must be at most 255 characters")
    .trim(),
  sku: z
    .string()
    .min(1, "SKU must be at least 1 character")
    .max(100, "SKU must be at most 100 characters")
    .trim(),
  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  price: z.number().min(0, "The price cannot be negative"),
  category: z
    .string()
    .max(100, "Category must be at most 100 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  manufacturer: manufacturerValidationSchema,
  amountInStock: z.number().min(0, "The stock cannot be negative"),
});

export const patchProductValidationSchema = productValidationSchema.partial();
