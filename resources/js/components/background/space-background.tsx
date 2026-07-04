import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import {
    createBackgroundStars,
    generateStarData,
    createExplosionParticles,
    createShockwave,
} from '@/helpers/space-utils';
import type {
    BackgroundStar,
    ShootingStar,
    ExplosionParticle,
    Shockwave,
} from '@/types';

export default function SpaceBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const stateRef = useRef({
        isInView: false,
        width: 0,
        height: 0,
        stars: [] as BackgroundStar[],
        shootingStars: [] as ShootingStar[],
        explosions: [] as ExplosionParticle[],
        shockwaves: [] as Shockwave[],
        lastShot: 0,
        starIdCounter: 0,
        prefersReducedMotion: false,
    });

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return;
        }

        stateRef.current.prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;

        let animationFrame: number;

        const resize = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;

            stateRef.current.width = width;
            stateRef.current.height = height;

            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;

            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            stateRef.current.stars = createBackgroundStars(width, height);
        };

        const handleSpawning = () => {
            const { width, height } = stateRef.current;
            const randScenario = Math.random();
            const angleRight = Math.random() * 0.8 + 0.3;
            const angleLeft = Math.random() * 0.8 + 2.0;

            if (randScenario < 0.6) {
                const isLeft = Math.random() < 0.5;
                const startX = isLeft
                    ? Math.random() * width * 0.4
                    : width - Math.random() * width * 0.4;
                const startY = Math.random() * height * 0.3;
                const angle = isLeft ? angleRight : angleLeft;
                const speed = Math.random() * 3 + 4;

                stateRef.current.shootingStars.push(
                    generateStarData(
                        startX,
                        startY,
                        angle,
                        speed,
                        height,
                        stateRef.current.starIdCounter++,
                    ),
                );
            } else {
                if (Math.random() < 0.25) {
                    const targetX = width * (Math.random() * 0.4 + 0.3);
                    const targetY = height * (Math.random() * 0.4 + 0.3);
                    const speed1 = Math.random() * 2 + 4;
                    const speed2 = Math.random() * 2 + 4;
                    const a1 = Math.random() * 0.5 + 0.4;
                    const a2 = Math.random() * 0.5 + 2.2;
                    const steps = 80;

                    stateRef.current.shootingStars.push(
                        generateStarData(
                            targetX - Math.cos(a1) * speed1 * steps,
                            targetY - Math.sin(a1) * speed1 * steps,
                            a1,
                            speed1,
                            height,
                            stateRef.current.starIdCounter++,
                        ),
                        generateStarData(
                            targetX - Math.cos(a2) * speed2 * steps,
                            targetY - Math.sin(a2) * speed2 * steps,
                            a2,
                            speed2,
                            height,
                            stateRef.current.starIdCounter++,
                        ),
                    );
                } else {
                    stateRef.current.shootingStars.push(
                        generateStarData(
                            Math.random() * width * 0.3,
                            Math.random() * height * 0.2,
                            angleRight,
                            Math.random() * 3 + 4,
                            height,
                            stateRef.current.starIdCounter++,
                        ),
                    );

                    setTimeout(
                        () => {
                            if (stateRef.current.isInView) {
                                stateRef.current.shootingStars.push(
                                    generateStarData(
                                        stateRef.current.width -
                                            Math.random() *
                                                stateRef.current.width *
                                                0.3,
                                        Math.random() *
                                            stateRef.current.height *
                                            0.2,
                                        angleLeft,
                                        Math.random() * 3 + 4,
                                        stateRef.current.height,
                                        stateRef.current.starIdCounter++,
                                    ),
                                );
                            }
                        },
                        Math.random() * 600 + 300,
                    );
                }
            }
        };

        const draw = (time: number) => {
            animationFrame = requestAnimationFrame(draw);

            if (!stateRef.current.isInView) {
                return;
            }

            const { width, height, stars, prefersReducedMotion, lastShot } =
                stateRef.current;
            const { shootingStars, explosions, shockwaves } = stateRef.current;

            ctx.clearRect(0, 0, width, height);

            // 1. Draw Background Stars
            const len = stars.length;

            for (let i = 0; i < len; i++) {
                const s = stars[i];
                const twinkle = prefersReducedMotion
                    ? 1
                    : 0.55 + 0.45 * Math.sin(time * s.twinkleSpeed + s.phase);
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(247, 244, 233, ${twinkle})`;
                ctx.fill();
            }

            // 2. Spawning Logic
            if (
                !prefersReducedMotion &&
                time - lastShot > 2000 &&
                Math.random() < 0.15
            ) {
                handleSpawning();
                stateRef.current.lastShot = time;
            }

            // 3. Collision Detection
            const sLen = shootingStars.length;

            if (sLen > 1) {
                const destroyedIds = new Set<number>();

                for (let i = 0; i < sLen; i++) {
                    for (let j = i + 1; j < sLen; j++) {
                        const s1 = shootingStars[i];
                        const s2 = shootingStars[j];

                        if (
                            destroyedIds.has(s1.id) ||
                            destroyedIds.has(s2.id)
                        ) {
                            continue;
                        }

                        const dx = s1.currentX - s2.currentX;
                        const dy = s1.currentY - s2.currentY;

                        if (dx * dx + dy * dy < 256) {
                            const midX = (s1.currentX + s2.currentX) * 0.5;
                            const midY = (s1.currentY + s2.currentY) * 0.5;

                            explosions.push(
                                ...createExplosionParticles(midX, midY),
                            );
                            shockwaves.push(createShockwave(midX, midY));

                            destroyedIds.add(s1.id);
                            destroyedIds.add(s2.id);
                        }
                    }
                }

                stateRef.current.shootingStars = shootingStars.filter(
                    (s) => s.life < s.maxLife && !destroyedIds.has(s.id),
                );
            } else {
                stateRef.current.shootingStars = shootingStars.filter(
                    (s) => s.life < s.maxLife,
                );
            }

            // 4. Update & Draw Shooting Stars
            for (let i = 0; i < stateRef.current.shootingStars.length; i++) {
                const s = stateRef.current.shootingStars[i];
                const progress = s.life / s.maxLife;
                const opacity =
                    progress < 0.1 ? progress * 10 : (1 - progress) / 0.9;

                s.currentX += s.vx;
                s.currentY += s.vy;

                const angle = Math.atan2(s.vy, s.vx);
                const tailX = s.currentX - Math.cos(angle) * s.len;
                const tailY = s.currentY - Math.sin(angle) * s.len;

                const grad = ctx.createLinearGradient(
                    tailX,
                    tailY,
                    s.currentX,
                    s.currentY,
                );
                grad.addColorStop(0, 'rgba(255, 204, 0, 0)');
                grad.addColorStop(1, `rgba(255, 244, 214, ${opacity})`);

                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(tailX, tailY);
                ctx.lineTo(s.currentX, s.currentY);
                ctx.stroke();
                s.life += 1;
            }

            // 5. Update & Draw Shockwaves
            for (let i = shockwaves.length - 1; i >= 0; i--) {
                const sw = shockwaves[i];
                sw.radius += sw.speed;
                sw.alpha = 1 - sw.radius / sw.maxRadius;
                sw.flashAlpha -= 0.08;

                if (sw.alpha <= 0) {
                    shockwaves.splice(i, 1);
                    continue;
                }

                ctx.save();

                if (sw.flashAlpha > 0) {
                    const flashGrad = ctx.createRadialGradient(
                        sw.x,
                        sw.y,
                        0,
                        sw.x,
                        sw.y,
                        35,
                    );
                    flashGrad.addColorStop(
                        0,
                        `rgba(255, 255, 255, ${sw.flashAlpha})`,
                    );
                    flashGrad.addColorStop(
                        0.3,
                        `rgba(255, 217, 102, ${sw.flashAlpha * 0.6})`,
                    );
                    flashGrad.addColorStop(1, 'rgba(255, 102, 0, 0)');
                    ctx.fillStyle = flashGrad;
                    ctx.beginPath();
                    ctx.arc(sw.x, sw.y, 35, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.globalAlpha = sw.alpha;
                ctx.lineWidth = 3;

                const waveGrad = ctx.createRadialGradient(
                    sw.x,
                    sw.y,
                    sw.radius - 2,
                    sw.x,
                    sw.y,
                    sw.radius + 2,
                );
                waveGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
                waveGrad.addColorStop(0.5, 'rgba(255, 230, 150, 0.8)');
                waveGrad.addColorStop(1, 'rgba(255, 102, 0, 0)');

                ctx.strokeStyle = waveGrad;
                ctx.beginPath();
                ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }

            // 6. Update & Draw Explosions
            for (let i = explosions.length - 1; i >= 0; i--) {
                const p = explosions[i];
                p.vx *= p.friction;
                p.vy *= p.friction;
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= p.decay;

                if (p.alpha <= 0) {
                    explosions.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();
            }

            ctx.globalAlpha = 1;
        };

        const init = () => {
            resize();
            window.addEventListener('resize', resize, { passive: true });
            animationFrame = requestAnimationFrame(draw);
        };

        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(init);
        } else {
            setTimeout(init, 100);
        }

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <motion.div
            aria-hidden="true"
            onViewportEnter={() => {
                stateRef.current.isInView = true;
            }}
            onViewportLeave={() => {
                stateRef.current.isInView = false;
            }}
            viewport={{ amount: 0.05 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} // Biarkan framer-motion yang handle transisi visual tanpa reset context canvas
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
            }}
        >
            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%', display: 'block' }}
            />
        </motion.div>
    );
}
