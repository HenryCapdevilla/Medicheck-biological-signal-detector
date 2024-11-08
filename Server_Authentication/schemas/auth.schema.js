import { z } from "zod";

// Esquema para registro con validaciones adicionales
export const registerSchema = z.object({
    username: z.string({
        required_error: 'Username is required'
    }).min(3, {
        message: 'Username must be at least 3 characters'
    }).max(20, {
        message: 'Username must not exceed 20 characters'
    }).regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Username can only contain letters, numbers, and underscores'
    }),
    email: z.string({
        required_error: 'Email is required'
    }).email({
        message: 'Invalid email'
    }),
    password: z.string({
        required_error: 'Password is required'
    }).min(6, {
        message: 'Password must be at least 6 characters'
    }).max(50, {
        message: 'Password must not exceed 50 characters'
    }).regex(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
        message: 'Password must contain at least one uppercase letter and one number'
    }),
    nip: z.string({
        required_error: 'Cédula is required',  // Este mensaje solo se mostrará si el campo está vacío.
    }).min(6, {
        message: 'Cédula must be at least 6 digits'
    }).max(10, {
        message: 'Cédula must not exceed 10 digits'
    }).refine(value => /^[0-9]+$/.test(value), {
        message: 'Cédula can only contain numbers'  // Solo permite números
    }).refine(value => !/[^\d]/.test(value), {
        message: 'Cédula must not contain special characters or letters'  // No permite caracteres especiales ni letras
    })
});

// Esquema para login con validaciones adicionales
export const loginSchema = z.object({
    email: z.string({
        required_error: 'Email is required'
    }).email({
        message: 'Invalid email'
    }),
    password: z.string({
        required_error: 'Password is required'
    }).min(6, {
        message: 'Password must be at least 6 characters'
    }).max(50, {
        message: 'Password must not exceed 50 characters'
    })
});
