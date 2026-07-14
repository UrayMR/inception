import { z } from 'zod';
import { AssignmentStatusValue } from '@/types';

export const AssignmentBaseSchema = z.object({
    competition_id: z.string(),
    name: z.string().min(3).max(255),
    assignment_guide_link: z.url(),
    due_at: z.coerce.date(),
    status: z.enum(AssignmentStatusValue),
});

export const CreateAssignmentSchema = AssignmentBaseSchema.partial();
export const UpdateAssignmentSchema = AssignmentBaseSchema.partial();

export type CreateAssignmentSchemaType = z.infer<typeof CreateAssignmentSchema>;
export type UpdateAssignmentSchemaType = z.infer<typeof UpdateAssignmentSchema>;
