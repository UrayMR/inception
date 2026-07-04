interface PlanetIllustrationProps {
    className?: string;
    /** Adds a slow floating animation, default true */
    animate?: boolean;
}

/**
 * PlanetIllustration
 * -------------------
 * Original minimalist line-art ringed planet (Saturn-like), colored
 * from the moodboard palette (purple sphere, gold ring accent, cream
 * ring band). A ringed planet reads as unmistakably "space" even at
 * small sizes — unlike more mechanical shapes (satellites, rockets)
 * that need a lot of small detail to be recognizable.
 *
 * Designed to float calmly beside FAQ copy, with two small orbiting
 * moons for a bit of quiet motion without stealing attention from the
 * text.
 *
 * Usage:
 *   <div className="relative">
 *     <PlanetIllustration className="w-40 md:w-56 absolute -right-4 -top-10" />
 *     <p>... faq section copy ...</p>
 *   </div>
 */
export default function PlanetIllustration({
    className,
    animate = true,
}: PlanetIllustrationProps) {
    return (
        <svg
            viewBox="0 0 300 220"
            className={className}
            style={
                animate
                    ? { animation: 'rocket-float 8s ease-in-out infinite' }
                    : undefined
            }
            role="img"
            aria-label="Planet illustration"
        >
            <defs>
                <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                    <stop offset="25%" stopColor="#E8D5FF" />
                    <stop offset="50%" stopColor="#FFFFFF" />
                    <stop offset="75%" stopColor="#FFE9A8" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>
                <filter
                    id="planetGlow"
                    x="-60%"
                    y="-60%"
                    width="220%"
                    height="220%"
                >
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* ring — back half, behind the planet body */}
            <path
                d="M 40 130 C 90 158 210 158 260 130"
                fill="none"
                stroke="url(#ringGradient)"
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.55"
            />

            {/* planet sphere */}
            <image
                href="/assets/svg/Planet 1 3.svg"
                x="70"
                y="60"
                width="150"
                height="110"
                preserveAspectRatio="xMidYMid meet"
            />

            {/* ring — front half, in front of the planet body */}
            <path
                d="M 40 128 C 90 100 210 100 260 128"
                fill="none"
                stroke="url(#ringGradient)"
                strokeWidth="11"
                strokeLinecap="round"
            />
        </svg>
    );
}
