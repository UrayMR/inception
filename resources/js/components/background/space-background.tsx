import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
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
    const [isReady, setIsReady] = useState(false);

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
        const tailGradientCache = new Map<number, CanvasGradient>();
        const shockwaveGradientCache = new WeakMap<
            Shockwave,
            {
                flash?: CanvasGradient;
                wave?: CanvasGradient;
                waveBucket?: number;
            }
        >();

        const MAX_SHOOTING_STARS = 10;
        const MAX_EXPLOSIONS = 100;
        const MAX_SHOCKWAVES = 3;

        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return;
        }

        const getTailGradient = (bucketLen: number) => {
            let grad = tailGradientCache.get(bucketLen);

            if (!grad) {
                grad = ctx.createLinearGradient(-bucketLen, 0, 0, 0);
                grad.addColorStop(0, 'rgba(255, 204, 0, 0)');
                grad.addColorStop(1, 'rgba(255, 244, 214, 1)');
                tailGradientCache.set(bucketLen, grad);
            }

            return grad;
        };

        stateRef.current.prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;

        let animationFrame: number;
        let idleHandle: number;
        let timeoutHandle: number;
        let spawnTimeout: number;
        let resizeTimeout: number;

        // Optimasi 1: Debounce Resize Handler
        const resize = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;

            stateRef.current.width = width;
            stateRef.current.height = height;

            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            stateRef.current.stars = createBackgroundStars(width, height);
        };

        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resize, 150);
        };

        // Helper: cegah shootingStars menumpuk lebih dari MAX_SHOOTING_STARS
        const pushShootingStar = (star: ShootingStar) => {
            if (stateRef.current.shootingStars.length < MAX_SHOOTING_STARS) {
                stateRef.current.shootingStars.push(star);
            }
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

                pushShootingStar(
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

                    pushShootingStar(
                        generateStarData(
                            targetX - Math.cos(a1) * speed1 * steps,
                            targetY - Math.sin(a1) * speed1 * steps,
                            a1,
                            speed1,
                            height,
                            stateRef.current.starIdCounter++,
                        ),
                    );
                    pushShootingStar(
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
                    pushShootingStar(
                        generateStarData(
                            Math.random() * width * 0.3,
                            Math.random() * height * 0.2,
                            angleRight,
                            Math.random() * 3 + 4,
                            height,
                            stateRef.current.starIdCounter++,
                        ),
                    );

                    clearTimeout(spawnTimeout);
                    spawnTimeout = setTimeout(
                        () => {
                            if (stateRef.current.isInView) {
                                pushShootingStar(
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
                time - lastShot > 4000 &&
                Math.random() < 0.15
            ) {
                handleSpawning();
                stateRef.current.lastShot = time;
            }

            // 3. Optimized Collision Detection & Filter (Single Pass)
            const sLen = shootingStars.length;
            const destroyedIds = new Set<number>();

            if (sLen > 1) {
                for (let i = 0; i < sLen; i++) {
                    const s1 = shootingStars[i];

                    if (destroyedIds.has(s1.id) || s1.life >= s1.maxLife) {
                        continue;
                    }

                    for (let j = i + 1; j < sLen; j++) {
                        const s2 = shootingStars[j];

                        if (destroyedIds.has(s2.id) || s2.life >= s2.maxLife) {
                            continue;
                        }

                        const dx = s1.currentX - s2.currentX;
                        const dy = s1.currentY - s2.currentY;

                        // Menggunakan batas jarak kuadrat (256 = 16px radius)
                        if (dx * dx + dy * dy < 256) {
                            const midX = (s1.currentX + s2.currentX) * 0.5;
                            const midY = (s1.currentY + s2.currentY) * 0.5;

                            explosions.push(
                                ...createExplosionParticles(midX, midY),
                            );
                            shockwaves.push(createShockwave(midX, midY));

                            destroyedIds.add(s1.id);
                            destroyedIds.add(s2.id);
                            break; // Lanjut ke bintang berikutnya karena s1 sudah hancur
                        }
                    }
                }
            }

            // Gabungkan filter mati & hancur dalam satu operasi untuk mencegah GC Thrashing
            stateRef.current.shootingStars = shootingStars.filter(
                (s) => s.life < s.maxLife && !destroyedIds.has(s.id),
            );

            // Batasi jumlah explosion & shockwave aktif (safety net anti-lonjakan)
            if (explosions.length > MAX_EXPLOSIONS) {
                explosions.splice(0, explosions.length - MAX_EXPLOSIONS);
            }

            if (shockwaves.length > MAX_SHOCKWAVES) {
                shockwaves.splice(0, shockwaves.length - MAX_SHOCKWAVES);
            }

            // 4. Update & Draw Shooting Stars
            const currentShootingStars = stateRef.current.shootingStars;

            for (let i = 0; i < currentShootingStars.length; i++) {
                const s = currentShootingStars[i];
                const progress = s.life / s.maxLife;
                const opacity =
                    progress < 0.1 ? progress * 10 : (1 - progress) / 0.9;

                s.currentX += s.vx;
                s.currentY += s.vy;

                const angle = Math.atan2(s.vy, s.vx);
                const bucketLen = Math.max(4, Math.round(s.len / 4) * 4); // bucket biar cache-nya reusable
                const grad = getTailGradient(bucketLen);

                // translate+rotate lalu di-undo manual (invers), tanpa save/restore
                ctx.translate(s.currentX, s.currentY);
                ctx.rotate(angle);

                ctx.globalAlpha = opacity;
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(-bucketLen, 0);
                ctx.lineTo(0, 0);
                ctx.stroke();

                ctx.rotate(-angle);
                ctx.translate(-s.currentX, -s.currentY);

                s.life += 1;
            }

            ctx.globalAlpha = 1;

            // 5. Update & Draw Shockwaves (In-place loop backwards)
            for (let i = shockwaves.length - 1; i >= 0; i--) {
                const sw = shockwaves[i];
                sw.radius += sw.speed;
                sw.alpha = 1 - sw.radius / sw.maxRadius;
                sw.flashAlpha -= 0.08;

                if (sw.alpha <= 0) {
                    shockwaves.splice(i, 1);
                    continue;
                }

                let cache = shockwaveGradientCache.get(sw);

                if (!cache) {
                    cache = {};
                    shockwaveGradientCache.set(sw, cache);
                }

                if (sw.flashAlpha > 0) {
                    if (!cache.flash) {
                        cache.flash = ctx.createRadialGradient(
                            sw.x,
                            sw.y,
                            0,
                            sw.x,
                            sw.y,
                            35,
                        );
                        cache.flash.addColorStop(0, 'rgba(255, 255, 255, 1)');
                        cache.flash.addColorStop(
                            0.3,
                            'rgba(255, 217, 102, 0.6)',
                        );
                        cache.flash.addColorStop(1, 'rgba(255, 102, 0, 0)');
                    }

                    ctx.globalAlpha = sw.flashAlpha;
                    ctx.fillStyle = cache.flash;
                    ctx.beginPath();
                    ctx.arc(sw.x, sw.y, 35, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Recreate wave gradient hanya tiap kenaikan radius ~3px, bukan tiap frame
                const bucket = Math.floor(sw.radius / 3) * 3;

                if (!cache.wave || cache.waveBucket !== bucket) {
                    cache.wave = ctx.createRadialGradient(
                        sw.x,
                        sw.y,
                        Math.max(0, bucket - 2),
                        sw.x,
                        sw.y,
                        bucket + 2,
                    );
                    cache.wave.addColorStop(0, 'rgba(255, 255, 255, 0)');
                    cache.wave.addColorStop(0.5, 'rgba(255, 230, 150, 0.8)');
                    cache.wave.addColorStop(1, 'rgba(255, 102, 0, 0)');
                    cache.waveBucket = bucket;
                }

                ctx.globalAlpha = sw.alpha;
                ctx.lineWidth = 3;
                ctx.strokeStyle = cache.wave;
                ctx.beginPath();
                ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
                ctx.stroke();
            }

            ctx.globalAlpha = 1; // reset manual, gantiin restore()

            // 6. Update & Draw Explosions (In-place loop backwards)
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
            window.addEventListener('resize', handleResize, { passive: true });
            animationFrame = requestAnimationFrame(draw);
            setIsReady(true);
        };

        //  Menunggu window benar-benar terisi aset utuh
        const scheduleInit = () => {
            if ('requestIdleCallback' in window) {
                idleHandle = window.requestIdleCallback(init);
            } else {
                timeoutHandle = setTimeout(init, 100);
            }
        };

        if (document.readyState === 'complete') {
            scheduleInit();
        } else {
            window.addEventListener('load', scheduleInit, { once: true });
        }

        // Cleanup total untuk mencegah Memory Leak
        return () => {
            if (idleHandle) {
                window.cancelIdleCallback(idleHandle);
            }

            if (timeoutHandle) {
                clearTimeout(timeoutHandle);
            }

            if (spawnTimeout) {
                clearTimeout(spawnTimeout);
            }

            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }

            cancelAnimationFrame(animationFrame);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('load', scheduleInit);
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
            animate={{ opacity: isReady ? 1 : 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
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
