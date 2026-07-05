import { Link } from '@inertiajs/react';
import { ArrowRightIcon } from 'lucide-react';
import { login } from '@/routes';
import guest from '@/routes/guest';

export default function HeroSection({ id }: { id: string }) {
    return (
        <section
            id={id}
            className="relative flex min-h-screen flex-col items-center justify-center bg-transparent px-6 py-12 text-center lg:px-8"
        >
            <div className="relative mx-auto max-w-5xl space-y-8">
                <h1 className="text-4xl leading-tight font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                    POWER YOUR INNOVATION <br />
                    WITH{' '}
                    <span className="bg-linear-to-r from-purple-300 via-indigo-200 to-purple-400 bg-clip-text text-transparent">
                        INCEPTION
                    </span>
                </h1>

                <div className="mx-auto h-1 w-16 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]" />

                <p className="mx-auto max-w-xl text-xs leading-relaxed tracking-wide text-purple-100/70 sm:text-sm">
                    Kompetisi teknologi untuk menguji kapabilitas, kreativitas,
                    dan solusi digital mutakhir. Validasi kemampuan terbaik
                    timmu dan klaim total hadiah puluhan juta rupiah.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 font-sans text-xs font-semibold tracking-wider uppercase sm:flex-row">
                    <Link
                        href={login()}
                        className="group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-xl px-7 transition-all duration-300 active:scale-97"
                        style={{
                            background:
                                'linear-gradient(135deg, #B13BFF 0%, #8B2DCC 100%)',
                            color: '#F3E8FF',
                            boxShadow: '0 0 20px rgba(177,59,255,0.35)',
                        }}
                    >
                        <span className="relative z-10">Daftar Sekarang</span>
                        <ArrowRightIcon className="mb-[0.8px] h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    </Link>

                    <Link
                        href={guest.competitions.index()}
                        className="inline-flex h-11 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-950/10 px-7 text-purple-300 backdrop-blur-xs transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-900/20 hover:text-white"
                    >
                        Jelajahi Bidang Lomba
                    </Link>
                </div>
            </div>
        </section>
    );
}
