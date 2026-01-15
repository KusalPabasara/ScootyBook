import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
    count?: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ count = 200 }) => {
    const pointsRef = useRef<THREE.Points>(null);

    // Create particle positions and attributes
    const [positions, velocities, sizes] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            // Random positions in a volume around the scene
            positions[i * 3] = (Math.random() - 0.5) * 20; // x
            positions[i * 3 + 1] = Math.random() * 5; // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z

            // Random velocities for floating effect
            velocities[i * 3] = (Math.random() - 0.5) * 0.02; // x velocity
            velocities[i * 3 + 1] = Math.random() * 0.01 + 0.005; // y velocity (upward)
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02; // z velocity

            // Random sizes
            sizes[i] = Math.random() * 0.05 + 0.02;
        }

        return [positions, velocities, sizes];
    }, [count]);

    // Animate particles
    useFrame(() => {
        if (pointsRef.current && pointsRef.current.geometry) {
            const positionAttribute = pointsRef.current.geometry.getAttribute('position');

            for (let i = 0; i < count; i++) {
                // Update position based on velocity
                positionAttribute.array[i * 3] += velocities[i * 3];
                positionAttribute.array[i * 3 + 1] += velocities[i * 3 + 1];
                positionAttribute.array[i * 3 + 2] += velocities[i * 3 + 2];

                // Reset particle if it goes too high
                if (positionAttribute.array[i * 3 + 1] > 5) {
                    positionAttribute.array[i * 3] = (Math.random() - 0.5) * 20;
                    positionAttribute.array[i * 3 + 1] = 0;
                    positionAttribute.array[i * 3 + 2] = (Math.random() - 0.5) * 20;
                }

                // Boundary check (keep particles in scene)
                if (Math.abs(positionAttribute.array[i * 3]) > 10) {
                    velocities[i * 3] *= -1;
                }
                if (Math.abs(positionAttribute.array[i * 3 + 2]) > 10) {
                    velocities[i * 3 + 2] *= -1;
                }
            }

            positionAttribute.needsUpdate = true;
        }
    });

    // Custom particle material
    const particleMaterial = useMemo(
        () =>
            new THREE.PointsMaterial({
                size: 0.03,
                color: '#FFFFFF',
                transparent: true,
                opacity: 0.6,
                sizeAttenuation: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            }),
        []
    );

    return (
        <points ref={pointsRef} material={particleMaterial}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={sizes.length}
                    array={sizes}
                    itemSize={1}
                />
            </bufferGeometry>
        </points>
    );
};

export default ParticleSystem;
