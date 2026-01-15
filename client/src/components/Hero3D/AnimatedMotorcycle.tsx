import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export const AnimatedMotorcycle: React.FC = () => {
    const bikeRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (bikeRef.current) {
            // Gentle floating animation
            bikeRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

            // Slow rotation
            bikeRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <group ref={bikeRef} position={[2, 0.5, 2]} scale={0.6}>
                {/* Motorcycle Body */}
                <mesh castShadow>
                    <boxGeometry args={[1.5, 0.4, 0.5]} />
                    <meshStandardMaterial color="#E63946" metalness={0.8} roughness={0.2} />
                </mesh>

                {/* Front Wheel */}
                <group position={[0.8, -0.3, 0]}>
                    <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                        <cylinderGeometry args={[0.3, 0.3, 0.15, 16]} />
                        <meshStandardMaterial color="#2B2B2B" metalness={0.5} roughness={0.5} />
                    </mesh>
                </group>

                {/* Rear Wheel */}
                <group position={[-0.8, -0.3, 0]}>
                    <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                        <cylinderGeometry args={[0.3, 0.3, 0.15, 16]} />
                        <meshStandardMaterial color="#2B2B2B" metalness={0.5} roughness={0.5} />
                    </mesh>
                </group>

                {/* Seat */}
                <mesh position={[-0.3, 0.3, 0]} castShadow>
                    <boxGeometry args={[0.8, 0.1, 0.5]} />
                    <meshStandardMaterial color="#1A1A1A" />
                </mesh>

                {/* Handlebars */}
                <mesh position={[0.9, 0.4, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
                    <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
                    <meshStandardMaterial color="#CCCCCC" metalness={0.9} roughness={0.1} />
                </mesh>

                {/* Headlight */}
                <mesh position={[1.1, 0.2, 0]} castShadow>
                    <sphereGeometry args={[0.1, 16, 16]} />
                    <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
                </mesh>

                {/* Light beam */}
                <pointLight position={[1.1, 0.2, 0]} intensity={0.5} distance={5} color="#FFD700" />
            </group>
        </Float>
    );
};

export default AnimatedMotorcycle;
