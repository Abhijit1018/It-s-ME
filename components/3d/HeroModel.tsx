"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ────────────────────────────────────────────────────
   Per-face Minecraft shading — each face of a block
   has a distinct brightness, exactly like Minecraft.
   Order: right(+x), left(-x), top(+y), bottom(-y),
          front(+z), back(-z)
──────────────────────────────────────────────────── */
function shade(hex: string, factor: number): string {
  const c = new THREE.Color(hex);
  c.multiplyScalar(Math.min(factor, 1));
  return "#" + c.getHexString();
}

function mcMats(hex: string): THREE.MeshBasicMaterial[] {
  return [
    new THREE.MeshBasicMaterial({ color: shade(hex, 0.70) }), // right
    new THREE.MeshBasicMaterial({ color: shade(hex, 0.70) }), // left
    new THREE.MeshBasicMaterial({ color: shade(hex, 1.00) }), // top   ← brightest
    new THREE.MeshBasicMaterial({ color: shade(hex, 0.40) }), // bottom
    new THREE.MeshBasicMaterial({ color: shade(hex, 0.85) }), // front
    new THREE.MeshBasicMaterial({ color: shade(hex, 0.55) }), // back
  ];
}

/* Block mesh with Minecraft-style per-face shading */
function Block({
  pos,
  size,
  color,
  castShadow = false,
}: {
  pos: [number, number, number];
  size: [number, number, number];
  color: string;
  castShadow?: boolean;
}) {
  const mats = useMemo(() => mcMats(color), [color]);
  return (
    <mesh position={pos} material={mats} castShadow={castShadow}>
      <boxGeometry args={size} />
    </mesh>
  );
}

