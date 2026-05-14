import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
    href?: string;
    title?: string;
}

export const BackButton = ({ href, title = 'Back' }: BackButtonProps) => {
    if (!href) {
        return (
            <Button
                variant="secondary"
                onClick={() => window.history.back()}
                asChild
            >
                {title}
            </Button>
        );
    }

    return (
        <Button variant="secondary" asChild>
            <Link href={href}>{title}</Link>
        </Button>
    );
};
