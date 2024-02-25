import { z } from "zod"

export const userSchema = z.object({
    name: z.string()
    .nonempty("Username is required")
    .min(2, { message: 'invalid name length' } ),
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string().min(6, { message: 'Invalid password length' }),
    cpf: z.string(),
    phone: z.string().refine(value => /^(\(?\d{2}\)?\s)?(\d{4,5}-?\d{4})$/.test(value)),
    rg: z.string().regex(/^\d{1,2}\.\d{3}\.\d{3}-\d$/)
  })
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})