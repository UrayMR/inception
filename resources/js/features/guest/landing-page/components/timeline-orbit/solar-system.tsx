import { OrbitControls } from '@react-three/drei';

import { Canvas } from '@react-three/fiber';

import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { forwardRef, useImperativeHandle } from 'react';

import { useState } from 'react';
import { Vector3 } from 'three';
import CameraRig from './camera-rig';
import EventPlanet from './event-planet';
import OrbitRing from './orbit-ring';
import Sun from './sun';

interface Event {
    id: number;
    title: string;
    displayDate: string;
    radius: number;
    angle: number;
    color: string;
    size: number;
    defaultPlanet?: boolean;
}

export interface SolarSystemRef {
    next: () => void;
    previous: () => void;
}

const events: Event[] = [
    {
        id: 1,
        title: 'Grand Launching',
        displayDate: '9 Mei 2026',
        radius: 4,
        angle: 290,
        color: '#a16207',
        size: 0.35,
        defaultPlanet: true,
    },
    {
        id: 2,
        title: 'Academy Registration',
        displayDate: '10 Juni 2026',
        radius: 6,
        angle: 20,
        color: '#14b8a6',
        size: 0.4,
    },
    {
        id: 3,
        title: 'Competition Registration',
        displayDate: '17 Juni 2026',
        radius: 8,
        angle: 95,
        color: '#f59e0b',
        size: 0.45,
    },
    {
        id: 4,
        title: 'Xcelerate Foundations',
        displayDate: '20 Juni 2026',
        radius: 10,
        angle: 185,
        color: '#f43f5e',
        size: 0.5,
    },
    {
        id: 5,
        title: 'Main Awarding Night',
        displayDate: '15 Agustus 2026',
        radius: 12,
        angle: 330,
        color: '#6366f1',
        size: 0.6,
    },
];

const SolarSystem = forwardRef<SolarSystemRef>((_, ref) => {
    useImperativeHandle(ref, () => ({
        next: onNextPlanet,
        previous: onPreviousPlanet,
    }));

    const defaultEvent = events.find((event) => event.defaultPlanet)!;

    const getPosition = (event: Event) => {
        const rad = (event.angle * Math.PI) / 180;

        return new Vector3(
            Math.cos(rad) * event.radius,
            0,
            Math.sin(rad) * event.radius,
        );
    };

    const [focusedId, setFocusedId] = useState<number | null>(defaultEvent.id);

    const [focusedPlanet, setFocusedPlanet] = useState<Vector3 | null>(
        getPosition(defaultEvent),
    );

    const focusEvent = (event: Event) => {
        setFocusedId(event.id);
        setFocusedPlanet(getPosition(event));
    };

    const currentIndex = events.findIndex((e) => e.id === focusedId);

    const onNextPlanet = () => {
        const next = events[(currentIndex + 1) % events.length];

        focusEvent(next);
    };

    const onPreviousPlanet = () => {
        const prev = events[(currentIndex - 1 + events.length) % events.length];

        focusEvent(prev);
    };

    return (
        <Canvas
            gl={{
                alpha: true,
                antialias: true,
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
            <pointLight position={[0, 0, 0]} intensity={40} color="#9333ea" />
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
            <EffectComposer>
                <Bloom mipmapBlur intensity={0.3} luminanceThreshold={0.6} />
            </EffectComposer>
        </Canvas>
    );
});

export default SolarSystem;
