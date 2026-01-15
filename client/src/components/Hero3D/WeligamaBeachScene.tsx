import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const WeligamaBeachScene: React.FC = () => {
    return (
        <group>
            {/* Ocean */}
            <Ocean />

            {/* Sand/Beach */}
            <Beach />

            {/* Palm Trees */}
            <PalmTrees />

            {/* Stilt Fishermen (iconic Weligama landmark) */}
            <StiltFishermen />

            {/* Waves */}
            <Waves />
        </group>
    );
};

// Animated Ocean
const Ocean: React.FC = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
        }
    });

    return (
        <mesh
            ref={meshRef}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.5, 0]}
            receiveShadow
        >
            <planeGeometry args={[100, 100, 32, 32]} />
            <MeshReflectorMaterial
                blur={[300, 100]}
                resolution={2048}
                mixBlur={1}
                mixStrength={40}
                roughness={1}
                depthScale={1.2}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                color="#0EA5E9"
                metalness={0.5}
                mirror={0.5}
            />
        </mesh>
    );
};

// Beach/Sand
const Beach: React.FC = () => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 5]} receiveShadow>
            <planeGeometry args={[50, 20]} />
            <meshStandardMaterial color="#F5DEB3" roughness={0.8} />
        </mesh>
    );
};

// Palm Trees
const PalmTrees: React.FC = () => {
    const positions = [
        [-8, 0, 3],
        [-6, 0, 4],
        [7, 0, 2],
        [9, 0, 3.5],
    ];

    return (
        <>
            {positions.map((position, index) => (
                <PalmTree key={index} position={position as [number, number, number]} />
            ))}
        </>
    );
};

// Single Palm Tree
const PalmTree: React.FC<{ position: [number, number, number] }> = ({ position }) => {
    const trunkRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (trunkRef.current) {
            trunkRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
        }
    });

    return (
        <group position={position}>
            {/* Trunk */}
            <mesh ref={trunkRef} castShadow>
                <cylinderGeometry args={[0.15, 0.2, 4, 8]} />
                <meshStandardMaterial color="#8B4513" roughness={0.9} />
            </mesh>

            {/* Palm Leaves */}
            <group position={[0, 2.5, 0]}>
                {[...Array(8)].map((_, i) => (
                    <Float key={i} speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
                        <mesh
                            rotation={[0, (Math.PI * 2 * i) / 8, Math.PI / 6]}
                            position={[0, 0, 0]}
                            castShadow
                        >
                            <boxGeometry args={[0.1, 2, 0.3]} />
                            <meshStandardMaterial color="#228B22" side={THREE.DoubleSide} />
                        </mesh>
                    </Float>
                ))}
            </group>
        </group>
    );
};

// Stilt Fishermen (iconic Weligama landmark)
const StiltFishermen: React.FC = () => {
    const positions = [
        [-15, -0.3, -5],
        [-12, -0.3, -6],
        [-18, -0.3, -4],
    ];

    return (
        <>
            {positions.map((position, index) => (
                <StiltFisherman key={index} position={position as [number, number, number]} delay={index * 0.5} />
            ))}
        </>
    );
};

// Single Stilt Fisherman
const StiltFisherman: React.FC<{ position: [number, number, number]; delay: number }> = ({ position, delay }) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 + delay) * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Stilt */}
            <mesh castShadow>
                <cylinderGeometry args={[0.05, 0.05, 2, 6]} />
                <meshStandardMaterial color="#654321" />
            </mesh>

            {/* Seat */}
            <mesh position={[0, 1.2, 0]} castShadow>
                <boxGeometry args={[0.3, 0.1, 0.3]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>

            {/* Fisherman (simplified) */}
            <mesh position={[0, 1.6, 0]} castShadow>
                <capsuleGeometry args={[0.15, 0.6, 4, 8]} />
                <meshStandardMaterial color="#D2691E" />
            </mesh>
        </group>
    );
};

// Animated Waves
const Waves: React.FC = () => {
    const waveRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (waveRef.current && waveRef.current.geometry) {
            const positionAttribute = waveRef.current.geometry.getAttribute('position');
            const time = state.clock.elapsedTime;

            for (let i = 0; i < positionAttribute.count; i++) {
                const x = positionAttribute.getX(i);
                const z = positionAttribute.getZ(i);
                const y = Math.sin(x * 0.5 + time) * 0.1 + Math.cos(z * 0.3 + time * 0.5) * 0.1;
                positionAttribute.setY(i, y);
            }

            positionAttribute.needsUpdate = true;
        }
    });

    return (
        <mesh ref={waveRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, -10]}>
            <planeGeometry args={[80, 40, 64, 32]} />
            <meshStandardMaterial
                color="#0EA5E9"
                transparent
                opacity={0.6}
                wireframe={false}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

export default WeligamaBeachScene;
