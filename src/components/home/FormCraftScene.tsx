"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function FormCraftScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.7, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const primary = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      roughness: 0.42,
      metalness: 0.18,
    });
    const surface = new THREE.MeshStandardMaterial({
      color: 0x1a1d2e,
      roughness: 0.7,
      metalness: 0.05,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.45,
      metalness: 0.12,
    });

    const panel = new THREE.Mesh(new THREE.BoxGeometry(4.4, 2.8, 0.16), surface);
    panel.position.z = -0.2;
    group.add(panel);

    const rows = [
      { y: 0.84, width: 3.2, material: primary },
      { y: 0.2, width: 2.55, material: surface },
      { y: -0.44, width: 3.45, material: surface },
      { y: -1.08, width: 1.7, material: accent },
    ];

    rows.forEach((row, index) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(row.width, 0.28, 0.2), row.material);
      mesh.position.set(index === 3 ? -0.75 : 0, row.y, 0.08);
      group.add(mesh);
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 24), index === 0 ? accent : primary);
      dot.position.set(-1.85, row.y, 0.26);
      group.add(dot);
    });

    const orbit = new THREE.Group();
    scene.add(orbit);
    for (let index = 0; index < 24; index += 1) {
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), primary);
      const angle = (index / 24) * Math.PI * 2;
      node.position.set(Math.cos(angle) * 3.05, Math.sin(angle) * 1.92, -0.15);
      orbit.add(node);
    }

    scene.add(new THREE.AmbientLight(0xffffff, 1.4));
    const key = new THREE.PointLight(0x8b8cff, 3, 18);
    key.position.set(2, 3, 5);
    scene.add(key);

    let frameId = 0;
    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const animate = () => {
      group.rotation.y = Math.sin(Date.now() * 0.00055) * 0.12;
      group.rotation.x = Math.sin(Date.now() * 0.0004) * 0.05;
      orbit.rotation.z += 0.002;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} aria-hidden className="absolute inset-0" />;
}
