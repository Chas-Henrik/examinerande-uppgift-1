
import {z} from "zod";

export const manufactureSchema = z.object({
    name: z.string().min(1, "Name must be at least 1 characters").max(255, "Name must be at most 255 characters").trim().optional(),
    sku: z.string().min(1, "SKU must be at least 1 characters").max(100, "SKU must be at most 100 characters").trim().optional(),
    description: z.string().max(1000, "Description must be at most 1000 characters").trim().optional().or(z.literal("")).optional(),
    category: z.string().max(100, "Category must be at most 100 characters").trim().optional().or(z.literal("")),
    manufacturer: manufactureSchema,
    amountInStock: z.number().min(0, "The stock cannot be negative").optional(),
   

});