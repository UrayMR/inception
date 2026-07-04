import { AppContent } from '@/components/app-content';
import { AppFooter } from '@/components/app-footer';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import SpaceBackground from '@/components/background/space-background';
import type { AppLayoutProps } from '@/types';

export default function AppHeaderLayout({ children }: AppLayoutProps) {
    return (
        <AppShell variant="header">
            <AppHeader />
            <SpaceBackground />
            <AppContent variant="header">{children}</AppContent>
            <AppFooter/>
        </AppShell>
    );
}
