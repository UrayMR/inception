import { Link } from '@inertiajs/react';

export function CtaSection() {
    return (
        <section className="relative overflow-hidden py-24">
            <div className="relative mx-auto max-w-5xl px-6">
                <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/4 p-12 text-center shadow-[0_0_50px_rgba(99,102,241,0.05)] backdrop-blur-2xl md:p-20">
                    <h2 className="mx-auto mt-6 max-w-3xl text-4xl leading-tight font-extrabold tracking-tight text-white md:text-6xl">
                        SECURE YOUR{' '}
                        <span className="bg-linear-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                            OPPORTUNITY
                        </span>{' '}
                        NOW!
                    </h2>

                    <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-400">
                        Temukan kompetisi terbaik atau mulai perjalanan event
                        kamu bersama Inception. Bergabunglah sekarang dan
                        tunjukkan kemampuan terbaikmu!
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/contact"
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10"
                        >
                            Contact Us
                        </Link>

                        <Link
                            href="/"
                            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-lg px-5 text-sm font-semibold tracking-wide transition-all duration-300"
                            style={{
                                background:
                                    'linear-gradient(135deg, #B13BFF 0%, #8B2DCC 100%)',
                                color: '#F3E8FF',
                                boxShadow: '0 0 20px rgba(177,59,255,0.35)',
                            }}
                        >
                            <span className="relative z-10">Register Now</span>

                            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
