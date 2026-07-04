import type {
    BackgroundStar,
    ShootingStar,
    ExplosionParticle,
    Shockwave,
} from '@/types';

export const createBackgroundStars = (
    width: number,
    height: number,
): BackgroundStar[] => {
    const density = Math.min(120, Math.floor((width * height) / 8000));

    return Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        phase: Math.random() * Math.PI * 2,
    }));
};

export const generateStarData = (
    startX: number,
    startY: number,
    angleRad: number,
    speed: number,
    height: number,
    idCounter: number,
): ShootingStar => {
    const vx = Math.cos(angleRad) * speed;
    const vy = Math.sin(angleRad) * speed;

    const distanceToBottom = height - startY;
    const estimatedLife = Math.ceil(distanceToBottom / vy) + 20;

    return {
        id: idCounter,
        currentX: startX,
        currentY: startY,
        vx,
        vy,
        len: Math.random() * 70 + 60,
        life: 0,
        maxLife: Math.max(estimatedLife, 180),
    };
};

export const createExplosionParticles = (
    x: number,
    y: number,
): ExplosionParticle[] => {
    const particleCount = 50;
    const colors = ['#ffffff', '#ffe680', '#ffcc00', '#ff6600', '#ff3300'];
    const particles: ExplosionParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
        const baseAngle = Math.random() < 0.5 ? 0 : Math.PI;
        const angle = baseAngle + (Math.random() - 0.5) * 1.2;

        let speed = 0;
        const rand = Math.random();

        if (rand < 0.2) {
            speed = Math.random() * 6 + 4;
        } else if (rand < 0.8) {
            speed = Math.random() * 3 + 1.5;
        } else {
            speed = Math.random() * 0.8 + 0.2;
        }

        const baseRadius = speed > 4 ? 0.5 : 1.2;
        const r = Math.random() * 1.5 + baseRadius;

        particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            r,
            alpha: 1,
            color:
                speed > 3.5
                    ? colors[Math.floor(Math.random() * 3)]
                    : colors[Math.floor(Math.random() * colors.length)],
            friction: speed > 4 ? 0.97 : 0.93,
            decay: Math.random() * 0.012 + 0.012,
        });
    }

    return particles;
};

export const createShockwave = (x: number, y: number): Shockwave => {
    return {
        x,
        y,
        radius: 2,
        maxRadius: Math.random() * 90 + 70,
        alpha: 1,
        speed: 4,
        flashAlpha: 1.5,
    };
};
