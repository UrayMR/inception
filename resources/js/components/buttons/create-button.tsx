import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';

interface CreateButtonProps {
    href: string;
    label?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
}

export const CreateButton = ({
    href,
    label = 'Add',
    icon = <Plus className="h-4 w-4" />,
    disabled = false,
}: CreateButtonProps) => {
    return (
        <Button
            variant="default"
            asChild
            disabled={disabled}
            className="flex items-center gap-2"
        >
            <Link href={href}>
                {icon}
                {label}
            </Link>
        </Button>
    );
};
