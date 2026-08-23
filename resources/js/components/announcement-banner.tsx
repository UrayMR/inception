import { X } from 'lucide-react';
import { useState } from 'react';
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

            // 2. Jika belum diupdate admin, cek apakah durasi 30 menit sudah lewat
            return Date.now() > Number(dismissedUntil);
        } catch {
            return true;
        }
    });

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

    return (
        <div className="relative z-50 w-full border-b border-purple-950/60 bg-zinc-950 px-4 py-2 text-center font-mono text-xs font-bold tracking-widest text-zinc-300 uppercase sm:text-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 sm:gap-4">
                <p className="truncate normal-case">{announcement.message}</p>

                <button
                    onClick={handleClose}
                    className="absolute right-4 rounded-md p-1 text-zinc-500 transition-colors hover:bg-white/10 hover:text-amber-400"
                    aria-label="Close broadcast"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
