import { z } from 'zod';

export const TeamMemberSchema = z.object({
    member_name: z.string().min(1).max(255),
});

export const TeamBaseSchema = z.object({
    competition_id: z.uuid(),
    team_name: z.string().min(1).max(255),
    phone_number: z.string().min(1).max(20),
});

export const CreateTeamSchema = TeamBaseSchema.extend({
    members: z.array(TeamMemberSchema).min(1),
});

export const UpdateTeamSchema = TeamBaseSchema.extend({
    members: z.array(TeamMemberSchema).min(1),
});

export type CreateTeamSchemaType = z.infer<typeof CreateTeamSchema>;
export type UpdateTeamSchemaType = z.infer<typeof UpdateTeamSchema>;
