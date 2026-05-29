import { z } from 'zod';
import { CompetitionTypeMap, TeamStatusValue } from '@/types';
import type { CompetitionType } from '@/types';

export const TeamMemberSchema = z.object({
    member_name: z.string().min(1).max(255),
});

export const TeamBaseSchema = z.object({
    competition_id: z.uuid(),
    team_name: z.string().min(1).max(255),
    institution: z.string().max(255).optional(),
    phone_number: z.string().min(1).max(20),
    status: z.enum(TeamStatusValue),
});

const TeamMembersSchema = z.array(TeamMemberSchema);

export const CreateTeamSchema = (competitionType?: CompetitionType) =>
    TeamBaseSchema.extend({
        members:
            competitionType === CompetitionTypeMap.Solo.value
                ? TeamMembersSchema.optional().default([])
                : TeamMembersSchema.min(1),
    });

export const UpdateTeamSchema = (competitionType?: CompetitionType) =>
    TeamBaseSchema.extend({
        members:
            competitionType === CompetitionTypeMap.Solo.value
                ? TeamMembersSchema.optional().default([])
                : TeamMembersSchema.min(1),
    });

export type CreateTeamSchemaType = z.infer<ReturnType<typeof CreateTeamSchema>>;
export type UpdateTeamSchemaType = z.infer<ReturnType<typeof UpdateTeamSchema>>;
