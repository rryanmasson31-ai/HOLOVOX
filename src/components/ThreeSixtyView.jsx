// components/ThreeSixtyView.jsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeSixtyView({ stream, isVisible }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const rendererRef = useRef(null);
  const sphereRef = useRef(null);
  const animationRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!containerRef.current || !stream || !isVisible) {
      return;
    }

    // Only initialize once
    if (initialized.current) {
      // Just ensure video is playing
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(e => console.log('Play resume:', e));
      }
      return;
    }

    console.log('🎬 Setting up 360° view');
    initialized.current = true;

    // Create video element
    const video = document.createElement('video');
    video.autoplay = true;
    video.playsInline = true;
    video.loop = true;
    video.muted = false;
    video.crossOrigin = 'anonymous';
    video.style.position = 'fixed';
    video.style.top = '-9999px';
    video.style.left = '-9999px';
    video.srcObject = stream;
    video.play().catch(e => console.log('Video play:', e));
    
    videoRef.current = video;
    document.body.appendChild(video);

    // Setup Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create sphere
    const geometry = new THREE.SphereGeometry(500, 64, 64);
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphereRef.current = sphere;

    // Mouse controls
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let isDragging = false;

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      targetX = (e.clientX / window.innerWidth) * Math.PI * 2;
      targetY = (e.clientY / window.innerHeight) * Math.PI;
    };

    const handleMouseDown = () => { isDragging = true; };
    const handleMouseUp = () => { isDragging = false; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (video.readyState >= 2) {
        texture.needsUpdate = true;
      }
      
      if (isDragging) {
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;
      }
      
      currentY = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, currentY));
      sphere.rotation.x = currentY;
      sphere.rotation.y = currentX;
      
      renderer.render(scene, camera);
    };
    
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      // Cleanup only when component unmounts
      console.log('🧹 Cleaning up 360° view');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement?.parentNode) {
          rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement);
        }
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        if (videoRef.current.parentNode) {
          videoRef.current.parentNode.removeChild(videoRef.current);
        }
      }
      initialized.current = false;
    };
  }, [stream, isVisible]);

  // Handle visibility changes
  useEffect(() => {
    if (videoRef.current && isVisible) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(e => console.log('Resume play:', e));
      }
    }
  }, [isVisible]);

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