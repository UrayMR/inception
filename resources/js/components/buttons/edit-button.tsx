import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface EditButtonProps {
    href: string;
    label?: string;
    disabled?: boolean;
}

export const EditButton = ({
    href,
    label = 'Edit',
    disabled = false,
}: EditButtonProps) => {
    return (
        <Button variant="default" size="sm" asChild disabled={disabled}>
            <Link href={href} className="flex items-center gap-2">
                {label}
            </Link>
        </Button>
    );
};
