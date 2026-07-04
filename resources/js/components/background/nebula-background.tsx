type NebulaSpot = {
    /** CSS color, ideally one of the moodboard tokens e.g. 'var(--space-purple)' */
    color: string;
    /** Position from the edges of the section, any valid CSS length */
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    /** Size of the glow, e.g. '40vw' */
    size?: string;
    /** 0–1, defaults to 0.5 */
    intensity?: number;
    /** Animation variant, alternate between sections so drift timing differs */
    drift?: 'a' | 'b' | 'none';
};

interface NebulaBackgroundProps {
    spots: NebulaSpot[];
    /** Optional extra className to size/position the wrapper if needed */
    className?: string;
}

/**
 * SectionNebula
 * -------------
 * Renders 1–3 glow blobs scoped to whatever section wraps it.
 *
 * IMPORTANT — for the glow to bleed naturally into neighboring
 * sections (instead of getting clipped in a hard box), the parent
 * <section> must NOT use `overflow-hidden`. Use `overflow-x-hidden`
 * only once, on the top-level page wrapper, to avoid a horizontal
 * scrollbar — never on individual sections. `position: relative` on
 * the section is still needed (so this component's `inset: 0` has
 * something to size against), just leave overflow at its default
 * (visible).
 *
 * Usage — put it as the FIRST child inside a `relative` <section>,
 * content after it should have `relative z-10` so it stays above the glow:
 *
 *   <section className="relative">
 *     <SectionNebula spots={[
 *       { color: 'var(--space-purple)', top: '-10%', left: '-8%', size: '45vw' },
 *       { color: 'var(--space-gold)', bottom: '-15%', right: '-10%', size: '35vw', intensity: 0.35 },
 *     ]} />
 *     <div className="relative z-10">... your existing section content ...</div>
 *   </section>
 *
 * Each section should use a DIFFERENT combination of color/position/size
 * so the page doesn't feel repetitive while scrolling. Suggested per
 * section (matches the "journey through space" narrative):
 *
 *   Hero        purple left + gold right   (launch pad, two engines)
 *   About       single gold top-right      (sun rising, rocket ascends)
 *   Competition purple scattered, smaller  (asteroid field)
 *   Timeline    deep purple long strip     (orbit path)
 *   Faq         single soft cream/purple   (calm, quiet nebula)
 *   Cta         bright gold center burst   (wormhole / arrival)
 */
export default function NebulaBackground({
    spots,
    className,
}: NebulaBackgroundProps) {
    return (
        <div
            aria-hidden="true"
            className={className}
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none',
            }}
        >
            {spots.map((spot, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        top: spot.top,
                        bottom: spot.bottom,
                        left: spot.left,
                        right: spot.right,
                        width: spot.size ?? '40vw',
                        height: spot.size ?? '40vw',
                        background: `radial-gradient(circle, color-mix(in srgb, ${spot.color} ${Math.round(
                            (spot.intensity ?? 0.5) * 100,
                        )}%, transparent) 0%, transparent 70%)`,
                        filter: 'blur(60px)',
                        animation:
                            spot.drift === 'none'
                                ? undefined
                                : `nebula-drift-${spot.drift ?? 'a'} ${
                                      spot.drift === 'b' ? 32 : 26
                                  }s ease-in-out infinite`,
                    }}
                />
            ))}
        </div>
    );
}
