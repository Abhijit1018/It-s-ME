"use client";

import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Character() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/character.glb");
  const { actions, names } = useAnimations(animations, groupRef);

  const { mouse } = useThree();
  const scaled = useRef(false);
  const isDragging = useRef(false);

  useEffect(() => {
    (window as any).__heroAnimNames = names;
    if (names.length === 0) return;
    const clip = names.find((n) => /idle|stand|breath|default|walk|run|anim/i.test(n)) ?? names[0];
    const action = actions[clip];
    if (!action) return;
    action.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.3).play();
    return () => { action.fadeOut(0.3); };
  }, [actions, names]);

  useEffect(() => {
    const onDown = () => { isDragging.current = true; };
    const onUp = () => { isDragging.current = false; };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    if (!scaled.current) {
      const box = new THREE.Box3().setFromObject(groupRef.current);
      if (!box.isEmpty()) {
        scaled.current = true;
        const size = box.getSize(new THREE.Vector3());
        const s = 3.6 / size.y;
        groupRef.current.scale.setScalar(s);
        const box2 = new THREE.Box3().setFromObject(groupRef.current);
        const center = box2.getCenter(new THREE.Vector3());
        groupRef.current.position.set(-center.x, -box2.min.y, -center.z);
        groupRef.current.userData.baseY = groupRef.current.position.y;
        groupRef.current.userData.baseScale = s;
      }
      return;
    }

    const t = clock.elapsedTime;
    const baseY = groupRef.current.userData.baseY as number;
    const baseScale = groupRef.current.userData.baseScale as number;

    groupRef.current.position.y = baseY + Math.sin(t * 0.9) * 0.06;

    const breathe = 1 + Math.sin(t * 1.4) * 0.012;
    groupRef.current.scale.set(baseScale, baseScale * breathe, baseScale);

    if (!isDragging.current) {
      const autoSway = Math.sin(t * 0.4) * 0.08;
      const targetY = mouse.x * 0.35 + autoSway;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.04;
      groupRef.current.rotation.x += (-mouse.y * 0.08 - groupRef.current.rotation.x) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

export function HeroModel() {
  return (
    <div className="w-full h-full" role="presentation" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 1.8, 5], fov: 52 }}
        gl={{ antialias: true, alpha: true }}
        shadows
        style={{ background: "transparent" }}
        onCreated={({ camera }) => camera.lookAt(0, 1.8, 0)}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.85} />
          <directionalLight
            position={[3, 5, 4]}
            intensity={1.4}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-3, 2, 2]} intensity={0.5} color="#7B9E87" />
          <Character />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
            rotateSpeed={0.6}
            target={[0, 1.8, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/character.glb");
