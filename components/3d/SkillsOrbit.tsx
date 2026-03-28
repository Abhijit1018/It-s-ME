"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Text, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

const skillClusters = [
  { name: "Frontend", color: "#7B9E87", position: [0, 0, 0] as [number, number, number], radius: 0 },
  { name: "Backend", color: "#D4B896", position: [3.5, 0.5, 0] as [number, number, number], radius: 3.5 },
  { name: "DevOps", color: "#C4847A", position: [-3, 1, 1] as [number, number, number], radius: 3.1 },
  { name: "Design", color: "#A8C4B0", position: [1, 3, -1] as [number, number, number], radius: 3.2 },
  { name: "Other", color: "#BFA090", position: [-1.5, -3, 0.5] as [number, number, number], radius: 3.3 },
];

function ClusterSphere({
  cluster,
  onClick,
  selected,
}: {
  cluster: (typeof skillClusters)[0];
  onClick: () => void;
  selected: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.5;
    const scale = selected ? 1.3 : 1;
    ref.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
  });

  return (
    <group position={cluster.position}>
      <Float speed={1} floatIntensity={0.3}>
        <mesh ref={ref} onClick={onClick} castShadow>
          <sphereGeometry args={[cluster.radius === 0 ? 0.8 : 0.5, 32, 32]} />
          <meshPhysicalMaterial
            color={cluster.color}
            roughness={0.2}
            metalness={0.4}
            emissive={cluster.color}
            emissiveIntensity={selected ? 0.4 : 0.1}
          />
        </mesh>
        <Text
          position={[0, cluster.radius === 0 ? 1.2 : 0.9, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {cluster.name}
        </Text>
      </Float>
    </group>
  );
}

function Scene({ onSelect }: { onSelect: (name: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.002;
    groupRef.current.rotation.x += (mouse.y * 0.1 - groupRef.current.rotation.x) * 0.02;
  });

  return (
    <group ref={groupRef}>
      <Stars radius={60} depth={50} count={2000} factor={3} saturation={0} fade speed={0.5} />
      {skillClusters.map((cluster) => (
        <ClusterSphere
          key={cluster.name}
          cluster={cluster}
          selected={selected === cluster.name}
          onClick={() => {
            const newSelected = selected === cluster.name ? null : cluster.name;
            setSelected(newSelected);
            onSelect(newSelected ?? "");
          }}
        />
      ))}
    </group>
  );
}

export function SkillsOrbit({ onSelect }: { onSelect: (name: string) => void }) {
  return (
    <div className="w-full h-full" role="presentation" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#D4B896" />
          <Scene onSelect={onSelect} />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
