import { z } from 'zod';
import { CompetitionTypeMap, TransactionPaymentMethodValue } from '@/types';
import type { CompetitionType } from '@/types';
import { TeamMemberSchema } from './team-schema';

const RegistrationMembersSchema = z.array(TeamMemberSchema);

export const RegisterCompetitionBaseSchema = z.object({
    competition_id: z.uuid(),
    team_name: z.string().max(255).optional(),
    phone_number: z.string().min(1).max(20),
    payment_method: z.enum(TransactionPaymentMethodValue),
    payment_proof_file: z
        .file()
        .mime(['image/png', 'image/jpeg', 'image/webp']),
});

export const RegisterCompetitionSchema = (competitionType?: CompetitionType) =>
    RegisterCompetitionBaseSchema.extend({
        members:
            competitionType === CompetitionTypeMap.Team.value
                ? RegistrationMembersSchema.min(1)
                : RegistrationMembersSchema.optional().default([]),
    })
        .refine(
            (data) =>
                competitionType !== CompetitionTypeMap.Team.value ||
                !!data.team_name?.trim(),
            {
                path: ['team_name'],
                error: 'Team name is required for team competitions.',
            },
        )
        .refine((data) => !!data.payment_proof_file, {
            path: ['payment_proof_file'],
            error: 'Payment proof is required.',
        });

export type RegisterCompetitionSchemaType = z.infer<
    ReturnType<typeof RegisterCompetitionSchema>
>;

export type RegisterCompetitionFormDataType = {
    competition_id: string;
    team_name?: string;
    institution?: string;
    phone_number: string;
    payment_method: (typeof TransactionPaymentMethodValue)[number];
    payment_proof_file?: File;
    members: z.infer<typeof TeamMemberSchema>[];
};
