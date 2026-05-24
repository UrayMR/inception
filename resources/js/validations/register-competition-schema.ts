import { z } from 'zod';
import { CompetitionTypeMap } from '@/types';
import type { CompetitionType } from '@/types';
import { TeamMemberSchema } from './team-schema';

const RegistrationMembersSchema = z.array(TeamMemberSchema);

export const RegisterCompetitionBaseSchema = z.object({
    competition_id: z.uuid(),
    team_name: z.string().max(255).optional(),
    phone_number: z.string().min(1).max(20),
});

export const RegisterCompetitionSchema = (competitionType?: CompetitionType) =>
    RegisterCompetitionBaseSchema.extend({
        members:
            competitionType === CompetitionTypeMap.Team.value
                ? RegistrationMembersSchema.min(1)
                : RegistrationMembersSchema.optional().default([]),
    }).refine(
        (data) =>
            competitionType !== CompetitionTypeMap.Team.value ||
            !!data.team_name?.trim(),
        {
            path: ['team_name'],
            error: 'Team name is required for team competitions.',
        },
    );

export type RegisterCompetitionSchemaType = z.infer<
    ReturnType<typeof RegisterCompetitionSchema>
>;
