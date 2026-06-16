import { Binary, Sparkles, Code2, Flag, BarChart3 } from 'lucide-react';
import { CompetitionCarousel } from '@/features/guest/landing-page/components/competition-carousel';

const competitions = [
    {
        title: 'Informatics Competition',
        desc: 'Kompetisi yang menguji kemampuan berpikir melalui penyelesaian masalah komputasional dan logika murni.',
        icon: Binary,
    },
    {
        title: 'UX Competition',
        desc: 'Kompetisi yang menguji kemampuan dalam merangkai desain UX aplikasi mobile maupun web yang intuitif.',
        icon: Sparkles,
    },
    {
        title: 'Competitive Programming',
        desc: 'Kompetisi yang menguji kemampuan dalam pemecahan masalah secara algoritmik dan efisiensi kode tingkat tinggi.',
        icon: Code2,
    },
    {
        title: 'Capture the Flag',
        desc: 'Kompetisi keamanan siber yang menguji kemampuan problem solving peserta untuk mencari flag yang tersembunyi.',
        icon: Flag,
    },
    {
        title: 'Data Analytics Competition',
        desc: 'Kompetisi yang menguji kemampuan dalam analisis big data untuk menghasilkan solusi bisnis yang optimal.',
        icon: BarChart3,
    },
];

export default function CarouselSection() {
    return (
        <section className="relative z-10 mx-auto w-full max-w-7xl overflow-hidden px-6 py-20 lg:px-8">
            <div className="mb-16 space-y-4 text-center">
                <h2 className="text-3xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_25px_rgba(168,85,247,0.6)] sm:text-5xl">
                    Choose Your Path
                </h2>

                <div className="mx-auto h-0.5 w-24 rounded-full bg-linear-to-r from-purple-500 to-indigo-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
            </div>

            <div className="relative mx-auto max-w-5xl px-4">
                <CompetitionCarousel items={competitions} />
            </div>
        </section>
    );
}
