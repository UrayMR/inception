import { z } from 'zod';

export const UserBaseSchema = {
    name: z.string().min(3, 'Nama minimal 3 karakter'),
    email: z.email('Email tidak valid'),
    role: z.enum(['admin', 'accountant', 'participant'], 'Role tidak valid'),
    google_id: z.uuid().nullable().optional(),
};

export const CreateUserSchema = z
    .object({
        ...UserBaseSchema,
        password: z.string().min(8, 'Password minimal 8 karakter'),
        password_confirmation: z
            .string()
            .min(1, 'Konfirmasi password harus diisi'),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: 'Konfirmasi password tidak cocok',
        path: ['password_confirmation'],
    });

export const UpdateUserSchema = z
    .object({
        ...UserBaseSchema,
        password: z
            .string()
            .min(8, 'Password minimal 8 karakter')
            .optional()
            .or(z.literal('')),
        password_confirmation: z.string().optional().or(z.literal('')),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: 'Konfirmasi password tidak cocok',
        path: ['password_confirmation'],
    });

export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>;
export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;
