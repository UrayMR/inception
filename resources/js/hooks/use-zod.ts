import type { ZodType } from 'zod';

export type ZodFormErrors = Record<string, string>;

/**
 * A hook to use Zod schema for form validation.
 *
 * @param schema The Zod schema to use.
 * @returns An object with validate and guard functions.
 */
export function useZod<T>(schema: ZodType<T>) {
    /**
     * Validate the data against the schema.
     *
     * @param data The data to validate.
     * @returns The errors or null if the data is valid.
     */
    const validate = (data: unknown): ZodFormErrors | null => {
        const result = schema.safeParse(data);

        if (result.success) {
            return null;
        }

        const errors: ZodFormErrors = {};

        // Collect errors from Zod issues
        for (const issue of result.error.issues) {
            const path = issue.path.join('.');

            if (!path) {
                continue;
            }

            errors[path] = errors[path]
                ? `${errors[path]}, ${issue.message}`
                : issue.message;
        }

        return errors;
    };

    /**
     * Guard the data against the schema.
     *
     * @param data The data to guard.
     * @param setError The function to set the error.
     * @returns Whether the data is valid.
     */
    const guard = <K extends string>(
        data: unknown,
        setError: (field: K, message: string) => void,
    ): boolean => {
        // Validate the data against the schema
        const errors = validate(data);

        if (!errors) {
            return true;
        }

        // Set the errors using the provided setError function
        Object.entries(errors).forEach(([field, message]) => {
            setError(field as K, message);
        });

        return false;
    };

    return { validate, guard };
}
