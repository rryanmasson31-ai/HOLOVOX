import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeSixtyView({ stream, isVisible }) {
  const containerRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!containerRef.current || !stream || !isVisible || initialized.current) return;
    initialized.current = true;

    const video = document.createElement('video');
    video.autoplay = true;
    video.playsInline = true;
    video.loop = true;
    video.muted = false;
    video.style.position = 'fixed';
    video.style.top = '-9999px';
    video.style.left = '-9999px';
    video.srcObject = stream;

    video.onloadedmetadata = () => video.play().catch(() => {});
    document.body.appendChild(video);

    const geometry = new THREE.SphereGeometry(500, 48, 32);
    const texture = new THREE.VideoTexture(video);
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
    const sphere = new THREE.Mesh(geometry, material);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    scene.add(sphere);

    let targetY = 0, currentY = 0;
    let targetX = 0, currentX = 0;
    let isDragging = false;
    let lastX = 0, lastY = 0;

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = (e.clientX - lastX) * 0.005;
      const dy = (e.clientY - lastY) * 0.005;
      targetY += dx;
      targetX += dy;
      targetX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetX));
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onMouseDown = (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onMouseUp = () => { isDragging = false; };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      sphere.rotation.x = currentX;
      sphere.rotation.y = currentY;
      if (video.readyState >= 2) texture.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      video.pause();
      video.srcObject = null;
      video.remove();
      if (containerRef.current) containerRef.current.innerHTML = '';
      initialized.current = false;
    };
  }, [stream, isVisible]);

  if (!stream) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
        <div className="text-center text-white/60">No video for 360° view</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-lg px-4 py-2 rounded-full text-sm z-10">
        🖱️ Click and drag to look around
      </div>
    </div>
  );
}