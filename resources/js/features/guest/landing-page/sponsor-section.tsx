import { Skeleton } from '@/components/ui/skeleton';

type Sponsor = {
    name: string;
    logoUrl?: string;
};

const ROW_ONE_SPONSORS: Sponsor[] = [
    { name: 'Sponsor A' },
    { name: 'Sponsor B' },
    { name: 'Sponsor C' },
];

const ROW_TWO_SPONSORS: Sponsor[] = [
    { name: 'Sponsor D' },
    { name: 'Sponsor E' },
    { name: 'Sponsor F' },
    { name: 'Sponsor G' },
];

const SIZE_CONFIG = {
    xl: {
        skeleton: 'bg-amber-400',
        label: 'XL',
    },
    l: {
        skeleton: 'bg-cyan-400',
        label: 'L',
    },
} as const;

function SponsorLogo({
    sponsor,
    size,
}: {
    sponsor: Sponsor;
    size: 'xl' | 'l';
}) {
    const { skeleton, label } = SIZE_CONFIG[size];

    return (
        <div className="group flex h-28 w-56 items-center justify-center transition-all duration-300 hover:scale-105 sm:h-32 sm:w-64">
            {sponsor.logoUrl ? (
                <img
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    className="max-h-full max-w-full object-contain opacity-85 drop-shadow-[0_0_0_rgba(251,191,36,0)] transition-all duration-300 group-hover:opacity-100 group-hover:drop-shadow-[0_0_18px_rgba(251,191,36,0.25)]"
                />
            ) : (
                <Skeleton
                    className={`relative flex h-full w-full items-center justify-center rounded-2xl animate-none ${skeleton}`}
                    aria-label={sponsor.name}
                >
                    <span className="font-mono text-xs font-bold tracking-[0.2em] text-white text-shadow-md">
                        {label}
                    </span>
                </Skeleton>
            )}
        </div>
    );
}

export default function SponsorSection({ id }: { id: string }) {
    return (
        <section
            id={id}
            className="relative z-10 mx-auto w-full max-w-7xl overflow-hidden px-6 py-16 sm:py-24 lg:px-8"
        >
            <div className="mb-16 space-y-3 text-center">
                <span className="block font-mono text-xs font-bold tracking-[0.4em] text-purple-400 uppercase">
                    // SPONSORSHIPS
                </span>
                <h2 className="font-avalors text-4xl font-extrabold tracking-wider text-white sm:text-5xl">
                    OUR SPONSORS
                </h2>
                <div className="mx-auto h-1 w-20 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
            </div>

            {/* Row 1 — XL, yellow placeholder */}
            <div className="mb-10 flex flex-wrap items-center justify-center gap-8 sm:gap-14">
                {ROW_ONE_SPONSORS.map((sponsor) => (
                    <SponsorLogo
                        key={sponsor.name}
                        sponsor={sponsor}
                        size="xl"
                    />
                ))}
            </div>

            {/* Divider */}
            <div className="mx-auto mb-10 h-px w-full max-w-xs bg-linear-to-r from-transparent via-purple-500/20 to-transparent" />

            {/* Row 2 — L, blue placeholder */}
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
                {ROW_TWO_SPONSORS.map((sponsor) => (
                    <SponsorLogo
                        key={sponsor.name}
                        sponsor={sponsor}
                        size="l"
                    />
                ))}
            </div>
        </section>
    );
}
