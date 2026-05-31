import { z } from 'zod';
import { CompetitionStatusValue, CompetitionTypeValue } from '@/types';

export const CompetitionTimelineSchema = z
    .object({
        timeline_name: z.string().min(1).max(255),
        description: z.string().nullish(),
        sequence: z.int().min(1),
        start_at: z.coerce.date(),
        end_at: z.coerce.date(),
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
        .mime(['image/jpeg', 'image/png', 'image/webp'])
        .nullish(),
    price: z.number().min(0),
    max_member: z.number().int().min(1),
    status: z.enum(CompetitionStatusValue),
});

export const CreateCompetitionSchema = CompetitionBaseSchema.extend({
    timelines: z.array(CompetitionTimelineSchema).min(1),
}).superRefine((data, ctx) => {
    if (data.type === 'solo' && data.max_member !== 1) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Solo competition must have max_member = 1',
            path: ['max_member'],
        });
    }

    if (data.type === 'team' && data.max_member < 2) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Team competition must have max_member of at least 2',
            path: ['max_member'],
        });
    }
});

export const UpdateCompetitionSchema = CompetitionBaseSchema.extend({
    timelines: z.array(CompetitionTimelineSchema).min(1),
}).superRefine((data, ctx) => {
    if (data.type === 'solo' && data.max_member !== 1) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Solo competition must have max_member = 1',
            path: ['max_member'],
        });
    }

    if (data.type === 'team' && data.max_member < 2) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Team competition must have max_member of at least 2',
            path: ['max_member'],
        });
    }
});

export type CreateCompetitionSchemaType = z.infer<
    typeof CreateCompetitionSchema
>;
export type UpdateCompetitionSchemaType = z.infer<
    typeof UpdateCompetitionSchema
>;
