import { z } from 'zod';
import { CompetitionStatusValue, CompetitionTypeValue } from '@/types';

export const CompetitionTimelineSchema = z
    .object({
        timeline_name: z.string().max(255),
        description: z.string().nullish(),
        sequence: z.int().min(1),
        start_at: z.date(),
        end_at: z.date(),
    })
    .refine((data) => data.start_at < data.end_at, {
        message: 'start_at must be before end_at',
        path: ['end_at'],
    });

export const CompetitionBaseSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().nullish(),
    type: z.enum(CompetitionTypeValue),
    image_file: z
        .file()
        .mime(['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'])
        .nullish(),
    price: z.number().min(0),
    status: z.enum(CompetitionStatusValue),
});

export const CreateCompetitionSchema = CompetitionBaseSchema.extend({
    timelines: z.array(CompetitionTimelineSchema).min(1),
});

export const UpdateCompetitionSchema = CompetitionBaseSchema.extend({
    timelines: z.array(CompetitionTimelineSchema).min(1),
});

export type CreateCompetitionSchemaType = z.infer<
    typeof CreateCompetitionSchema
>;
export type UpdateCompetitionSchemaType = z.infer<
    typeof UpdateCompetitionSchema
>;
