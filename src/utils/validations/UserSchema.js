import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(9, "Password must be at least 9 characters."),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Full name is required."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(9, "Password must be at least 9 characters."),
  password_confirmation: z.string().min(9, "The password must match."),
});
