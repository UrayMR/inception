import { z } from 'zod';

export const AnnouncementSchema = z.object({
    message: z
        .string()
        .min(1, 'Pesan pengumuman wajib diisi.')
        .max(255, 'Pesan pengumuman tidak boleh lebih dari 255 karakter.'),
    status: z.enum(['active', 'inactive']),
});

export type AnnouncementSchemaType = z.infer<typeof AnnouncementSchema>;
