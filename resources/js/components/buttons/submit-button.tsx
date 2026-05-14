import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface SubmitButtonProps {
    loading?: boolean;
    label?: string;
    loadingLabel?: string;
    disabled?: boolean;
}

export const SubmitButton = ({
    loading = false,
    label = 'Submit',
    loadingLabel = 'Submitting...',
    disabled,
}: SubmitButtonProps) => {
    return (
        <Button type="submit" disabled={loading || disabled}>
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
