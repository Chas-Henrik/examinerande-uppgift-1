
import {z} from "zod";

export const manufactureSchema = z.object({
 name: z.string().min(2, "Name must be at least 2 characters").max(255, "Name must be at most 255 characters").trim().optional(),
 country: z.string().min(2, "Country must be at least 2 characters").max(100, "Country must be at most 100 characters").trim().optional(),
 website: z.string().url("Invalid URL").trim().optional().or(z.literal("").regex(/^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/([\w/_-]+))*\/?$/, "Invalid URL")).optional(),
 description: z.string().max(1000, "Description must be at most 1000 characters").trim().optional().or(z.literal("")).optional(),
 address: z.string().max(500, "Address must be at most 500 characters").trim().optional(),
 contact: z.string().optional()
});