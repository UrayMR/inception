import { z } from 'zod';
import { UserRoleMap, UserRoleValue } from '@/types';

const CompetitionIdSchema = z
    .string()
    .trim()
    .refine(
        (value) => value === '' || z.string().uuid().safeParse(value).success,
        {
            message: 'ID Kompetisi tidak valid.',
        },
    )
    .optional()
    .nullable();

const withCompetitionRequirement = <TSchema extends z.ZodTypeAny>(
    schema: TSchema,
) =>
    schema.superRefine((data, ctx) => {
        const rawRole =
            typeof data === 'object' && data !== null && 'role' in data
                ? data.role
                : undefined;

        if (rawRole !== UserRoleMap.Committee.value) {
            return;
        }

        const competitionId =
            typeof data === 'object' &&
            data !== null &&
            'competition_id' in data
                ? data.competition_id
                : undefined;

        if (!competitionId || competitionId === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['competition_id'],
                message: 'Kompetisi wajib dipilih jika role adalah Committee.',
            });
        }
    });

export const UserBaseSchema = z.object({
    name: z.string().min(3).max(255),
    email: z.email(),
    role: z.enum(UserRoleValue),
    competition_id: CompetitionIdSchema,
});

export const CreateUserSchema = withCompetitionRequirement(
    UserBaseSchema.extend({
        password: z.string().min(8).max(255),
        password_confirmation: z.string().min(8).max(255),
    }).refine((data) => data.password === data.password_confirmation, {
        message: 'Password does not match',
        path: ['password_confirmation'],
    }),
);

export const UpdateUserSchema = withCompetitionRequirement(
    UserBaseSchema.extend({
        password: z.string().min(8).max(255).optional(),
        password_confirmation: z.string().min(8).max(255).optional(),
    }).refine((data) => data.password === data.password_confirmation, {
        message: 'Password does not match',
        path: ['password_confirmation'],
    }),
);

export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>;
export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;
