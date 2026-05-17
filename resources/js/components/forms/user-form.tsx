import { FormField } from '@/components/form-field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { UserRoleMap } from '@/types';
import type { UserRoleType, FormProps } from '@/types';

export type UserFormData = {
    name: string;
    email: string;
    role: UserRoleType;
    password?: string;
    password_confirmation?: string;
};

type UserFormProps = FormProps<UserFormData>;

export function UserForm({ mode, data, errors, onChange }: UserFormProps) {
    const createMode = mode === 'create';
    const editMode = mode === 'edit';
    const showMode = mode === 'show';
    const isReadOnly = showMode;

    const isPasswordChanged =
        data.password !== undefined && data.password !== '';

    return (
        <div className="space-y-5">
            <FormField
                name="name"
                label="Full Name"
                error={errors.name}
                required
            >
                <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => onChange('name', e.target.value)}
                    readOnly={isReadOnly}
                    placeholder="Enter Full Name"
                    required
                />
            </FormField>

            <FormField
                name="email"
                label="Email"
                error={errors.email}
                required
                hint={
                    editMode
                        ? 'Email cannot be changed after registration.'
                        : undefined
                }
            >
                <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    disabled={editMode}
                    readOnly={isReadOnly}
                    placeholder="Enter Email"
                    autoComplete="email"
                    required
                />
            </FormField>

            <FormField name="role" label="Role" error={errors.role} required>
                <Select
                    value={data.role}
                    onValueChange={(value) =>
                        onChange('role', value as UserRoleType)
                    }
                    required
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                    </SelectTrigger>

                    <SelectContent>
                        {Object.values(UserRoleMap).map((role) => (
                            <SelectItem
                                key={role.value}
                                value={role.value}
                                disabled={isReadOnly}
                            >
                                {role.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>

            {!showMode && (
                <>
                    <FormField
                        name="password"
                        label="Password"
                        error={errors.password}
                        required={createMode}
                    >
                        <Input
                            id="password"
                            type="password"
                            value={data.password ?? ''}
                            onChange={(e) =>
                                onChange('password', e.target.value)
                            }
                            placeholder={
                                editMode
                                    ? 'Leave empty to keep unchanged'
                                    : 'Enter Password'
                            }
                            autoComplete="new-password"
                            required={createMode}
                        />
                    </FormField>

                    <FormField
                        name="password_confirmation"
                        label="Confirm Password"
                        error={errors.password_confirmation}
                        required={createMode || isPasswordChanged}
                    >
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation ?? ''}
                            disabled={!isPasswordChanged}
                            onChange={(e) =>
                                onChange(
                                    'password_confirmation',
                                    e.target.value,
                                )
                            }
                            placeholder={
                                editMode
                                    ? 'Leave empty to keep unchanged'
                                    : 'Confirm Password'
                            }
                            autoComplete="new-password"
                            required={createMode || isPasswordChanged}
                        />
                    </FormField>
                </>
            )}
        </div>
    );
}
