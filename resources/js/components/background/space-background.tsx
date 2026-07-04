import { useEffect, useRef } from 'react';

/**
 * SpaceBackground
 * ----------------
 * Drop this ONCE inside your root layout (e.g. AppLayout), as the very
 * first child, wrapped in a `position: relative` container. It renders:
 *   1. A canvas starfield with gentle parallax twinkle
 *   2. Two soft nebula glow blobs (purple + gold) that drift slowly
 *   3. Occasional shooting stars (matches the streaks in the moodboard)
 *
 * It's fixed/absolute + pointer-events:none, so it never blocks clicks
 * and sits behind your normal page content (z-index: 0 vs your content
 * at z-index: 10+).
 *
 * Colors are pulled from CSS variables so you only ever edit them in
 * one place (see space-theme.css).
 */
export default function SpaceBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return;
        }

        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;

        let width = 0;
        let height = 0;
        let stars: {
            x: number;
            y: number;
            r: number;
            twinkleSpeed: number;
            phase: number;
        }[] = [];
        let shootingStars: {
            x: number;
            y: number;
            len: number;
            speed: number;
            life: number;
            maxLife: number;
        }[] = [];
        let animationFrame: number;
        let lastShot = 0;

        const resize = () => {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

            const density = Math.min(180, Math.floor((width * height) / 6000));
            stars = Array.from({ length: density }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 1.3 + 0.3,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                phase: Math.random() * Math.PI * 2,
            }));
        };

        const spawnShootingStar = () => {
            shootingStars.push({
                x: Math.random() * width * 0.7 + width * 0.15,
                y: Math.random() * height * 0.3,
                len: Math.random() * 90 + 60,
                speed: Math.random() * 6 + 6,
                life: 0,
                maxLife: 40,
            });
        };

        const draw = (time: number) => {
            ctx.clearRect(0, 0, width, height);

            // stars
            for (const s of stars) {
                const twinkle = prefersReducedMotion
                    ? 1
                    : 0.55 + 0.45 * Math.sin(time * s.twinkleSpeed + s.phase);
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(247, 244, 233, ${twinkle})`;
                ctx.fill();
            }

            // shooting stars
            if (
                !prefersReducedMotion &&
                time - lastShot > 3500 &&
                Math.random() < 0.02
            ) {
                spawnShootingStar();
                lastShot = time;
            }

            shootingStars = shootingStars.filter((s) => s.life < s.maxLife);

            for (const s of shootingStars) {
                const progress = s.life / s.maxLife;
                const opacity =
                    progress < 0.15
                        ? progress / 0.15
                        : 1 - (progress - 0.15) / 0.85;
                const headX = s.x + s.speed * s.life;
                const headY = s.y + s.speed * s.life * 0.4;
                const grad = ctx.createLinearGradient(
                    headX - s.len,
                    headY - s.len * 0.4,
                    headX,
                    headY,
                );
                grad.addColorStop(0, 'rgba(255, 204, 0, 0)');
                grad.addColorStop(1, `rgba(255, 244, 214, ${opacity})`);
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                ctx.moveTo(headX - s.len, headY - s.len * 0.4);
                ctx.lineTo(headX, headY);
                ctx.stroke();
                s.life += 1;
            }

            animationFrame = requestAnimationFrame(draw);
        };

        resize();
        window.addEventListener('resize', resize);
        animationFrame = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <div
            aria-hidden="true"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
            }}
        >
            {/*
              Nebula glow blobs now live PER SECTION via <SectionNebula />
              (see section-nebula.tsx), so each section can have its own
              color/position and the page doesn't feel static while
              scrolling. This layer only keeps the shared starfield +
              shooting stars, consistent across the whole site.
            */}
            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%', display: 'block' }}
            />
        </div>
    );
}
