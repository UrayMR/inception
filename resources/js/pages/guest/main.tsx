import { Head, Link } from '@inertiajs/react';
import { ArrowRightIcon, Calendar, Rocket, Trophy } from 'lucide-react';
import CarouselSection from '@/features/guest/landing-page/carousel-section';
import AppLayout from '@/layouts/app-layout';
import { login } from '@/routes';
import guest from '@/routes/guest';

export default function Main() {
    return (
        <AppLayout>
            <Head title="Welcome" />

            {/* --- HERO SECTION --- */}
            <div className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 py-12 text-center lg:px-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(88,28,135,0.15)_0%,rgba(0,0,0,0)_70%)]" />
                <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-purple-600/10 blur-[100px]" />

                <div className="relative z-10 mx-auto max-w-4xl space-y-6">
                    <h1 className="text-4xl font-extralight tracking-tight text-white sm:text-6xl lg:text-7xl">
                        Power Your Innovation With{' '}
                        <span className="mt-2 block bg-linear-to-r from-purple-400 via-yellow-300 to-indigo-400 bg-clip-text font-extrabold tracking-wider text-transparent">
                            INCEPTION
                        </span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg lg:text-xl">
                        Kompetisi teknologi untuk menguji skill, kreativitas,
                        dan solusi digital mutakhir. Tunjukkan kemampuan tim
                        terbaikmu dan bawa pulang total hadiah puluhan juta
                        rupiah.
                    </p>

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href={login()}
                            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/40 transition-all hover:from-purple-500 hover:to-indigo-500"
                        >
                            Daftar Sekarang
                            <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href={guest.competitions.index()}
                            className="inline-flex items-center justify-center rounded-xl border border-gray-700 bg-slate-900/50 px-8 py-3.5 text-sm font-semibold text-gray-300 backdrop-blur-md hover:bg-slate-800 hover:text-white"
                        >
                            Lihat Bidang Lomba
                        </Link>
                    </div>
                </div>
            </div>

            {/* --- CAROUSEL SECTION --- */}
            <CarouselSection />

            {/* --- STATS / QUICK INFO SECTION --- */}
            <div className="relative z-10 mx-auto max-w-7xl px-6 pb-32 lg:px-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div className="relative overflow-hidden rounded-2xl border border-gray-800/60 bg-slate-950/40 p-8 backdrop-blur-xl">
                        <Trophy className="mb-4 h-8 w-8 text-purple-400" />
                        <div className="text-3xl font-bold text-white">
                            Rp 50.000.000+
                        </div>
                        <div className="mt-1 text-sm text-gray-400">
                            Total Hadiah Pembinaan
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl border border-gray-800/60 bg-slate-950/40 p-8 backdrop-blur-xl">
                        <Rocket className="mb-4 h-8 w-8 text-yellow-400" />
                        <div className="text-3xl font-bold text-white">
                            5 Bidang
                        </div>
                        <div className="mt-1 text-sm text-gray-400">
                            Kompetisi Utama
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl border border-gray-800/60 bg-slate-950/40 p-8 backdrop-blur-xl">
                        <Calendar className="mb-4 h-8 w-8 text-indigo-400" />
                        <div className="text-3xl font-bold text-white">
                            Agustus 2026
                        </div>
                        <div className="mt-1 text-sm text-gray-400">
                            Acara Puncak & Awarding
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
