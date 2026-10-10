import { Skeleton } from '@/components/ui/skeleton';

type Sponsor = {
    name: string;
    logoUrl?: string;
};

const ROW_ONE_SPONSORS: Sponsor[] = [
    {
        name: 'DMP',
        logoUrl: '/assets/webp/sponsors/LOGO DMP_XL.webp',
    },
    // {
    //     name: 'DMP',
    //     logoUrl: '/assets/png/sponsors/LOGO DMP_XL.png',
    // },
    // {
    //     name: 'DMP',
    //     logoUrl: '/assets/png/sponsors/LOGO DMP_XL.png',
    // },
];

const ROW_TWO_SPONSORS: Sponsor[] = [
    {
        name: 'AYU',
        logoUrl: '/assets/webp/sponsors/LOGO AYU_M.webp',
    },
    // {
    //     name: 'AYU',
    //     logoUrl: '/assets/png/sponsors/LOGO AYU_M.png',
    // },
    // {
    //     name: 'AYU',
    //     logoUrl: '/assets/png/sponsors/LOGO AYU_M.png',
    // },
    // {
    //     name: 'AYU',
    //     logoUrl: '/assets/png/sponsors/LOGO AYU_M.png',
    // },
];

const SIZE_CONFIG = {
    xl: {
        skeleton: 'bg-amber-400',
        label: 'XL',
        container: 'h-40 w-80',
        image: 'h-90 w-[26rem]',
    },
    l: {
        skeleton: 'bg-cyan-400',
        label: 'L',
        container: 'h-32 w-64',
        image: 'h-36 w-72',
    },
} as const;

function SponsorLogo({
    sponsor,
    size,
}: {
    sponsor: Sponsor;
    size: 'xl' | 'l';
}) {
    const { skeleton, label, container, image } = SIZE_CONFIG[size];

    return (
        <div className={`group flex ${container} items-center justify-center`}>
            {sponsor.logoUrl ? (
                <div className="flex h-full w-full items-center justify-center">
                    <img
                        src={sponsor.logoUrl}
                        alt={sponsor.name}
                        className={` ${image} object-contain opacity-95 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100`}
                    />
                </div>
            ) : (
                <Skeleton
                    className={`flex h-full w-full animate-none items-center justify-center rounded-2xl ${skeleton} `}
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

            <div className="flex flex-col items-center justify-center gap-10">
                {/* Row 1 — XL Sponsors */}
                <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
                    {ROW_ONE_SPONSORS.map((sponsor) => (
                        <SponsorLogo
                            key={sponsor.name}
                            sponsor={sponsor}
                            size="xl"
                        />
                    ))}
                </div>

                {/* Divider */}
                <div className="mx-auto h-px w-full max-w-xs bg-linear-to-r from-transparent via-purple-500/40 to-transparent" />

                {/* Row 2 — L Sponsors */}
                <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
                    {ROW_TWO_SPONSORS.map((sponsor) => (
                        <SponsorLogo
                            key={`${sponsor.name}-l`}
                            sponsor={sponsor}
                            size="l"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
