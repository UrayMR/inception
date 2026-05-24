import { z } from 'zod';
import { CompetitionTypeMap } from '@/types';
import type { CompetitionType } from '@/types';
import { TeamMemberSchema } from './team-schema';

const RegistrationMembersSchema = z.array(TeamMemberSchema);

export const RegisterCompetitionBaseSchema = z.object({
    competition_id: z.uuid(),
    team_name: z.string().min(1).max(255),
    phone_number: z.string().min(1).max(20),
    institution: z.string().min(1).max(255),
});

export const RegisterCompetitionSchema = (competitionType?: CompetitionType) =>
    RegisterCompetitionBaseSchema.extend({
        members:
            competitionType === CompetitionTypeMap.Team.value
                ? RegistrationMembersSchema.min(1)
                : RegistrationMembersSchema.optional().default([]),
    });

export type RegisterCompetitionSchemaType = z.infer<
    ReturnType<typeof RegisterCompetitionSchema>
>;
