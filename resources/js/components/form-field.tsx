import InputError from './input-error';
import InputHint from './input-hint';
import { Label } from './ui/label';

type FormFieldProps = {
    name: string;
    label: string;
    hint?: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
};

export function FormField({
    name,
    label,
    error,
    hint,
    required,
    children,
}: FormFieldProps) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={name}>
                {label}
                {required && <span className="text-destructive"> *</span>}
            </Label>

            {children}

            <div className="space-y-0.5">
                {hint && <InputHint hint={hint} />}
                {error && <InputError message={error} />}
            </div>
        </div>
    );
}
