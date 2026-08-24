import { X } from 'lucide-react';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Announcement } from '@/types';

const STORAGE_KEY = 'announcement_dismissed';

export default function AnnouncementBanner({
    announcement,
}: {
    announcement: Announcement | null;
}) {
    const [isVisible, setIsVisible] = useState(() => {
        if (!announcement) {
            return false;
        }

        try {
            const savedData = localStorage.getItem(STORAGE_KEY);

            if (!savedData) {
                return true;
            }

            const { updatedAt, dismissedUntil } = JSON.parse(savedData);

            if (updatedAt !== announcement.updated_at) {
                return true;
            }

            return Date.now() > Number(dismissedUntil);
        } catch {
            return true;
        }
    });

    const [isExpanded, setIsExpanded] = useState(false);
    const isMobile = useIsMobile();

    const handleClose = () => {
        if (!announcement) {
            return;
        }

        try {
            const BANNER_DISMISS_DURATION_MS = 30 * 60 * 1000; // 30 menit
            const payload = {
                updatedAt: announcement.updated_at,
                dismissedUntil: Date.now() + BANNER_DISMISS_DURATION_MS,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch {
            console.warn('Gagal menyimpan status banner');
        }

        setIsVisible(false);
    };

    if (!isVisible || !announcement) {
        return null;
    }

    const canExpand = !isMobile;

    return (
        <div className="relative z-50 w-full border-b border-purple-950/60 bg-zinc-950 py-2 font-mono text-[11px] font-bold tracking-normal text-zinc-300 uppercase sm:text-sm sm:tracking-wide">
            <div className="mx-auto flex max-w-7xl items-center gap-2 pr-10 pl-4 sm:justify-center sm:gap-2 sm:pr-12 sm:pl-12">
                {canExpand ? (
                    <button
                        type="button"
                        onClick={() => setIsExpanded((prev) => !prev)}
                        className="flex min-w-0 flex-1 items-center gap-1.5 text-left normal-case sm:flex-initial sm:cursor-pointer"
                    >
                        <p
                            className={
                                isExpanded
                                    ? 'leading-snug whitespace-normal'
                                    : 'truncate leading-snug whitespace-nowrap'
                            }
                        >
                            {announcement.message}
                        </p>
                    </button>
                ) : (
                    <p className="min-w-0 flex-1 leading-snug whitespace-normal normal-case">
                        {announcement.message}
                    </p>
                )}

                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 shrink-0 rounded-md p-1 text-zinc-500 transition-colors hover:bg-white/10 hover:text-amber-400 sm:top-1/2 sm:right-3 sm:-translate-y-1/2"
                    aria-label="Close broadcast"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
