import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface MovingScooterProps {
    speed?: number;
    height?: number;
}

export const MovingScooter3D: React.FC<MovingScooterProps> = ({
    speed = 1,
    height = 0.5
}) => {
    const scooterRef = useRef<THREE.Group>(null);
    const [direction, setDirection] = useState(1); // 1 for right, -1 for left
    const positionX = useRef(0);

    useFrame((state, delta) => {
        if (scooterRef.current) {
            // Move the scooter horizontally
            positionX.current += direction * speed * delta;

            // Reverse direction at boundaries
            if (positionX.current > 8) {
                setDirection(-1);
                scooterRef.current.rotation.y = Math.PI; // Face left
            } else if (positionX.current < -8) {
                setDirection(1);
                scooterRef.current.rotation.y = 0; // Face right
            }

            scooterRef.current.position.x = positionX.current;

            // Add subtle bounce animation
            scooterRef.current.position.y = height + Math.sin(state.clock.elapsedTime * 3) * 0.1;

            // Rotate wheels
            const wheels = scooterRef.current.children.filter(child =>
                child.userData.isWheel
            );
            wheels.forEach(wheel => {
                wheel.rotation.x += direction * speed * delta * 5;
            });
        }
    });

    return (
        <group ref={scooterRef} position={[0, height, 1]}>
            {/* Main Body */}
            <mesh castShadow position={[0, 0.3, 0]}>
                <boxGeometry args={[1.2, 0.3, 0.4]} />
                <meshStandardMaterial
                    color="#E63946"
                    metalness={0.8}
                    roughness={0.2}
                    emissive="#E63946"
                    emissiveIntensity={0.2}
                />
            </mesh>

            {/* Seat */}
            <mesh castShadow position={[-0.2, 0.6, 0]}>
                <boxGeometry args={[0.5, 0.15, 0.4]} />
                <meshStandardMaterial color="#1A1A1A" roughness={0.6} />
            </mesh>

            {/* Front Panel */}
            <mesh castShadow position={[0.6, 0.5, 0]}>
                <boxGeometry args={[0.2, 0.4, 0.35]} />
                <meshStandardMaterial
                    color="#2B2B2B"
                    metalness={0.6}
                    roughness={0.4}
                />
            </mesh>

            {/* Handlebars */}
            <group position={[0.7, 0.8, 0]}>
                <mesh castShadow rotation={[0, 0, Math.PI / 6]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
                    <meshStandardMaterial color="#CCCCCC" metalness={0.9} roughness={0.1} />
                </mesh>
            </group>

            {/* Front Wheel */}
            <group position={[0.6, -0.05, 0]}>
                <mesh
                    rotation={[0, 0, Math.PI / 2]}
                    castShadow
                    userData={{ isWheel: true }}
                >
                    <cylinderGeometry args={[0.25, 0.25, 0.12, 16]} />
                    <meshStandardMaterial
                        color="#1A1A1A"
                        metalness={0.5}
                        roughness={0.5}
                    />
                </mesh>
                {/* Rim */}
                <mesh rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.15, 0.15, 0.13, 16]} />
                    <meshStandardMaterial color="#CCCCCC" metalness={0.8} roughness={0.2} />
                </mesh>
            </group>

            {/* Rear Wheel */}
            <group position={[-0.6, -0.05, 0]}>
                <mesh
                    rotation={[0, 0, Math.PI / 2]}
                    castShadow
                    userData={{ isWheel: true }}
                >
                    <cylinderGeometry args={[0.25, 0.25, 0.12, 16]} />
                    <meshStandardMaterial
                        color="#1A1A1A"
                        metalness={0.5}
                        roughness={0.5}
                    />
                </mesh>
                {/* Rim */}
                <mesh rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.15, 0.15, 0.13, 16]} />
                    <meshStandardMaterial color="#CCCCCC" metalness={0.8} roughness={0.2} />
                </mesh>
            </group>

            {/* Headlight */}
            <mesh castShadow position={[0.75, 0.5, 0]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial
                    color="#FFD700"
                    emissive="#FFD700"
                    emissiveIntensity={0.8}
                />
            </mesh>

            {/* Headlight beam */}
            <pointLight
                position={[0.85, 0.5, 0]}
                intensity={0.8}
                distance={3}
                color="#FFD700"
                castShadow
            />

            {/* Taillight */}
            <mesh castShadow position={[-0.65, 0.4, 0]}>
                <sphereGeometry args={[0.05, 12, 12]} />
                <meshStandardMaterial
                    color="#FF0000"
                    emissive="#FF0000"
                    emissiveIntensity={0.5}
                />
            </mesh>

            {/* Motion Trail Particles */}
            <MotionTrail direction={direction} />
        </group>
    );
};

// Motion trail effect
const MotionTrail: React.FC<{ direction: number }> = ({ direction }) => {
    const particlesRef = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (particlesRef.current && particlesRef.current.geometry) {
            const positions = particlesRef.current.geometry.getAttribute('position');

            for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                const y = positions.getY(i);
                const z = positions.getZ(i);

                // Move particles backward relative to scooter direction
                positions.setX(i, x - direction * 0.05);

                // Reset particle if it goes too far
                if (Math.abs(x) > 2) {
                    positions.setX(i, 0);
                    positions.setY(i, Math.random() * 0.3 - 0.15);
                    positions.setZ(i, Math.random() * 0.3 - 0.15);
                }
            }

            positions.needsUpdate = true;
        }
    });

    const particles = React.useMemo(() => {
        const count = 20;
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 2;
            positions[i * 3 + 1] = Math.random() * 0.3 - 0.15;
            positions[i * 3 + 2] = Math.random() * 0.3 - 0.15;
        }

        return positions;
    }, []);

    return (
        <points ref={particlesRef} position={[-0.8, 0, 0]}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.length / 3}
                    array={particles}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#FF6B6B"
                transparent
                opacity={0.6}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

export default MovingScooter3D;
