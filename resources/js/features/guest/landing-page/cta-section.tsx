import { Link } from '@inertiajs/react';
import { contact } from '@/routes/guest';
import { register } from '@/routes/participant/competitions';

export function CtaSection({ id }: { id: string }) {
    return (
        <section
            id={id}
            className="relative z-10 overflow-hidden py-16 sm:py-32"
        >
            <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
                <div className="relative overflow-hidden rounded-3xl border border-purple-900/40 bg-[#0d0829]/80 px-6 py-12 text-center shadow-[0_30px_70px_rgba(5,2,15,0.8)] backdrop-blur-2xl sm:p-16 md:p-20">
                    <div className="pointer-events-none absolute top-0 left-0 h-10 w-10 rounded-tl-3xl border-t-2 border-l-2 border-purple-500/30 sm:h-12 sm:w-12" />
                    <div className="pointer-events-none absolute right-0 bottom-0 h-10 w-10 rounded-br-3xl border-r-2 border-b-2 border-purple-500/30 sm:h-12 sm:w-12" />

                    <span className="mb-4 block font-mono text-xs font-bold tracking-[0.4em] text-purple-400 uppercase">
                        // INITIALIZE_JOIN
                    </span>

                    <h2 className="mx-auto max-w-3xl text-4xl leading-tight font-avalors font-black tracking-widest text-white uppercase md:text-6xl">
                        SECURE YOUR{' '}
                        <span className="block bg-linear-to-r from-amber-400 via-orange-300 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(251,191,36,0.3)] sm:inline">
                            OPPORTUNITY
                        </span>{' '}
                        NOW
                    </h2>

                    <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-purple-200/60">
                        Temukan kompetisi terbaik atau mulai perjalanan event
                        kamu bersama Inception. Bergabunglah sekarang dan
                        tunjukkan kemampuan terbaikmu di panggung nasional!
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-3.5 font-sans text-xs font-semibold tracking-wider uppercase sm:flex-row">
                        <Link
                            href={contact()}
                            className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-purple-500/30 bg-purple-950/10 px-7 text-purple-300 backdrop-blur-xs transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-900/20 hover:text-white sm:w-auto"
                        >
                            Hubungi Kami
                        </Link>

                        <Link
                            href={register()}
                            className="group relative inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-7 transition-all duration-300 active:scale-97 sm:w-auto"
                            style={{
                                background:
                                    'linear-gradient(135deg, #B13BFF 0%, #8B2DCC 100%)',
                                color: '#F3E8FF',
                                boxShadow: '0 0 20px rgba(177,59,255,0.35)',
                            }}
                        >
                            <span className="relative z-10">
                                Daftar Sekarang
                            </span>
                            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
