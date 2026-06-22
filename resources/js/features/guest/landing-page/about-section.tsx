export default function AboutSection() {
    return (
        <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <div className="mb-12 space-y-3 text-center md:text-left">
                <span className="block font-mono text-xs font-bold tracking-[0.4em] text-purple-400 uppercase">
                    // PROTOCOL_DATA
                </span>
                <h2 className="text-4xl font-extrabold tracking-wider text-white sm:text-5xl md:max-w-md">
                    IT'S ABOUT INCEPTION
                </h2>
                <div className="mx-auto h-1 w-20 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)] md:mx-0" />
            </div>

            <div className="relative space-y-6">
                <div className="relative overflow-hidden rounded-3xl border border-purple-900/30 bg-[#0d0829]/70 p-8 shadow-[0_25px_50px_rgba(5,2,15,0.5)] backdrop-blur-xl transition-all duration-300 hover:border-purple-500/20 sm:p-10">
                    <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent" />

                    <h3 className="mb-6 text-center text-xl leading-snug font-normal tracking-wide text-white sm:text-2xl md:text-left">
                        The{' '}
                        <span className="font-black tracking-wider text-amber-400 uppercase drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                            BIGGEST
                        </span>{' '}
                        Tech & Innovation Event for Next Gen Developers
                    </h3>

                    <div className="space-y-4 text-justify text-sm leading-relaxed font-normal text-purple-200/70 sm:text-base md:text-left">
                        <p>
                            INCEPTION adalah ajang kompetisi dan inovasi
                            teknologi berskala nasional yang dirancang khusus
                            untuk mewadahi ide-ide kreatif dan solutif dari
                            talenta muda digital. Menjadi episentrum kolaborasi,
                            event ini menantang para pengembang, desainer, dan
                            inovator untuk memecahkan masalah nyata melalui
                            ekosistem digital yang adaptif.
                        </p>
                        <p>
                            Tahun ini, INCEPTION mengusung visi besar untuk
                            menjembatani kesenjangan talenta digital nasional,
                            membawa ekosistem hibrida yang memadukan kompetisi
                            ketat dengan mentoring intensif guna melahirkan
                            mahakarya teknologinya yang siap bersaing di
                            panggung global.
                        </p>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-purple-950/40 bg-[#07041a]/60 p-6 shadow-xl backdrop-blur-md sm:p-8">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-6 divide-y-0 divide-purple-950/50 text-center sm:grid-cols-4 sm:gap-y-0 sm:divide-x">
                        <div className="space-y-1">
                            <div className="bg-linear-to-r from-purple-400 to-indigo-300 bg-clip-text text-2xl font-black tracking-wide text-transparent drop-shadow-[0_0_10px_rgba(168,85,247,0.3)] sm:text-3xl">
                                25+
                            </div>
                            <div className="font-mono text-[10px] tracking-wider text-purple-300/50 uppercase">
                                Partner Experts
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="bg-linear-to-r from-cyan-400 to-indigo-300 bg-clip-text text-2xl font-black tracking-wide text-transparent drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] sm:text-3xl">
                                5000+
                            </div>
                            <div className="font-mono text-[10px] tracking-wider text-purple-300/50 uppercase">
                                Active Competitors
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="bg-linear-to-r from-purple-400 to-pink-300 bg-clip-text text-2xl font-black tracking-wide text-transparent drop-shadow-[0_0_10px_rgba(192,132,252,0.3)] sm:text-3xl">
                                1500+
                            </div>
                            <div className="font-mono text-[10px] tracking-wider text-purple-300/50 uppercase">
                                Inbound Ideas
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="bg-linear-to-r from-amber-400 to-orange-300 bg-clip-text text-2xl font-black tracking-wide text-transparent drop-shadow-[0_0_10px_rgba(251,191,36,0.3)] sm:text-3xl">
                                Rp 50M+
                            </div>
                            <div className="font-mono text-[10px] tracking-wider text-purple-300/50 uppercase">
                                Total Grand Prize
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
