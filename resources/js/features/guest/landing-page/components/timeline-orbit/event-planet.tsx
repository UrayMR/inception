import { Html } from '@react-three/drei';
import { useMemo, useState } from 'react';

interface EventPlanetProps {
    id: number;
    title: string;
    displayDate: string;
    radius: number;
    angle: number;
    color: string;
    focused: boolean;
    onFocus: (id: number, position: [number, number, number]) => void;
}

export default function EventPlanet({
    id,
    title,
    displayDate,
    radius,
    angle,
    color,
    focused,
    onFocus,
}: EventPlanetProps) {
    const [hovered, setHovered] = useState(false);

    const position = useMemo(() => {
        const rad = (angle * Math.PI) / 180;

        return [Math.cos(rad) * radius, 0, Math.sin(rad) * radius] as [
            number,
            number,
            number,
        ];
    }, [angle, radius]);

    const showLabel = hovered || focused;

    return (
        <group position={position}>
            <mesh
                scale={focused || hovered ? 1.25 : 1}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={() => onFocus(id, position)}
            >
                <sphereGeometry args={[0.25, 32, 32]} />

                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={
                        focused ? 6 : hovered ? 6 : 1
                    }
                />
            </mesh>

            {showLabel && (
                <Html
                    center
                    distanceFactor={focused ? 10 : 15}
                    position={[0, 2.0, 0]}
                    scale={focused ? 1.15 : 1}
                >
                    <div className="w-56 rounded-2xl border border-purple-500/40 bg-[#050024]/95 p-4 text-center backdrop-blur-xl">
                        <div className="text-base font-bold text-white">
                            {title}
                        </div>

                        <div className="mt-2 text-sm text-gray-400">
                            {displayDate}
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
}
