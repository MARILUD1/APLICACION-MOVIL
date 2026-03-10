import { z } from 'zod';

// ✅ Esquema para Registro de Usuarios
export const registroSchema = z.object({
  nombre: z.string()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    .max(50, { message: 'El nombre no puede exceder 50 caracteres' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'Solo se permiten letras y espacios' }),
  
  correo: z.string()
    .email({ message: 'Formato de correo no válido' }),
  
  direccion: z.string()
    .min(5, { message: 'La dirección debe tener al menos 5 caracteres' })
    .max(200, { message: 'La dirección es demasiado larga' }),
  
  rol: z.enum(['ciudadano', 'lider', 'voluntario'], {
    message: 'Debe seleccionar un rol válido'
  }),
  
  password: z.string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    .regex(/[A-Z]/, { message: 'Debe incluir al menos una mayúscula' })
    .regex(/[0-9]/, { message: 'Debe incluir al menos un número' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Debe incluir al menos un carácter especial' }),
  
  confirmarPassword: z.string()
}).refine((data) => data.password === data.confirmarPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmarPassword']
});

// ✅ Esquema para Login
export const loginSchema = z.object({
  correo: z.string().email({ message: 'Formato de correo no válido' }),
  password: z.string().min(1, { message: 'La contraseña es obligatoria' })
});

// 🔹 Tipos derivados para TypeScript
export type RegistroFormData = z.infer<typeof registroSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;