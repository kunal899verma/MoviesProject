import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const movieSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title is too long')
    .trim(),
  publishingYear: z
    .number()
    .int('Publishing year must be a whole number')
    .min(1888, 'Publishing year cannot be before 1888')
    .max(new Date().getFullYear() + 10, 'Publishing year cannot be too far in the future'),
  poster: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
});

export const movieFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title is too long')
    .trim(),
  publishingYear: z
    .string()
    .min(1, 'Publishing year is required')
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), 'Publishing year must be a number')
    .refine((val) => val >= 1888, 'Publishing year cannot be before 1888')
    .refine(
      (val) => val <= new Date().getFullYear() + 10,
      'Publishing year cannot be too far in the future'
    ),
  poster: z
    .string()
    .optional()
    .or(z.literal('')),
});


export const searchSchema = z.object({
  search: z.string().optional(),
  year: z
    .string()
    .optional()
    .transform((val) => val ? parseInt(val, 10) : undefined)
    .refine((val) => val === undefined || (!isNaN(val) && val >= 1888), 'Invalid year'),
  page: z
    .number()
    .int()
    .min(1)
    .default(1),
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(8),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type MovieFormData = z.infer<typeof movieFormSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
