"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
  const count = 500;
  const { mouse } = useThree();
  const meshRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.elapsedTime * 0.025;
    meshRef.current.rotation.x += (mouse.y * 0.04 - meshRef.current.rotation.x) * 0.02;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#7B9E87" size={0.04} sizeAttenuation transparent opacity={0.6} />
    </points>
  );
}

function Envelope() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.35;
    group.current.position.y = Math.sin(clock.elapsedTime * 0.7) * 0.18;
  });

  // Build envelope flap as a custom triangle shape
  const flapShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1.0, 0);
    shape.lineTo(1.0, 0);
    shape.lineTo(0, 0.85);
    shape.closePath();
    return shape;
  }, []);

  const flapGeo = useMemo(() => new THREE.ShapeGeometry(flapShape), [flapShape]);

  // Bottom V fold
  const bottomShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1.0, 0);
    shape.lineTo(1.0, 0);
    shape.lineTo(0, -0.65);
    shape.closePath();
    return shape;
  }, []);
  const bottomGeo = useMemo(() => new THREE.ShapeGeometry(bottomShape), [bottomShape]);

  // Left fold
  const leftShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1.0, 0.7);
    shape.lineTo(-1.0, -0.7);
    shape.lineTo(0, 0);
    shape.closePath();
    return shape;
  }, []);
  const leftGeo = useMemo(() => new THREE.ShapeGeometry(leftShape), [leftShape]);

  // Right fold
  const rightShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(1.0, 0.7);
    shape.lineTo(1.0, -0.7);
    shape.lineTo(0, 0);
    shape.closePath();
    return shape;
  }, []);
  const rightGeo = useMemo(() => new THREE.ShapeGeometry(rightShape), [rightShape]);

  const bodyMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#D4B896",
    roughness: 0.35,
    metalness: 0.15,
    side: THREE.DoubleSide,
  }), []);

  const flapMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#C4A07A",
    roughness: 0.4,
    metalness: 0.1,
    side: THREE.DoubleSide,
  }), []);

  const foldMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#BFA070",
    roughness: 0.45,
    metalness: 0.1,
    side: THREE.DoubleSide,
  }), []);

  return (
    <group ref={group}>
      {/* Envelope body */}
      <mesh castShadow material={bodyMat}>
        <boxGeometry args={[2.0, 1.4, 0.04]} />
      </mesh>

      {/* Top flap (slightly in front) */}
      <mesh position={[0, 0.7, 0.025]} rotation={[Math.PI, 0, 0]} geometry={flapGeo} material={flapMat} />

      {/* Bottom fold */}
      <mesh position={[0, -0.7, 0.022]} geometry={bottomGeo} material={foldMat} />

      {/* Left fold */}
      <mesh position={[-1.0, 0, 0.021]} geometry={leftGeo} material={foldMat} />

      {/* Right fold */}
      <mesh position={[1.0, 0, 0.021]} geometry={rightGeo} material={foldMat} />

      {/* Seal dot */}
      <mesh position={[0, 0.05, 0.045]}>
        <circleGeometry args={[0.12, 32]} />
        <meshStandardMaterial color="#7B9E87" emissive="#7B9E87" emissiveIntensity={0.5} />
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
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 5, 5]} intensity={1.0} color="#D4B896" />
          <pointLight position={[-4, -3, 4]} intensity={0.5} color="#7B9E87" />
          <Particles />
          <Envelope />
        </Suspense>
      </Canvas>
    </div>
  );
}
