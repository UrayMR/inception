import { z } from 'zod';

export const RegistrationBatchFormSchema = z.object({
    name: z
        .string()
        .min(1, 'Nama batch wajib diisi.')
        .max(255, 'Nama batch tidak boleh lebih dari 255 karakter.'),
    status: z.enum(['active', 'inactive']),
});

export type RegistrationBatchSchemaType = z.infer<
    typeof RegistrationBatchFormSchema
>;
