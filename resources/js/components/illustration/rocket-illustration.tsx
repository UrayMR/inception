interface RocketIllustrationProps {
    className?: string;
    /** Adds a slow floating animation, default true */
    animate?: boolean;
}

/**
 * RocketIllustration
 * -------------------
 * Original minimalist line-art rocket, colored from the moodboard
 * palette (purple body, gold window/flame). Designed to sit inside
 * AboutSection, e.g. floating beside your copy.
 *
 * Usage:
 *   <div className="relative">
 *     <RocketIllustration className="w-40 md:w-56 absolute -right-4 -top-10" />
 *     <p>... about section copy ...</p>
 *   </div>
 */
export default function RocketIllustration({
    className,
    animate = true,
}: RocketIllustrationProps) {
    return (
        <svg
            viewBox="0 0 200 320"
            className={className}
            style={
                animate
                    ? { animation: 'rocket-float 5s ease-in-out infinite' }
                    : undefined
            }
            role="img"
            aria-label="Ilustrasi roket luar angkasa"
        >
            <defs>
                <linearGradient id="rocketBody" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D9A6FF" />
                    <stop offset="100%" stopColor="#B13BFF" />
                </linearGradient>
                <radialGradient id="rocketFlame" cx="50%" cy="0%" r="80%">
                    <stop offset="0%" stopColor="#FFF4D6" />
                    <stop offset="60%" stopColor="#FFCC00" />
                    <stop offset="100%" stopColor="#FFCC00" stopOpacity="0" />
                </radialGradient>
                <filter
                    id="rocketGlow"
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

            {/* exhaust flame */}
            <ellipse
                cx="100"
                cy="260"
                rx="26"
                ry="55"
                fill="url(#rocketFlame)"
                opacity="0.9"
            />

            {/* fins */}
            <path d="M70 190 L40 240 L74 224 Z" fill="#37005C" />
            <path d="M130 190 L160 240 L126 224 Z" fill="#37005C" />

            {/* body */}
            <path
                d="M100 20
                   C130 55 142 110 138 175
                   L62 175
                   C58 110 70 55 100 20 Z"
                fill="url(#rocketBody)"
                stroke="#37005C"
                strokeWidth="3"
                filter="url(#rocketGlow)"
            />

            {/* nose highlight */}
            <path
                d="M100 20 C118 45 128 75 132 110 L100 110 Z"
                fill="#F7F4E9"
                opacity="0.15"
            />

            {/* window */}
            <circle
                cx="100"
                cy="110"
                r="22"
                fill="#F7F4E9"
                stroke="#37005C"
                strokeWidth="3"
            />
            <circle cx="100" cy="110" r="13" fill="#FFCC00" />

            {/* base ring */}
            <rect x="66" y="172" width="68" height="14" rx="4" fill="#F7F4E9" />
        </svg>
    );
}
