import { Link } from '@inertiajs/react';
import { ArrowRightIcon } from 'lucide-react';
import { login } from '@/routes';
import guest from '@/routes/guest';

export default function HeroSection() {
    return (
        <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 py-12 text-center lg:px-8">
            <div className="relative mx-auto max-w-5xl space-y-10">
                <h1 className="text-4xl leading-[1.15] font-extrabold tracking-tight text-white uppercase sm:text-6xl lg:text-7xl">
                    Power Your Innovation <br />
                    With{' '}
                    <span className="relative inline-block bg-linear-to-r from-white via-purple-200 to-indigo-300 bg-clip-text font-black text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                        INCEPTION
                    </span>
                </h1>

                <div className="mx-auto h-1 w-16 bg-amber-400/80 shadow-[0_0_10px_rgba(251,191,36,0.4)]" />

                <p className="mx-auto max-w-2xl text-sm leading-relaxed tracking-wide text-purple-200/50 sm:text-base">
                    Kompetisi teknologi untuk menguji kapabilitas, kreativitas,
                    dan solusi digital mutakhir. Validasi kemampuan terbaik
                    timmu dan klaim total hadiah puluhan juta rupiah.
                </p>

                <div className="mt-12 flex flex-col flex-wrap items-center justify-center gap-4 font-mono text-xs font-bold tracking-widest uppercase sm:flex-row">
                    <Link
                        href={login()}
                        className="group relative inline-flex h-12 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 px-8 text-white transition-all duration-300 hover:from-purple-500 hover:to-indigo-500 hover:shadow-[0_0_25px_rgba(147,51,234,0.4)] active:scale-95"
                    >
                        <span className="relative z-10 inline-flex items-center gap-2">
                            Daftar Sekarang
                            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                        <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                    </Link>

                    {/* Secondary Button: Border Ghost Style */}
                    <Link
                        href={guest.competitions.index()}
                        className="inline-flex h-12 items-center justify-center rounded-xl border border-purple-900/40 bg-purple-950/10 px-8 text-purple-300 backdrop-blur-md transition-all duration-300 hover:border-purple-500/40 hover:bg-purple-900/20 hover:text-white"
                    >
                        Lihat Bidang Lomba
                    </Link>
                </div>
            </div>
        </section>
    );
}
