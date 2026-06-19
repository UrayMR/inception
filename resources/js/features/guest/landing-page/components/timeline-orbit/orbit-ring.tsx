import { useMemo } from 'react';
import * as THREE from 'three';

export default function OrbitRing({ radius }: { radius: number }) {
    const geometry = useMemo(() => {
        const curve = new THREE.EllipseCurve(
            0,
            0,
            radius,
            radius,
            0,
            Math.PI * 2,
        );

        const points = curve.getPoints(256);

        return new THREE.BufferGeometry().setFromPoints(
            points.map((p) => new THREE.Vector3(p.x, 0, p.y)),
        );
    }, [radius]);

    return (
        <line geometry={geometry}>
            <lineBasicMaterial color="#2a3152" transparent opacity={0.35} />
        </line>
    );
}
