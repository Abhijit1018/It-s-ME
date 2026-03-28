"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

function GeometricForm() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, mouse } = useThree();

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.15;
    meshRef.current.rotation.y = clock.elapsedTime * 0.2;

    // Lerped mouse parallax
    const targetX = (mouse.x * viewport.width) / 2 * 0.05;
    const targetY = (mouse.y * viewport.height) / 2 * 0.05;
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.05;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial
          color="#7B9E87"
          roughness={0.15}
          metalness={0.4}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Inner wireframe */}
      <mesh>
        <icosahedronGeometry args={[1.52, 1]} />
        <meshBasicMaterial
          color="#D4B896"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
    </Float>
  );
}

function ShadowPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <shadowMaterial transparent opacity={0.15} />
    </mesh>
  );
}

export function HeroModel() {
  return (
    <div
      className="w-full h-full"
      role="presentation"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        shadows="percentage"
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-3, 2, -3]} intensity={0.4} color="#D4B896" />

          <GeometricForm />
          <ShadowPlane />

          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
