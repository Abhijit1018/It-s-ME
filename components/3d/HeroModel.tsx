"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Environment, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

// Thin glowing line (used for ports, vents)
function Strip({
  pos, size, color, emissive = 0,
}: {
  pos: [number, number, number];
  size: [number, number, number];
  color: string;
  emissive?: number;
}) {
  return (
    <mesh position={pos}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={emissive} roughness={0.6} />
    </mesh>
  );
}

// Animated code lines on screen
function CodeLines() {
  const linesRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!linesRef.current) return;
    // Slowly scroll upward
    linesRef.current.position.y = (clock.elapsedTime * 0.03) % 0.18;
  });

  const lines = useMemo(() => {
    const palette = ["#7B9E87", "#D4B896", "#C4847A", "#A8C4B0", "#8BA0D4", "#D4B896"];
    return Array.from({ length: 10 }, (_, i) => ({
      y: 0.46 - i * 0.105,
      width: 0.3 + Math.random() * 0.65,
      xOff: (Math.random() - 0.5) * 0.25,
      color: palette[Math.floor(Math.random() * palette.length)],
      indent: Math.random() > 0.6 ? 0.12 : 0,
    }));
  }, []);

  return (
    <group ref={linesRef}>
      {lines.map((l, i) => (
        <mesh key={i} position={[l.xOff + l.indent * 0.5, l.y, 0]}>
          <boxGeometry args={[l.width, 0.032, 0.001]} />
          <meshStandardMaterial
            color={l.color}
            emissive={l.color}
            emissiveIntensity={0.55}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

function LaptopMesh() {
  const group = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.35) * 0.22 + mouse.x * 0.08;
    group.current.rotation.x = -0.08 + mouse.y * 0.035;
  });

  // Materials
  const bodyMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#232220",
        roughness: 0.22,
        metalness: 0.82,
        reflectivity: 0.9,
      }),
    []
  );
  const innerMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#141412", roughness: 0.9 }),
    []
  );
  const screenGlowMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0E1A14",
        emissive: "#1A3325",
        emissiveIntensity: 1.0,
        roughness: 0.05,
        metalness: 0,
      }),
    []
  );

  return (
    <Float speed={1.0} rotationIntensity={0.06} floatIntensity={0.35}>
      <group ref={group} position={[0, -0.35, 0]}>

        {/* ─── BASE UNIT ─── */}
        <RoundedBox args={[3.4, 0.14, 2.2]} radius={0.06} smoothness={4} material={bodyMat} castShadow receiveShadow />

        {/* Bottom rubber feet */}
        {[[-1.4, -0.072, -0.88], [1.4, -0.072, -0.88], [-1.4, -0.072, 0.88], [1.4, -0.072, 0.88]].map((p, i) => (
          <mesh key={i} position={p as [number, number, number]}>
            <cylinderGeometry args={[0.08, 0.09, 0.03, 16]} />
            <meshStandardMaterial color="#0A0A09" roughness={1} />
          </mesh>
        ))}

        {/* Keyboard deck surface */}
        <mesh position={[0, 0.072, -0.04]} material={innerMat}>
          <boxGeometry args={[2.9, 0.005, 1.8]} />
        </mesh>

        {/* Keyboard rows — 4 row bands */}
        {[-0.55, -0.22, 0.12, 0.42].map((z, i) => (
          <mesh key={i} position={[0, 0.078, z]} material={innerMat}>
            <boxGeometry args={[2.4 - i * 0.04, 0.006, 0.075]} />
          </mesh>
        ))}
        {/* Space bar */}
        <mesh position={[0.08, 0.078, 0.62]}>
          <boxGeometry args={[0.85, 0.006, 0.07]} />
          <meshStandardMaterial color="#1C1C1A" roughness={0.85} />
        </mesh>

        {/* Trackpad */}
        <mesh position={[0, 0.075, 0.76]}>
          <boxGeometry args={[1.0, 0.007, 0.62]} />
          <meshPhysicalMaterial color="#1A1918" roughness={0.12} metalness={0.4} reflectivity={0.7} />
        </mesh>
        {/* Trackpad click line */}
        <mesh position={[0, 0.078, 1.04]}>
          <boxGeometry args={[1.0, 0.004, 0.003]} />
          <meshStandardMaterial color="#2A2825" />
        </mesh>

        {/* Side ports — left side */}
        <Strip pos={[-1.71, 0.01, -0.35]} size={[0.005, 0.05, 0.09]} color="#7B9E87" emissive={0.4} />
        <Strip pos={[-1.71, 0.01, -0.18]} size={[0.005, 0.05, 0.09]} color="#3A3835" />
        <Strip pos={[-1.71, 0.01, 0.0]} size={[0.005, 0.05, 0.09]} color="#3A3835" />

        {/* Vent slots — right side */}
        {[0.1, 0.22, 0.34, 0.46, 0.58].map((z, i) => (
          <Strip key={i} pos={[1.71, 0.01, z]} size={[0.005, 0.04, 0.025]} color="#1A1815" />
        ))}

        {/* Hinge bar */}
        <mesh position={[0, 0.072, -1.09]}>
          <boxGeometry args={[2.9, 0.07, 0.05]} />
          <meshPhysicalMaterial color="#7B9E87" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* ─── SCREEN LID ─── (pivot at hinge, ~105° open) */}
        <group position={[0, 0.072, -1.09]} rotation={[-1.88, 0, 0]}>

          {/* Lid outer shell */}
          <RoundedBox
            args={[3.4, 2.18, 0.1]}
            radius={0.07}
            smoothness={4}
            position={[0, 1.09, 0]}
            material={bodyMat}
            castShadow
          />

          {/* Screen bezel (thin inset frame) */}
          <mesh position={[0, 1.09, 0.052]} material={innerMat}>
            <boxGeometry args={[3.15, 1.97, 0.008]} />
          </mesh>

          {/* Screen display area */}
          <mesh position={[0, 1.09, 0.057]} material={screenGlowMat}>
            <boxGeometry args={[2.9, 1.74, 0.004]} />
          </mesh>

          {/* Wallpaper gradient overlay */}
          <mesh position={[0, 1.09, 0.059]}>
            <boxGeometry args={[2.9, 1.74, 0.001]} />
            <meshStandardMaterial
              color="#0D1F18"
              emissive="#0D2018"
              emissiveIntensity={0.5}
              transparent
              opacity={0.6}
            />
          </mesh>

          {/* Code lines panel */}
          <group position={[-0.1, 1.09, 0.062]}>
            <CodeLines />
          </group>

          {/* Top menu bar */}
          <mesh position={[0, 1.93, 0.061]}>
            <boxGeometry args={[2.9, 0.09, 0.001]} />
            <meshStandardMaterial color="#0A1A10" emissive="#0A1A10" emissiveIntensity={0.8} transparent opacity={0.9} />
          </mesh>
          {/* Menu bar dots (traffic lights) */}
          {[[-1.27, 0], [-1.13, 0], [-0.99, 0]].map(([x], i) => (
            <mesh key={i} position={[x, 1.93, 0.062]}>
              <circleGeometry args={[0.022, 16]} />
              <meshStandardMaterial
                color={["#C4847A", "#D4B896", "#7B9E87"][i]}
                emissive={["#C4847A", "#D4B896", "#7B9E87"][i]}
                emissiveIntensity={0.7}
              />
            </mesh>
          ))}

          {/* Dock bar at bottom of screen */}
          <mesh position={[0, 0.26, 0.061]}>
            <boxGeometry args={[1.3, 0.1, 0.001]} />
            <meshStandardMaterial color="#1A2E20" emissive="#1A2E20" emissiveIntensity={0.6} transparent opacity={0.85} />
          </mesh>
          {/* Dock icons */}
          {[-0.45, -0.22, 0, 0.22, 0.45].map((x, i) => (
            <mesh key={i} position={[x, 0.26, 0.062]}>
              <boxGeometry args={[0.07, 0.065, 0.001]} />
              <meshStandardMaterial
                color={["#7B9E87", "#D4B896", "#8BA0D4", "#C4847A", "#A8C4B0"][i]}
                emissive={["#7B9E87", "#D4B896", "#8BA0D4", "#C4847A", "#A8C4B0"][i]}
                emissiveIntensity={0.5}
              />
            </mesh>
          ))}

          {/* Camera dot */}
          <mesh position={[0, 2.1, 0.052]}>
            <circleGeometry args={[0.025, 24]} />
            <meshStandardMaterial color="#0D0D0C" />
          </mesh>
          <mesh position={[0, 2.1, 0.054]}>
            <circleGeometry args={[0.01, 16]} />
            <meshStandardMaterial color="#1A2A20" emissive="#1A2A20" emissiveIntensity={0.3} />
          </mesh>

          {/* Back logo glow */}
          <mesh position={[0, 1.09, -0.058]}>
            <circleGeometry args={[0.22, 32]} />
            <meshStandardMaterial
              color="#7B9E87"
              emissive="#7B9E87"
              emissiveIntensity={0.35}
              roughness={0.15}
            />
          </mesh>
        </group>

        {/* Screen light cast onto base */}
        <pointLight position={[0, 1.2, 0.5]} intensity={0.4} color="#4A8A60" distance={4} />
      </group>
    </Float>
  );
}

export function HeroModel() {
  return (
    <div className="w-full h-full" role="presentation" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 1.8, 6.5], fov: 38 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.45} />
          <directionalLight position={[4, 8, 4]} intensity={0.9} castShadow shadow-mapSize={[1024, 1024]} />
          <directionalLight position={[-3, 3, -2]} intensity={0.3} color="#D4B896" />
          <pointLight position={[0, 4, 3]} intensity={0.5} color="#7B9E87" />
          <LaptopMesh />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
