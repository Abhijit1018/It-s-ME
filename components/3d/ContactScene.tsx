"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
  const count = 600;
  const { mouse } = useThree();
  const meshRef = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      sizes[i] = Math.random() * 0.04 + 0.01;
    }
    return { positions, sizes };
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.elapsedTime * 0.03;
    meshRef.current.rotation.x += (mouse.y * 0.05 - meshRef.current.rotation.x) * 0.02;
    meshRef.current.rotation.z += (mouse.x * 0.02 - meshRef.current.rotation.z) * 0.02;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#7B9E87"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.7}
      />
    </points>
  );
}

function EnvelopeForm() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.4) * 0.3;
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.6) * 0.15;
  });

  return (
    <group ref={ref}>
      {/* Envelope body */}
      <mesh castShadow>
        <boxGeometry args={[2, 1.4, 0.05]} />
        <meshPhysicalMaterial
          color="#D4B896"
          roughness={0.3}
          metalness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Envelope flap */}
      <mesh position={[0, 0.4, 0.02]}>
        <coneGeometry args={[1.0, 0.8, 3]} />
        <meshPhysicalMaterial color="#C4847A" roughness={0.4} />
      </mesh>
    </group>
  );
}

export function ContactScene() {
  return (
    <div className="w-full h-full" role="presentation" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={1.2} color="#D4B896" />
          <pointLight position={[-5, -5, 5]} intensity={0.4} color="#7B9E87" />
          <Particles />
          <EnvelopeForm />
        </Suspense>
      </Canvas>
    </div>
  );
}
