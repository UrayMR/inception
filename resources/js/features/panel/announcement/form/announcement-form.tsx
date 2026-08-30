import { FormField } from '@/components/form-field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { FormProps } from '@/types';
import type { AnnouncementSchemaType } from '@/validations/announcement-schema';

type AnnouncementFormProps = FormProps<AnnouncementSchemaType>;

export function AnnouncementForm({
    data,
    errors,
    onChange,
}: AnnouncementFormProps) {
    return (
        <div className="space-y-5">
            <FormField
                name="message"
                label="Pesan Pengumuman"
                error={errors.message}
                required
            >
                <Input
                    id="message"
                    type="text"
                    value={data.message}
                    onChange={(e) => onChange('message', e.target.value)}
                    placeholder="Masukkan teks pengumuman..."
                    required
                />
            </FormField>

            <FormField
                name="status"
                label="Status"
                error={errors.status}
                required
            >
                <Select
                    value={data.status}
                    onValueChange={(value) =>
                        onChange('status', value as 'active' | 'inactive')
                    }
                    required
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </FormField>
        </div>
    );
}
