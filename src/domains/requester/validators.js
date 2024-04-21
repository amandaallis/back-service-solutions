import { z } from "zod"

export const userSchema = z.object({
    name: z.string()
    .min(2, { message: 'invalid name length' } ),
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string().min(6, { message: 'Invalid password length' }),
    phone: z.string().refine(value => /^(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/.test(value)),
});

export const loginSchema = z.object({
  phone: z.string().refine(value => /^(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/.test(value)),
  password: z.string()
});

export const userUpdateSchema = z.object({
  name: z.string()
  .nonempty("Username is required")
  .min(2, { message: 'invalid name length' } ),
  password: z.string().min(6, { message: 'Invalid password length' }),
  phone: z.string().refine(value => /^(\(?\d{2}\)?\s)?(\d{4,5}-?\d{4})$/.test(value)),
});