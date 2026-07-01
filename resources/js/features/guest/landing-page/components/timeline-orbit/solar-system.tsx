import { OrbitControls } from '@react-three/drei';

import { Canvas } from '@react-three/fiber';

import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { forwardRef, useImperativeHandle } from 'react';

import { useState } from 'react';
import { Vector3 } from 'three';
import type { TimelineEvent } from '@/types';
import CameraRig from './camera-rig';
import EventPlanet from './event-planet';
import OrbitRing from './orbit-ring';
import Sun from './sun';

export interface SolarSystemRef {
    next: () => void;
    previous: () => void;
}

export interface SolarSystemProps {
    events: TimelineEvent[];
}

const SolarSystem = forwardRef<SolarSystemRef, SolarSystemProps>(
    ({ events }, ref) => {
        useImperativeHandle(ref, () => ({
            next: onNextPlanet,
            previous: onPreviousPlanet,
        }));

        const defaultEvent = events.find((event) => event.defaultPlanet)!;

        const getPosition = (event: TimelineEvent) => {
            const rad = (event.angle * Math.PI) / 180;

            return new Vector3(
                Math.cos(rad) * event.radius,
                0,
                Math.sin(rad) * event.radius,
            );
        };

        const [focusedId, setFocusedId] = useState<number | null>(
            defaultEvent.id,
        );

        const [focusedPlanet, setFocusedPlanet] = useState<Vector3 | null>(
            getPosition(defaultEvent),
        );

        const focusEvent = (event: TimelineEvent) => {
            setFocusedId(event.id);
            setFocusedPlanet(getPosition(event));
        };

        const currentIndex = events.findIndex((e) => e.id === focusedId);

        const onNextPlanet = () => {
            const next = events[(currentIndex + 1) % events.length];

            focusEvent(next);
        };

        const onPreviousPlanet = () => {
            const prev =
                events[(currentIndex - 1 + events.length) % events.length];

            focusEvent(prev);
        };

        // const [isMobile, setIsMobile] = useState(false);

        // useEffect(() => {
        //     const checkMobile = () => setIsMobile(window.innerWidth < 768);
        //     checkMobile();
        //     window.addEventListener('resize', checkMobile);

        //     return () => window.removeEventListener('resize', checkMobile);
        // }, []);

        return (
            <Canvas
                dpr={[1, 1.5]}
                gl={{
                    alpha: true,
                    antialias: true,
                    powerPreference: 'high-performance',
                }}
                style={{
                    background: 'transparent',
                }}
                camera={{
                    position: [0, 10, 22],
                    fov: 40,
                }}
            >
                <CameraRig target={focusedPlanet} reset={!focusedPlanet} />
                <ambientLight intensity={0.4} />
                <pointLight
                    position={[0, 0, 0]}
                    intensity={40}
                    color="#9333ea"
                />
                <Sun />
                {events.map((event) => (
                    <group key={event.title}>
                        <OrbitRing radius={event.radius} />

                        <EventPlanet
                            {...event}
                            focused={focusedId === event.id}
                            onFocus={(id) => {
                                const event = events.find((e) => e.id === id)!;

                                if (focusedId === id) {
                                    return;
                                }

                                focusEvent(event);
                            }}
                        />
                    </group>
                ))}
                <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    enableDamping
                    dampingFactor={0.05}
                />
                {/* {!isMobile && ( */}
                <EffectComposer>
                    <Bloom
                        mipmapBlur
                        intensity={0.3}
                        luminanceThreshold={0.6}
                    />
                </EffectComposer>
                {/* )} */}
            </Canvas>
        );
    },
);

export default SolarSystem;
