import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { AppVariant } from '@/types';

type Props = {
    children: ReactNode;
    variant?: AppVariant;
};

export function AppShell({ children, variant = 'sidebar' }: Props) {
    const isOpen = usePage().props.sidebarOpen;

    if (variant === 'header') {
        return (
            <div
                className="flex min-h-screen w-full flex-col overflow-x-hidden"
                style={{
                    background:
                        'linear-gradient(160deg, #0d0035 0%, #050024 60%)',
                    // Subtle inner border glow to frame content against surrounding layout
                    boxShadow:
                        'inset 0 0 0 1px rgba(55,0,92,0.5), inset 0 1px 0 0 rgba(177,59,255,0.12)',
                }}
            >
                {children}
            </div>
        );
    }

    return <SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>;
}
