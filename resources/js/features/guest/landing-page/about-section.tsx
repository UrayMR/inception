export default function AboutSection() {
    return (
        <section className="relative z-10 mx-auto max-w-5xl px-6 py-20 lg:px-8">
            {/* Background Glow Behind Content */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 h-100 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-[120px]" />

            <div className="mb-10 text-center">
                <h2 className="text-3xl font-light tracking-wide text-white sm:text-5xl">
                    What Is{' '}
                    <span className="bg-linear-to-r from-purple-400 to-indigo-400 bg-clip-text font-extrabold text-transparent">
                        INCEPTION
                    </span>
                </h2>
            </div>

            <div className="relative space-y-5">
                <div className="relative overflow-hidden rounded-2xl border border-[rgba(55,65,81,0.6)] bg-linear-to-b from-[#0d0035]/60 to-[#050024]/80 p-8 shadow-[0_0_30px_rgba(13,0,53,0.5)] backdrop-blur-xl sm:p-10">
                    {/* <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-purple-500/40 to-transparent" /> */}

                    <h3 className="mb-5 text-xl font-normal tracking-wide text-white sm:text-2xl">
                        The{' '}
                        <span className="font-extrabold tracking-wider text-[#facc15] uppercase">
                            BIGGEST
                        </span>{' '}
                        Tech & Innovation Event for Next Gen Developers
                    </h3>

                    <p className="space-y-4 text-sm leading-relaxed font-light text-gray-400 sm:text-base">
                        INCEPTION adalah ajang kompetisi dan inovasi teknologi
                        berskala nasional yang dirancang khusus untuk mewadahi
                        ide-ide kreatif dan solutif dari talenta muda digital.
                        Menjadi episentrum kolaborasi, event ini menantang para
                        pengembang, desainer, dan inovator untuk memecahkan
                        masalah nyata melalui ekosistem digital yang adaptif.
                    </p>
                    <p className="mt-4 text-sm leading-relaxed font-light text-gray-400 sm:text-base">
                        Tahun ini, INCEPTION mengusung visi besar untuk
                        menjembatani kesenjangan talenta digital nasional,
                        membawa ekosistem hibrida yang memadukan kompetisi ketat
                        dengan mentoring intensif guna melahirkan mahakarya
                        teknologi yang siap bersaing di panggung global.
                    </p>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-[rgba(55,65,81,0.6)] bg-linear-to-b from-[#0d0035]/40 to-[#050024]/60 p-6 shadow-lg backdrop-blur-xl sm:p-8">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-6 divide-y-0 divide-gray-800/60 text-center sm:grid-cols-4 sm:gap-y-0 sm:divide-x">
                        <div className="space-y-1">
                            <div className="bg-linear-to-r from-purple-400 to-indigo-300 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                                25+
                            </div>
                            <div className="text-xs font-medium tracking-wide text-gray-400 sm:text-sm">
                                Partner Experts
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="bg-linear-to-r from-teal-400 to-indigo-300 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                                5000+
                            </div>
                            <div className="text-xs font-medium tracking-wide text-gray-400 sm:text-sm">
                                Active Competitors
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="bg-linear-to-r from-purple-400 to-pink-300 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                                1500+
                            </div>
                            <div className="text-xs font-medium tracking-wide text-gray-400 sm:text-sm">
                                Inbound Ideas
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="bg-linear-to-r from-yellow-400 to-orange-300 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                                Rp 50M+
                            </div>
                            <div className="text-xs font-medium tracking-wide text-gray-400 sm:text-sm">
                                Total Grand Prize
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
