export interface BackgroundStar {
    x: number;
    y: number;
    r: number;
    twinkleSpeed: number;
    phase: number;
}

export interface ShootingStar {
    id: number;
    currentX: number;
    currentY: number;
    vx: number;
    vy: number;
    len: number;
    life: number;
    maxLife: number;
}

export interface ExplosionParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    alpha: number;
    color: string;
    friction: number; 
    decay: number;
}

export interface Shockwave {
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    alpha: number;
    speed: number;
    flashAlpha: number;
}
