import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'INCEPTION';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    // Layout is now determined by the page component itself, so we can remove the layout function from here.
    // layout: (name) => {
    //     switch (true) {
    //         case name.startsWith('auth/'):
    //             return AuthLayout;
    //         case name.startsWith('settings/'):
    //             return [PanelLayout, SettingsLayout];
    //         default:
    //             return AppLayout;
    //     }
    // },

    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster richColors theme="light" expand/>
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
        showSpinner: true,
    },
});

// This will set light / dark mode on load...
initializeTheme();
