import { z } from 'zod';
import { UserRoleValue } from '@/types';

export const UserBaseSchema = z.object({
    name: z.string().min(3).max(255),
    email: z.email(),
    role: z.enum(UserRoleValue),
});

export const CreateUserSchema = UserBaseSchema.extend({
    password: z.string().min(8).max(255),
    password_confirmation: z.string().min(8).max(255),
}).refine((data) => data.password === data.password_confirmation, {
    message: 'Password does not match',
    path: ['password_confirmation'],
});

export const UpdateUserSchema = UserBaseSchema.extend({
    password: z.string().min(8).max(255).nullish(),
    password_confirmation: z.string().min(8).max(255).nullish(),
}).refine((data) => data.password === data.password_confirmation, {
    message: 'Password does not match',
    path: ['password_confirmation'],
});

export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>;
export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;
