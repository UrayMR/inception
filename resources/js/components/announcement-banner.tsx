import { X } from 'lucide-react';
import { useState } from 'react';

export default function AnnouncementBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="relative z-50 w-full border-b border-purple-950/60 bg-zinc-950 px-4 py-2 text-center font-mono text-xs font-bold tracking-widest text-zinc-300 uppercase sm:text-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 sm:gap-4">
                <p className="truncate normal-case">
                    Pendaftaran INCEPTION 2026 resmi dibuka. Amankan slot timmu
                    sekarang.
                </p>

                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-4 rounded-md p-1 text-zinc-500 transition-colors hover:bg-white/10 hover:text-amber-400"
                    aria-label="Close broadcast"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
