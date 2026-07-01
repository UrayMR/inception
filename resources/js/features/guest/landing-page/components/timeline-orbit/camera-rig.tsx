import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

interface CameraRigProps {
    target: Vector3 | null;

    reset: boolean;
}

export default function CameraRig({ target, reset }: CameraRigProps) {
    const { camera } = useThree();

    const defaultPosition = new Vector3(0, 10, 22);

    const currentTarget = new Vector3();

    useFrame(() => {
        if (reset) {
            camera.position.lerp(defaultPosition, 0.05);

            camera.lookAt(0, 0, 0);

            return;
        }

        if (!target) {
            return;
        }

        const cameraOffset = new Vector3(target.x, target.y + 6, target.z + 12);
        
        camera.position.lerp(cameraOffset, 0.05);

        currentTarget.lerp(target, 0.05);

        camera.lookAt(currentTarget);
    });

    return null;
}
