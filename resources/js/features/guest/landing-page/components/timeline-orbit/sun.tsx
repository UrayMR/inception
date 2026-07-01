import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

export default function Sun() {
    const ref = useRef<Mesh>(null);

    useFrame(() => {
        if (!ref.current) {
return;
}

        ref.current.rotation.y += 0.003;
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[1.3, 64, 64]} />

            <meshStandardMaterial
                color="#ffffff"
                emissive="#9333ea"
                emissiveIntensity={4}
            />
        </mesh>
    );
}
