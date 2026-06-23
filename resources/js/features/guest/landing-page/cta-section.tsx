import { Link } from '@inertiajs/react';

export function CtaSection() {
    return (
        <section className="relative z-10 overflow-hidden py-32">
            <div className="relative mx-auto max-w-5xl px-6">
                <div className="relative overflow-hidden rounded-3xl border border-purple-900/40 bg-[#0d0829]/80 p-12 text-center shadow-[0_30px_70px_rgba(5,2,15,0.8)] backdrop-blur-2xl md:p-20">
                    <div className="pointer-events-none absolute top-0 left-0 h-12 w-12 rounded-tl-3xl border-t-2 border-l-2 border-purple-500/30" />
                    <div className="pointer-events-none absolute right-0 bottom-0 h-12 w-12 rounded-br-3xl border-r-2 border-b-2 border-purple-500/30" />

                    <span className="mb-4 block font-mono text-xs font-bold tracking-[0.4em] text-purple-400 uppercase">
                        // INITIALIZE_JOIN
                    </span>

                    <h2 className="mx-auto max-w-3xl text-4xl leading-tight font-black tracking-widest text-white uppercase md:text-6xl">
                        SECURE YOUR{' '}
                        <span className="bg-linear-to-r from-amber-400 via-orange-300 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                            OPPORTUNITY
                        </span>{' '}
                        NOW
                    </h2>

                    <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-purple-200/60">
                        Temukan kompetisi terbaik atau mulai perjalanan event
                        kamu bersama Inception. Bergabunglah sekarang dan
                        tunjukkan kemampuan terbaikmu di panggung nasional!
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 font-mono sm:flex-row">
                        <Link
                            href="/contact"
                            className="inline-flex h-12 items-center justify-center rounded-xl border border-purple-900/60 bg-purple-950/20 px-8 text-xs font-bold tracking-widest text-purple-200 uppercase transition-all duration-300 hover:border-purple-500/40 hover:bg-purple-900/30 hover:text-white"
                        >
                            Contact Us
                        </Link>

                        <Link
                            href="/register"
                            className="group relative inline-flex h-12 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 px-8 text-xs font-bold tracking-widest text-white uppercase transition-all duration-300 hover:from-purple-500 hover:to-indigo-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-95"
                        >
                            <span className="relative z-10">Register Now</span>
                            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
