import { useEffect, useState } from 'react';

const REGISTRATION_START = new Date('2026-08-24T00:00:00');
const REGISTRATION_END = new Date('2026-09-03T23:59:59');

type RegistrationStatus = 'not_started' | 'open' | 'ended';

function calculateTimeLeft() {
    const now = new Date().getTime();
    const startDiff = REGISTRATION_START.getTime() - now;
    const endDiff = REGISTRATION_END.getTime() - now;

    let status: RegistrationStatus = 'open';
    let targetDiff = 0;

    if (startDiff > 0) {
        status = 'not_started';
        targetDiff = startDiff;
    } else if (endDiff > 0) {
        status = 'open';
        targetDiff = endDiff;
    } else {
        status = 'ended';
        targetDiff = 0;
    }

    if (targetDiff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, status };
    }

    return {
        days: Math.floor(targetDiff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((targetDiff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((targetDiff / (1000 * 60)) % 60),
        seconds: Math.floor((targetDiff / 1000) % 60),
        status,
    };
}

export default function AboutSection({ id }: { id: string }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const pad = (num: number) => String(num).padStart(2, '0');

    const units = [
        { label: 'Hari', value: timeLeft.days },
        { label: 'Jam', value: timeLeft.hours },
        { label: 'Menit', value: timeLeft.minutes },
        { label: 'Detik', value: timeLeft.seconds },
    ];

    const getStatusLabel = (status: RegistrationStatus) => {
        switch (status) {
            case 'not_started':
                return 'Pendaftaran Dibuka Dalam';
            case 'open':
                return 'Pendaftaran Ditutup Dalam';
            case 'ended':
                return 'Pendaftaran Telah Ditutup';
        }
    };

    return (
        <section
            id={id}
            className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8"
        >
            <div className="mb-12 space-y-3 text-center md:text-left">
                <span className="block font-mono text-xs font-bold tracking-[0.4em] text-purple-400 uppercase">
                    // PROTOCOL_DATA
                </span>
                <h2 className="font-avalors text-4xl font-extrabold tracking-wider text-white sm:text-5xl md:max-w-md">
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
                            INCEPTION hadir sebagai panggung inovasi IT tingkat
                            nasional yang mentransformasi ide-ide solutif
                            talenta muda menjadi karya berdampak nyata. Melalui
                            ekosistem yang kolaboratif, kami menantang para
                            developer, designer, dan tech-innovator untuk
                            mengeksplorasi batas teknologi dan menjawab berbagai
                            tantangan riil di masyarakat.
                        </p>
                        <p>
                            Ini adalah ajang adu gengsi sekaligus wadah
                            pembuktian bagi generasi digital berbakat dari
                            seluruh Indonesia. Siapkan inovasi terbaik timmu,
                            taklukkan setiap tantangan kompetisinya, dan jadilah
                            bagian dari pendorong perubahan teknologi masa depan
                        </p>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-purple-950/40 bg-[#07041a]/60 p-6 shadow-xl backdrop-blur-md sm:p-8">
                    <div className="mb-5 text-center">
                        <span className="font-mono text-[11px] font-bold tracking-[0.3em] text-purple-300/60 uppercase">
                            {getStatusLabel(timeLeft.status)}
                        </span>
                    </div>

                    <div className="flex items-center justify-center gap-2 sm:gap-4">
                        {units.map((unit, i) => (
                            <div
                                key={unit.label}
                                className="flex items-center gap-2 sm:gap-4"
                            >
                                <div className="flex w-16 flex-col items-center gap-2 rounded-2xl border border-purple-500/20 bg-purple-950/30 py-4 sm:w-24 sm:py-5">
                                    <span className="font-mono text-2xl font-black text-white tabular-nums sm:text-4xl">
                                        {pad(unit.value)}
                                    </span>
                                    <span className="font-mono text-[9px] tracking-widest text-purple-300/50 uppercase sm:text-[10px]">
                                        {unit.label}
                                    </span>
                                </div>
                                {i < units.length - 1 && (
                                    <span className="pb-4 font-mono text-xl font-black text-amber-400/60 sm:pb-5 sm:text-3xl">
                                        :
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
