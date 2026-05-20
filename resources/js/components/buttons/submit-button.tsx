import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface SubmitButtonProps {
    loading?: boolean;
    label?: string;
    loadingLabel?: string;
    disabled?: boolean;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary';
}

export const SubmitButton = ({
    loading = false,
    label = 'Submit',
    loadingLabel = 'Submitting...',
    disabled,
    variant = 'default',
}: SubmitButtonProps) => {
    return (
        <Button type="submit" disabled={loading || disabled} variant={variant}>
            {loading ? (
                <>
                    <Spinner className="mr-2" />
                    {loadingLabel}
                </>
            ) : (
                label
            )}
        </Button>
    );
};
