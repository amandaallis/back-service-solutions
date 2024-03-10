import { z } from "zod"
import validateCNPJ from "../../helpers/validateCNPJ.js";
import validateCPF from "../../helpers/validateCPF.js";


export const userSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, { message: 'Invalid password length' }),
  phone: z.string().refine(value => /^(\(?\d{2}\)?\s)?(\d{4,5}-?\d{4})$/.test(value)),
});

export const providerLegalSchema = z.object({
  cnpj: z.string().nonempty("cnpj is required").refine(validateCNPJ, { message: 'Invalid CNPJ' }),
  companyName: z.string().min(2, { message: 'invalid name length' } )
});

export const providerPersonal = z.object({
  name: z.string(),
  cpf: z.string().refine(validateCPF, { message: 'Invalid CPF' })
});

export const loginSchema = z.object({
  phone: z.string().refine(value => /^(\(?\d{2}\)?\s)?(\d{4,5}-?\d{4})$/.test(value)),
  password: z.string()
});

export const userUpdateSchema = z.object({
  name: z.string().min(2, { message: 'invalid name length' }).optional(),
  companyName: z.string().min(2, { message: 'invalid company name length' }).optional(),
  email: z.string().email({ message: 'Invalid email' }).optional(),
  password: z.string().min(6, { message: 'Invalid password length' }).optional(),
});