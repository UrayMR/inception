import { z } from 'zod';
import { CompetitionTypeMap, TeamStatusValue } from '@/types';
import type { CompetitionType } from '@/types';

export const TeamMemberSchema = z.object({
    member_name: z
        .string()
        .min(1, { message: 'Nama anggota wajib diisi.' })
        .max(255, { message: 'Nama anggota maksimal 255 karakter.' }),
});

export const TeamBaseSchema = z.object({
    competition_id: z.uuid(),
    team_name: z.string().min(1).max(255),
    institution: z.string().max(255).optional(),
    phone_number: z.string().min(1).max(20),
    requirement_link: z.url(),
    status: z.enum(TeamStatusValue),
});

const TeamMembersSchema = z.array(TeamMemberSchema);

const getTeamMembersSchema = (
    competitionType?: CompetitionType,
    maxMember?: number,
) => {
    if (competitionType === CompetitionTypeMap.Solo.value) {
        return TeamMembersSchema.optional().default([]);
    }

    let schema = TeamMembersSchema.min(1);

    if (typeof maxMember === 'number' && maxMember >= 2) {
        schema = schema.max(maxMember - 1, {
            message: `Team members cannot exceed ${maxMember - 1} (leader is counted separately).`,
        });
    }

    return schema;
};

export const CreateTeamSchema = (
    competitionType?: CompetitionType,
    maxMember?: number,
) =>
    TeamBaseSchema.extend({
        members: getTeamMembersSchema(competitionType, maxMember),
    });

export const UpdateTeamSchema = (
    competitionType?: CompetitionType,
    maxMember?: number,
) =>
    TeamBaseSchema.extend({
        members: getTeamMembersSchema(competitionType, maxMember),
    });

export type CreateTeamSchemaType = z.infer<ReturnType<typeof CreateTeamSchema>>;
export type UpdateTeamSchemaType = z.infer<ReturnType<typeof UpdateTeamSchema>>;
