import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface ShowButtonProps {
    href: string;
    label?: string;
    disabled?: boolean;
}

export const ShowButton = ({
    href,
    label = 'Show',
    disabled = false,
}: ShowButtonProps) => {
    return (
        <Button variant="outline" size="sm" asChild>
            <Link href={href} disabled={disabled}>
                {label}
            </Link>
        </Button>
    );
};
