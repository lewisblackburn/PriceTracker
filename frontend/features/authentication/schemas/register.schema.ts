import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
  confirmPassword: z.string().nonempty("Confirm password is required"),
});
