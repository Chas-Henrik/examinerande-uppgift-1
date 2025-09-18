import { z } from "zod";

export const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be at most 100 characters").trim().optional(),
    email: z.string().email("Invalid email format").trim().toLowerCase().optional(),
    phone: z.string().min(1, "Phone number is required").regex(/^[\d\s()+-]{7,20}$/, "Invalid phone number").optional(),
});


