import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);

  return matches;
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
    );
  } catch {
    return false;
  }
}

function VoxelAccents({ mobile, reducedMotion }) {
  const group = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });

  const cubes = useMemo(
    () =>
      Array.from({ length: mobile ? 6 : 14 }, (_, index) => {
        const leftEdge = index % 5 === 0;
        return {
          id: index,
          position: [
            leftEdge ? -5.2 - Math.random() : 3.7 + Math.random() * 2.2,
            leftEdge ? -1.7 - Math.random() * 1.5 : (Math.random() - 0.5) * 5.4,
            -1.8 - Math.random() * 3.6,
          ],
          scale: 0.06 + Math.random() * 0.13,
          color: ['#8b5cf6', '#ff4d2e', '#3b82f6'][index % 3],
        };
      }),
    [mobile],
  );

  useEffect(() => {
    const onPointerMove = (event) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  useFrame((state) => {
    if (!group.current || document.hidden || reducedMotion) return;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      pointer.current.x * 0.08,
      0.04,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -pointer.current.y * 0.035,
      0.04,
    );
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.07;
  });

  return (
    <group ref={group}>
      <group position={[mobile ? 2.5 : 4.25, -1.4, -1.8]} rotation={[0.2, -0.55, 0.08]}>
        {[0, 1, 2, 3].map((index) => (
          <mesh key={index} position={[index * 0.5, (index % 2) * 0.28, -index * 0.12]}>
            <boxGeometry args={[0.48, 0.48, 0.48]} />
            <meshStandardMaterial
              color={index % 2 ? '#ff4d2e' : '#8b5cf6'}
              emissive={index % 2 ? '#7f1d1d' : '#4c1d95'}
              emissiveIntensity={0.8}
              roughness={0.36}
            />
          </mesh>
        ))}
      </group>

      <group position={[mobile ? -3 : -4.8, 1.35, -2.4]} rotation={[-0.12, 0.5, -0.06]}>
        <mesh>
          <boxGeometry args={[2.6, 1.46, 0.08]} />
          <meshPhysicalMaterial
            color="#11142a"
            transparent
            opacity={0.28}
            transmission={0.18}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, -0.9, 0]}>
          <boxGeometry args={[2.1, 0.06, 0.06]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1.3} />
        </mesh>
      </group>

      <group position={[3.65, 1.75, -2.6]} rotation={[0.05, -0.35, 0.04]}>
        <mesh>
          <boxGeometry args={[1, 1, 0.08]} />
          <meshPhysicalMaterial color="#17152b" transparent opacity={0.3} roughness={0.2} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 2]} position={[0.05, 0, 0.08]}>
          <coneGeometry args={[0.22, 0.34, 3]} />
          <meshStandardMaterial color="#ffffff" emissive="#8b5cf6" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {cubes.map((cube) => (
        <mesh key={cube.id} position={cube.position} scale={cube.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={cube.color}
            emissive={cube.color}
            emissiveIntensity={0.65}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function StaticFallback() {
  return (
    <div className="scene-fallback" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

export function HeroScene() {
  const [webgl, setWebgl] = useState(true);
  const mobile = useMediaQuery('(max-width: 720px)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    setWebgl(supportsWebGL());
  }, []);

  if (!webgl) return <StaticFallback />;

  return (
    <div className="hero-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={mobile ? [0.65, 1] : [0.8, 1.25]}
        frameloop={reducedMotion ? 'demand' : 'always'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[4, 3, 3]} intensity={18} color="#8b5cf6" />
        <pointLight position={[-4, -2, 2]} intensity={12} color="#ff4d2e" />
        <VoxelAccents mobile={mobile} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
