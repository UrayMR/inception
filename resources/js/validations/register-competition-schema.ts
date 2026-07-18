import { z } from 'zod';
import { CompetitionTypeMap, TransactionPaymentMethodValue } from '@/types';
import type { CompetitionType } from '@/types';
import { TeamMemberSchema } from './team-schema';

// TODO: REFACTOR THIS FILE CUZ WHAT THE HELL IS THIS FILE, IT'S SO MESSY AND DUPLICATED WITH team-schema.ts

// Helper untuk validasi file gambar (Best Practice Zod untuk File)
const ImageFileSchema = z
    .instanceof(File, { message: 'Bukti pembayaran harus berupa file valid.' })
    .refine(
        (file) =>
            ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(
                file.type,
            ),
        { message: 'Format file harus berupa PNG, JPEG, atau WEBP.' },
    )
    .refine(
        (file) => file.size <= 5 * 1024 * 1024, // Contoh limit 5MB
        { message: 'Ukuran file maksimal adalah 5MB.' },
    );

const RegistrationMembersSchema = z.array(TeamMemberSchema);

// Helper untuk membuat skema members agar tidak duplikasi (DRY)
const getMembersSchema = (
    competitionType?: CompetitionType,
    maxMember?: number,
) => {
    if (competitionType === CompetitionTypeMap.Team.value) {
        let schema = RegistrationMembersSchema;

        if (typeof maxMember === 'number' && maxMember >= 2) {
            schema = schema.max(maxMember - 1, {
                message: `Jumlah anggota tidak boleh lebih dari ${maxMember - 1} orang (Ketua tim tidak dihitung).`,
            });
        }

        return schema.optional().default([]);
    }

    return RegistrationMembersSchema.optional().default([]);
};

// 1. BASE SCHEMA
export const RegisterCompetitionBaseSchema = z.object({
    competition_id: z.string().uuid({ message: 'ID Kompetisi tidak valid.' }),
    team_name: z
        .string()
        .max(255, { message: 'Nama tim maksimal 255 karakter.' })
        .optional(),
    institution: z
        .string()
        .max(255, { message: 'Nama instansi maksimal 255 karakter.' })
        .optional(),
    phone_number: z
        .string()
        .min(1, { message: 'Nomor telepon wajib diisi.' })
        .max(20, { message: 'Nomor telepon maksimal 20 karakter.' }),
    requirement_link: z.url({
        message: 'Link persyaratan harus berupa URL valid.',
    }),
    payment_method: z.literal(TransactionPaymentMethodValue[0], {
        message: 'Metode pembayaran yang dipilih tidak valid.',
    }),
    payment_proof_file: ImageFileSchema,
});

export const RegisterCompetitionSchema = (
    competitionType?: CompetitionType,
    maxMember?: number,
) =>
    RegisterCompetitionBaseSchema.extend({
        members: getMembersSchema(competitionType, maxMember),
    }).refine(
        (data) =>
            competitionType !== CompetitionTypeMap.Team.value ||
            !!data.team_name?.trim(),
        {
            path: ['team_name'],
            message: 'Nama tim wajib diisi untuk kompetisi kategori tim.',
        },
    );

// Types
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
    requirement_link: string;
    members: z.infer<typeof TeamMemberSchema>[];
};

export const RegisterCompetitionInfoStepSchema = (
    competitionType?: CompetitionType,
    maxMember?: number,
) =>
    RegisterCompetitionBaseSchema.pick({
        competition_id: true,
        team_name: true,
        institution: true,
        phone_number: true,
    })
        .extend({
            members: getMembersSchema(competitionType, maxMember),
        })
        .refine(
            (data) =>
                competitionType !== CompetitionTypeMap.Team.value ||
                !!data.team_name?.trim(),
            {
                path: ['team_name'],
                message: 'Nama tim wajib diisi untuk kompetisi kategori tim.',
            },
        );

export const RegisterCompetitionRequirementStepSchema =
    RegisterCompetitionBaseSchema.pick({
        requirement_link: true,
    });

export const RegisterCompetitionPaymentStepSchema =
    RegisterCompetitionBaseSchema.pick({
        payment_method: true,
        payment_proof_file: true,
    });
