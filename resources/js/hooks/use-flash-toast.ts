import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

type FlashPayload = {
    toast?: FlashToast;
    toasts?: FlashToast[];
};

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash as
                | FlashPayload
                | undefined;
            const toasts = flash?.toasts ?? (flash?.toast ? [flash.toast] : []);

            if (!toasts.length) {
                return;
            }

            for (const item of toasts) {
                toast[item.type](item.message);
            }
        });
    }, []);
}
