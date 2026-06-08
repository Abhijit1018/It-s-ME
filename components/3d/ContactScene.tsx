"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
  const count = 400;
  const { mouse } = useThree();
  const meshRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.elapsedTime * 0.02;
    meshRef.current.rotation.x += (mouse.y * 0.03 - meshRef.current.rotation.x) * 0.02;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#7B9E87" size={0.035} sizeAttenuation transparent opacity={0.5} />
    </points>
  );
}

function Envelope() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.45) * 0.28;
    group.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.06;
    group.current.position.y = Math.sin(clock.elapsedTime * 0.7) * 0.15;
  });

  // Body: 2.4 wide × 1.6 tall × 0.06 deep
  const W = 2.4, H = 1.6, D = 0.06;
  const hw = W / 2, hh = H / 2; // half-width, half-height

  // ── Fold triangles (all positioned at [0,0,0], geometry in local coords) ──

  // Left side fold: left edge to center
  const leftFold = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-hw, hh);
    s.lineTo(-hw, -hh);
    s.lineTo(0, 0);
    s.closePath();
    return new THREE.ShapeGeometry(s);
  }, [hw, hh]);

  // Right side fold
  const rightFold = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(hw, hh);
    s.lineTo(hw, -hh);
    s.lineTo(0, 0);
    s.closePath();
    return new THREE.ShapeGeometry(s);
  }, [hw, hh]);

  // Bottom fold: bottom edge to center
  const bottomFold = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-hw, -hh);
    s.lineTo(hw, -hh);
    s.lineTo(0, 0);
    s.closePath();
    return new THREE.ShapeGeometry(s);
  }, [hw, hh]);

  // Top flap: top edge folds down — tip at y=0.1 (slightly above center)
  const topFlap = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-hw, hh);
    s.lineTo(hw, hh);
    s.lineTo(0, 0.1);
    s.closePath();
    return new THREE.ShapeGeometry(s);
  }, [hw, hh]);

  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#C8A878",
    roughness: 0.55,
    metalness: 0.05,
    side: THREE.FrontSide,
  }), []);

  const flapMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#B8966A",
    roughness: 0.6,
    metalness: 0.04,
    side: THREE.FrontSide,
  }), []);

  const foldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#D4B896",
    roughness: 0.5,
    metalness: 0.06,
    side: THREE.FrontSide,
  }), []);

  const lineMat = useMemo(() => new THREE.LineBasicMaterial({
    color: "#A07840",
    transparent: true,
    opacity: 0.35,
  }), []);

  // Fold crease lines on front face
  const creaseLines = useMemo(() => {
    const pts = [
      // bottom-left to center
      new THREE.Vector3(-hw, -hh, D / 2 + 0.003),
      new THREE.Vector3(0, 0, D / 2 + 0.003),
      // bottom-right to center
      new THREE.Vector3(hw, -hh, D / 2 + 0.003),
      new THREE.Vector3(0, 0, D / 2 + 0.003),
      // top-left to center
      new THREE.Vector3(-hw, hh, D / 2 + 0.003),
      new THREE.Vector3(0, 0.1, D / 2 + 0.003),
      // top-right to center
      new THREE.Vector3(hw, hh, D / 2 + 0.003),
      new THREE.Vector3(0, 0.1, D / 2 + 0.003),
    ];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    return geo;
  }, [hw, hh, D]);

  const faceZ = D / 2 + 0.001;

  return (
    <group ref={group}>
      {/* Body */}
      <mesh castShadow receiveShadow material={bodyMat}>
        <boxGeometry args={[W, H, D]} />
      </mesh>

      {/* Front face folds — drawn on top of body face */}
      {/* Left fold (slightly darker) */}
      <mesh position={[0, 0, faceZ]} geometry={leftFold} material={foldMat} />
      {/* Right fold */}
      <mesh position={[0, 0, faceZ + 0.001]} geometry={rightFold} material={foldMat} />
      {/* Bottom fold (lightest) */}
      <mesh position={[0, 0, faceZ + 0.002]}>
        <primitive object={bottomFold} attach="geometry" />
        <meshStandardMaterial color="#DCC8A8" roughness={0.5} side={THREE.FrontSide} />
      </mesh>
      {/* Top flap (on top, slightly darker) */}
      <mesh position={[0, 0, faceZ + 0.003]} geometry={topFlap} material={flapMat} />

      {/* Crease lines */}
      <lineSegments geometry={creaseLines} material={lineMat} />

      {/* Wax seal */}
      <mesh position={[0, 0.06, faceZ + 0.008]}>
        <circleGeometry args={[0.14, 32]} />
        <meshStandardMaterial
          color="#7B9E87"
          emissive="#7B9E87"
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Seal ring */}
      <mesh position={[0, 0.06, faceZ + 0.009]}>
        <ringGeometry args={[0.14, 0.17, 32]} />
        <meshStandardMaterial
          color="#5A8068"
          emissive="#5A8068"
          emissiveIntensity={0.3}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

export function ContactScene() {
  return (
    <div className="w-full h-full" role="presentation" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 6, 5]} intensity={1.2} color="#EDE8DF" castShadow />
          <pointLight position={[-5, -3, 3]} intensity={0.6} color="#7B9E87" />
          <pointLight position={[3, 4, 2]} intensity={0.4} color="#D4B896" />
          <Particles />
          <Envelope />
        </Suspense>
      </Canvas>
    </div>
  );
}
