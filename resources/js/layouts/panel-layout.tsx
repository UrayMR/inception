import { Head } from '@inertiajs/react';
import PanelLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

export default function PanelLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <PanelLayoutTemplate breadcrumbs={breadcrumbs}>
            <Head>
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            {children}
        </PanelLayoutTemplate>
    );
}