/* Flat block — single colour (for face overlays like eyes/beard) */
function FlatBlock({
  pos,
  size,
  color,
}: {
  pos: [number, number, number];
  size: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={pos}>
      <boxGeometry args={size} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

/* ────────────────────────────────────────────────────
   Floating Minecraft block (grass / diamond / stone)
──────────────────────────────────────────────────── */
function FloatingBlock({
  position,
  topHex,
  sideHex,
  delay = 0,
  size = 0.42,
}: {
  position: [number, number, number];
  topHex: string;
  sideHex: string;
  delay?: number;
  size?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const sideMats = useMemo(() => mcMats(sideHex), [sideHex]);
  const topMat   = useMemo(() => new THREE.MeshBasicMaterial({ color: topHex }), [topHex]);

  const mats = useMemo(() => [
    sideMats[0], sideMats[1],
    topMat,
    sideMats[3],
    sideMats[4], sideMats[5],
  ], [sideMats, topMat]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime + delay;
    ref.current.position.y = position[1] + Math.sin(t * 0.85) * 0.18;
    ref.current.rotation.y = t * 0.5;
  });

  return (
    <group ref={ref} position={[position[0], position[1], position[2]]}>
      <mesh material={mats}>
        <boxGeometry args={[size, size, size]} />
      </mesh>
    </group>
  );
}

/* ────────────────────────────────────────────────────
   Minecraft Character
──────────────────────────────────────────────────── */
function MinecraftCharacter() {
  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const lArmRef = useRef<THREE.Group>(null);
  const rArmRef = useRef<THREE.Group>(null);
  const lLegRef = useRef<THREE.Group>(null);
  const rLegRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();
  const jump = useRef({ on: false, t: 0, next: 4.5 });

  useFrame(({ clock }) => {
    const now = clock.elapsedTime;
    const j = jump.current;

    // Schedule jump every ~5-7 s
    if (now > j.next && !j.on) {
      j.on = true; j.t = 0;
      j.next = now + 5 + Math.random() * 2.5;
    }
    let jy = 0;
    if (j.on) {
      j.t = Math.min(j.t + 0.048, 1);
      jy  = Math.sin(j.t * Math.PI) * 0.65;
      if (j.t >= 1) j.on = false;
    }

    if (rootRef.current) {
      rootRef.current.position.y = Math.sin(now * 1.1) * 0.02 + jy;
      rootRef.current.rotation.y +=
        (mouse.x * 0.3 - rootRef.current.rotation.y) * 0.04;
    }

    // Head tracks cursor
    if (headRef.current) {
      headRef.current.rotation.x +=
        (-mouse.y * 0.5 - headRef.current.rotation.x) * 0.08;
      headRef.current.rotation.y +=
        (mouse.x  * 0.6 - headRef.current.rotation.y) * 0.08;
    }

    // Walk cycle
    const spd = j.on ? 0 : 2.1;
    const amp = 0.48;
    const k   = 0.1;
    if (rArmRef.current) rArmRef.current.rotation.x += (Math.sin(now*spd)*amp           - rArmRef.current.rotation.x) * k;
    if (lArmRef.current) lArmRef.current.rotation.x += (Math.sin(now*spd+Math.PI)*amp   - lArmRef.current.rotation.x) * k;
    if (rLegRef.current) rLegRef.current.rotation.x += (Math.sin(now*spd+Math.PI)*amp*0.6 - rLegRef.current.rotation.x) * k;
    if (lLegRef.current) lLegRef.current.rotation.x += (Math.sin(now*spd)*amp*0.6       - lLegRef.current.rotation.x) * k;
  });

  // ── Palette (matches reference) ──
  const SKIN  = "#D4926A";
  const HAIR  = "#7A3510";
  const BEARD = "#9B4C1E";
  const TEAL  = "#3DA898";
  const PANTS = "#52546A";
  const BOOT  = "#6A3E18";
  const WHITE = "#EDE8DC";
  const BELT  = "#7A4820";
  const BLUE  = "#2E72D2";
  const BLACK = "#111111";
  const GOLD  = "#C8A050";

  return (
    <group ref={rootRef}>

      {/* ══════════════ HEAD ══════════════ */}
      <group ref={headRef} position={[0, 1.76, 0]}>
        {/* Skull */}
        <Block pos={[0,0,0]} size={[0.8,0.8,0.8]} color={SKIN} castShadow />

        {/* Hair – top cap */}
        <Block pos={[0, 0.4, 0]}     size={[0.86, 0.16, 0.86]} color={HAIR} />
        {/* Hair – side slabs */}
        <Block pos={[-0.44, 0.2, 0]} size={[0.04, 0.38, 0.82]} color={HAIR} />
        <Block pos={[ 0.44, 0.2, 0]} size={[0.04, 0.38, 0.82]} color={HAIR} />
        {/* Hair – back */}
        <Block pos={[0, 0.2, -0.44]} size={[0.86, 0.5, 0.04]}  color={HAIR} />

        {/* Beard – front panel */}
        <FlatBlock pos={[0, -0.18, 0.41]}   size={[0.64, 0.26, 0.01]} color={BEARD} />
        {/* Beard – chin block (3D) */}
        <Block    pos={[0, -0.3,  0.34]}    size={[0.54, 0.13, 0.2]}  color={BEARD} />
        {/* Mustache */}
        <FlatBlock pos={[-0.12,-0.04,0.41]} size={[0.2,0.07,0.01]}    color={BEARD} />
        <FlatBlock pos={[ 0.12,-0.04,0.41]} size={[0.2,0.07,0.01]}    color={BEARD} />
        {/* Sideburns */}
        <Block pos={[-0.44,-0.05,0.22]} size={[0.04,0.38,0.44]} color={BEARD} />
        <Block pos={[ 0.44,-0.05,0.22]} size={[0.04,0.38,0.44]} color={BEARD} />

        {/* Eyebrows */}
        <FlatBlock pos={[-0.2, 0.25,0.41]} size={[0.22,0.05,0.01]} color={HAIR} />
        <FlatBlock pos={[ 0.2, 0.25,0.41]} size={[0.22,0.05,0.01]} color={HAIR} />

        {/* Left eye – white / iris / pupil */}
        <FlatBlock pos={[-0.2, 0.1, 0.41]}  size={[0.2,0.15,0.01]}  color={WHITE} />
        <FlatBlock pos={[-0.2, 0.09,0.414]} size={[0.13,0.1,0.01]}  color={BLUE}  />
        <FlatBlock pos={[-0.19,0.09,0.417]} size={[0.07,0.07,0.01]} color={BLACK} />

        {/* Right eye – white / iris / pupil */}
        <FlatBlock pos={[0.2, 0.1, 0.41]}   size={[0.2,0.15,0.01]}  color={WHITE} />
        <FlatBlock pos={[0.2, 0.09,0.414]}  size={[0.13,0.1,0.01]}  color={BLUE}  />
        <FlatBlock pos={[0.19,0.09,0.417]}  size={[0.07,0.07,0.01]} color={BLACK} />

        {/* Nose */}
        <Block pos={[0,0.0,0.44]} size={[0.11,0.1,0.07]} color="#BF7040" />
      </group>

      {/* ══════════════ BODY ══════════════ */}
      <Block pos={[0,0.82,0]} size={[0.86,1.06,0.44]} color={TEAL} castShadow />
      {/* White shirt strip */}
      <FlatBlock pos={[0,0.96,0.224]}   size={[0.24,0.64,0.006]} color={WHITE} />
      {/* Lapels */}
      <FlatBlock pos={[-0.1,1.28,0.224]} size={[0.16,0.15,0.006]} color="#2D8070" />
      <FlatBlock pos={[ 0.1,1.28,0.224]} size={[0.16,0.15,0.006]} color="#2D8070" />
      {/* Belt */}
      <FlatBlock pos={[0,0.35,0.226]}   size={[0.9,0.1,0.006]}   color={BELT}  />
      <FlatBlock pos={[0,0.35,0.228]}   size={[0.1,0.08,0.006]}  color={GOLD}  />

      {/* ══════════════ ARMS ══════════════ */}
      <group ref={lArmRef} position={[-0.65, 1.28, 0]}>
        <Block pos={[0,-0.46,0]} size={[0.38,0.92,0.38]} color={TEAL} castShadow />
        <Block pos={[0,-0.97,0]} size={[0.38,0.2,0.38]}  color={SKIN} />
      </group>
      <group ref={rArmRef} position={[0.65, 1.28, 0]}>
        <Block pos={[0,-0.46,0]} size={[0.38,0.92,0.38]} color={TEAL} castShadow />
        <Block pos={[0,-0.97,0]} size={[0.38,0.2,0.38]}  color={SKIN} />
      </group>

      {/* ══════════════ LEGS ══════════════ */}
      <group ref={lLegRef} position={[-0.22, 0.29, 0]}>
        <Block pos={[0,-0.52,0]}  size={[0.38,1.04,0.38]} color={PANTS} castShadow />
        <Block pos={[0,-1.1,0.04]}  size={[0.4,0.24,0.46]}  color={BOOT}  />
        <Block pos={[0,-1.23,0.04]} size={[0.42,0.06,0.48]} color="#3A1C06" />
      </group>
      <group ref={rLegRef} position={[0.22, 0.29, 0]}>
        <Block pos={[0,-0.52,0]}  size={[0.38,1.04,0.38]} color={PANTS} castShadow />
        <Block pos={[0,-1.1,0.04]}  size={[0.4,0.24,0.46]}  color={BOOT}  />
        <Block pos={[0,-1.23,0.04]} size={[0.42,0.06,0.48]} color="#3A1C06" />
      </group>

    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.48, 0]} receiveShadow>
      <planeGeometry args={[14, 14]} />
      <shadowMaterial transparent opacity={0.12} />
    </mesh>
  );
}

