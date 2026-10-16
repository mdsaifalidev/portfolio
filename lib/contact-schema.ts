import { z } from "zod";

// Kept outside app/actions/contact.ts: a "use server" module may only export async functions.
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100, "That name is a bit long."),
  email: z.string().trim().max(200, "That email is too long.").pipe(z.email("Please enter a valid email address.")),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least a sentence (10+ characters).")
    .max(2000, "Please keep it under 2,000 characters."),
});

export type ContactField = keyof z.infer<typeof contactSchema>;
