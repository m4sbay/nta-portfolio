/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, events, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';

// replace with your own imports, see the usage snippet for details
const cardGLB = '/Lanyard/card.glb';
const lanyard = '/Lanyard/Lanyard.png';
const CARD_SCALE = 2.25;
const STRAP_WIDTH_SCALAR = 1.25; // Tweak this value to match the desired strap proportion

import * as THREE from 'three';
export default function Lanyard({ position = [0, 0, 30], gravity = [0, -40, 0], fov = 20, transparent = true, eventSource }) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="absolute inset-0 z-0 flex h-full min-h-0 w-full origin-center animate-lanyard-drop items-center justify-center motion-reduce:animate-none">
      <Canvas
        camera={{ position: position, fov: fov }}
        eventSource={eventSource}
        events={heroEvents}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <SceneFraming />
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

// client coordinates stay correct over nested text, after scrolling, and capture.
function heroEvents(state) {
  const handlers = events(state);
  return { ...handlers, compute(event, root) {
    const rect = root.gl.domElement.getBoundingClientRect();
    root.pointer.set((event.clientX - rect.left) / rect.width * 2 - 1,
      -(event.clientY - rect.top) / rect.height * 2 + 1);
    root.raycaster.setFromCamera(root.pointer, root.camera);
  } };
}

function SceneFraming() {
  const framing = useRef(null);
  const { camera, size, gl } = useThree();
  const { nodes } = useGLTF(cardGLB);
  const cardSize = useMemo(() => {
    nodes.card.geometry.computeBoundingBox();
    return nodes.card.geometry.boundingBox.getSize(new THREE.Vector3()).multiplyScalar(CARD_SCALE);
  }, [nodes.card.geometry]);
  useLayoutEffect(() => {
    const update = () => {
      const canvas = gl.domElement.getBoundingClientRect();
      if (!canvas.width || !canvas.height) return;
      const homeHeight = Math.max(cardSize.y / 0.42, cardSize.x / (0.4 * canvas.width / canvas.height));
      const unitsPerPixel = homeHeight / canvas.height;
      const visibleHeight = unitsPerPixel * canvas.height;
      
      camera.position.x = 0;
      camera.position.y = -0.95; // Original vertical offset tweak
      camera.aspect = canvas.width / canvas.height;
      camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(visibleHeight / (2 * camera.position.z)));
      camera.updateProjectionMatrix();
      framing.current = { x: camera.position.x, y: camera.position.y, aspect: camera.aspect, fov: camera.fov };
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(gl.domElement);
    return () => observer.disconnect();
  }, [camera, gl, size.width, size.height, cardSize]);
  
  useFrame(() => {
    const target = framing.current;
    if (!target) return;
    camera.position.x = target.x;
    camera.position.y = target.y;
    if (camera.aspect !== target.aspect || camera.fov !== target.fov) {
      camera.aspect = target.aspect;
      camera.fov = target.fov;
      camera.updateProjectionMatrix();
    }
    camera.updateMatrixWorld();
  }, -1);
  return null;
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }) {
  const cardVisual = useRef();
  const [dragTools] = useState(() => ({
    ray: new THREE.Raycaster(),
    plane: new THREE.Plane(new THREE.Vector3(0, 0, 1)),
    bounds: new THREE.Box3()
  }));
  const band = useRef(),
    fixed = useRef(),
    j1 = useRef(),
    j2 = useRef(),
    j3 = useRef(),
    card = useRef();
  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    rot = new THREE.Vector3();
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };
  const { nodes, materials } = useGLTF(cardGLB);
  const texture = useTexture(lanyard);
  // The GLB has no strap mesh. Use its clamp width as the attachment dimension,
  // in the same world units as the uniformly scaled card/clip/clamp assembly.
  const strapWidth = useMemo(() => {
    nodes.clamp.geometry.computeBoundingBox();
    return nodes.clamp.geometry.boundingBox.getSize(new THREE.Vector3()).x * CARD_SCALE * STRAP_WIDTH_SCALAR;
  }, [nodes.clamp.geometry]);
  const strapGeometry = useMemo(() => createStrapGeometry(isMobile ? 16 : 32), [isMobile]);
  useEffect(() => () => strapGeometry.dispose(), [strapGeometry]);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      dragTools.ray.setFromCamera(state.pointer, state.camera);
      dragTools.plane.constant = -dragged.planeZ;
      if (!dragTools.ray.ray.intersectPlane(dragTools.plane, vec)) return;
      vec.sub(dragged.offset);
      // Bound only the drag target at the outer hero edge. Released bodies
      // remain fully simulated: no teleporting or zeroing rebound velocity.
      dragTools.bounds.setFromObject(cardVisual.current);
      const current = card.current.translation();
      const halfHeight = Math.tan(THREE.MathUtils.degToRad(state.camera.fov / 2)) *
        (state.camera.position.z - dragTools.bounds.max.z) * 2; // Increased boundary for flexibility
      const halfWidth = halfHeight * state.camera.aspect;
      for (const [axis, half] of [['x', halfWidth], ['y', halfHeight]]) {
        const min = state.camera.position[axis] - half - (dragTools.bounds.min[axis] - current[axis]);
        const max = state.camera.position[axis] + half - (dragTools.bounds.max[axis] - current[axis]);
        vec[axis] = min <= max ? THREE.MathUtils.clamp(vec[axis], min, max) : (min + max) / 2;
      }
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation(vec);
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      updateStrapGeometry(strapGeometry, curve, strapWidth);
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(-4, 1);

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            ref={cardVisual}
            scale={CARD_SCALE}
            position={[0, -1.2, -0.05]}
            rotation={[0, Math.PI, 0]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={e => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerCancel={() => drag(false)}
            onLostPointerCapture={() => drag(false)}
            onPointerDown={e => (
              e.target.setPointerCapture(e.pointerId),
              drag({
                offset: new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())),
                planeZ: e.point.z
              })
            )}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base.map}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band} geometry={strapGeometry} frustumCulled={false}>
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

// A ribbon has a real world-space width, unlike screen-space line thickness.
function createStrapGeometry(segments) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array((segments + 1) * 6);
  const uv = new Float32Array((segments + 1) * 4);
  const indices = [];
  for (let i = 0; i <= segments; i++) {
    uv.set([i / segments, 0, i / segments, 1], i * 4);
    if (i < segments) {
      const v = i * 2;
      indices.push(v, v + 1, v + 2, v + 1, v + 3, v + 2);
    }
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  return geometry;
}

function updateStrapGeometry(geometry, curve, width) {
  const positions = geometry.attributes.position;
  const segments = positions.count / 2 - 1;
  const point = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  for (let i = 0; i <= segments; i++) {
    curve.getPoint(i / segments, point);
    curve.getTangent(i / segments, tangent);
    const length = Math.hypot(tangent.x, tangent.y) || 1;
    const dx = -tangent.y / length * width / 2;
    const dy = tangent.x / length * width / 2;
    positions.setXYZ(i * 2, point.x + dx, point.y + dy, point.z);
    positions.setXYZ(i * 2 + 1, point.x - dx, point.y - dy, point.z);
  }
  positions.needsUpdate = true;
}