/* ────────────────────────────────────────────────────
   Export
──────────────────────────────────────────────────── */
export function HeroModel() {
  return (
    <div className="w-full h-full" role="presentation" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 1.5, 7], fov: 52 }}
        shadows
        dpr={0.55}                      /* low pixel density = pixelated look */
        gl={{ antialias: false, alpha: true }}
        style={{
          background: "transparent",
          imageRendering: "pixelated",  /* CSS nearest-neighbour upscale */
        }}
      >
        <Suspense fallback={null}>
          {/* Flat ambient — preserves per-face block shading */}
          <ambientLight intensity={0.0} />
          <directionalLight position={[2, 6, 4]} intensity={0.6} castShadow shadow-mapSize={[512, 512]} />

          <MinecraftCharacter />

          {/* Floating blocks */}
          <FloatingBlock position={[-2.5, 0.8, -0.8]} topHex="#5BB52A" sideHex="#8B6040" delay={0}   size={0.44} />
          <FloatingBlock position={[ 2.4, 0.5, -1.0]} topHex="#55C8E8" sideHex="#55C8E8" delay={1.6} size={0.34} />
          <FloatingBlock position={[-2.0,-0.3, -1.2]} topHex="#A0A0A0" sideHex="#888888" delay={0.9} size={0.3}  />
          <FloatingBlock position={[ 2.1, 1.2, -1.4]} topHex="#3AC870" sideHex="#28A058" delay={2.3} size={0.28} />

          <Ground />
        </Suspense>
      </Canvas>
    </div>
  );
}
