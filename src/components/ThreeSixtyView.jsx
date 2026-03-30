import { memo, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

const ThreeSixtyView = memo(({ stream, isVisible }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const sphereRef = useRef(null);
  const animationRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });

  // Cleanup function
  const cleanup = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (rendererRef.current) {
      rendererRef.current.dispose();
      if (rendererRef.current.domElement && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
      videoRef.current.remove();
      videoRef.current = null;
    }
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }
    cameraRef.current = null;
    sphereRef.current = null;
  }, []);

  // Setup function
  const setup = useCallback(() => {
    if (!containerRef.current || !stream) return;

    // Create hidden video element
    const video = document.createElement('video');
    video.autoplay = true;
    video.playsInline = true;
    video.loop = true;
    video.muted = true;
    video.crossOrigin = 'anonymous';
    video.style.position = 'fixed';
    video.style.top = '-9999px';
    video.style.left = '-9999px';
    video.srcObject = stream;

    const playVideo = () => {
      video.play().catch(e => {
        console.warn("360 video play failed, retrying in 1s", e);
        setTimeout(playVideo, 1000);
      });
    };
    video.onloadedmetadata = () => {
      console.log("360 video metadata loaded");
      playVideo();
    };
    document.body.appendChild(video);
    videoRef.current = video;

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 0, 0.1);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(1, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.SphereGeometry(500, 48, 32);
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphereRef.current = sphere;

    // Mouse / touch controls
    const onMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const dx = (e.clientX - lastMouseRef.current.x) * 0.005;
      const dy = (e.clientY - lastMouseRef.current.y) * 0.005;
      targetRotationRef.current.y += dx;
      targetRotationRef.current.x += dy;
      targetRotationRef.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetRotationRef.current.x));
      lastMouseRef.current.x = e.clientX;
      lastMouseRef.current.y = e.clientY;
    };
    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      lastMouseRef.current.x = e.clientX;
      lastMouseRef.current.y = e.clientY;
    };
    const onMouseUp = () => { isDraggingRef.current = false; };
    const onTouchMove = (e) => {
      if (e.touches.length === 1) {
        const dx = (e.touches[0].clientX - lastMouseRef.current.x) * 0.005;
        const dy = (e.touches[0].clientY - lastMouseRef.current.y) * 0.005;
        targetRotationRef.current.y += dx;
        targetRotationRef.current.x += dy;
        targetRotationRef.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetRotationRef.current.x));
        lastMouseRef.current.x = e.touches[0].clientX;
        lastMouseRef.current.y = e.touches[0].clientY;
      }
    };
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        lastMouseRef.current.x = e.touches[0].clientX;
        lastMouseRef.current.y = e.touches[0].clientY;
        e.preventDefault();
      }
    };
    const onTouchEnd = () => { isDraggingRef.current = false; };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchend', onTouchEnd);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.1;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.1;
      if (sphereRef.current) {
        sphereRef.current.rotation.x = currentRotationRef.current.x;
        sphereRef.current.rotation.y = currentRotationRef.current.y;
      }
      if (video.readyState >= 2) texture.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    // Resize function
    const resize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      if (clientWidth === 0 || clientHeight === 0) return;
      if (cameraRef.current) {
        cameraRef.current.aspect = clientWidth / clientHeight;
        cameraRef.current.updateProjectionMatrix();
      }
      if (rendererRef.current) {
        rendererRef.current.setSize(clientWidth, clientHeight);
      }
    };

    // Use ResizeObserver to catch size changes (including initial mount)
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(containerRef.current);
    resizeObserverRef.current = resizeObserver;

    // Also call resize multiple times to ensure the canvas catches the final layout
    // after any animations (e.g., AnimatePresence) have completed.
    const requestResize = () => {
      resize();
      // Additional retries for layouts that settle after a few frames
      requestAnimationFrame(resize);
      setTimeout(resize, 50);
      setTimeout(resize, 150);
    };

    // Start with a microtask, then requestAnimationFrame, then a few timeouts
    Promise.resolve().then(requestResize);
    requestAnimationFrame(requestResize);

    const onWindowResize = () => resize();
    window.addEventListener('resize', onWindowResize);

    const cleanupHandlers = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onWindowResize);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };

    return cleanupHandlers;
  }, [stream]);

  // Use useEffect to handle visibility changes and setup/cleanup
  useEffect(() => {
    if (!containerRef.current || !isVisible || !stream) {
      cleanup();
      return;
    }
    const cleanupHandlers = setup();
    return () => {
      cleanupHandlers?.();
      cleanup();
    };
  }, [isVisible, stream, setup, cleanup]);

  if (!stream) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
        <div className="text-center text-white/60">No video for 360° view</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-lg px-4 py-2 rounded-full text-sm z-10">
        🖱️ Click and drag to look around
      </div>
    </div>
  );
});

export default ThreeSixtyView;












// import { memo, useEffect, useRef, useCallback } from 'react';
// import * as THREE from 'three';

// const ThreeSixtyView = memo(({ stream, isVisible }) => {
//   const containerRef = useRef(null);
//   const videoRef = useRef(null);
//   const rendererRef = useRef(null);
//   const sceneRef = useRef(null);
//   const cameraRef = useRef(null);
//   const sphereRef = useRef(null);
//   const animationRef = useRef(null);
//   const isDraggingRef = useRef(false);
//   const lastMouseRef = useRef({ x: 0, y: 0 });
//   const targetRotationRef = useRef({ x: 0, y: 0 });
//   const currentRotationRef = useRef({ x: 0, y: 0 });

//   const cleanup = useCallback(() => {
//     if (animationRef.current) {
//       cancelAnimationFrame(animationRef.current);
//       animationRef.current = null;
//     }
//     if (rendererRef.current) {
//       rendererRef.current.dispose();
//       if (rendererRef.current.domElement && containerRef.current) {
//         containerRef.current.removeChild(rendererRef.current.domElement);
//       }
//       rendererRef.current = null;
//     }
//     if (videoRef.current) {
//       videoRef.current.pause();
//       videoRef.current.srcObject = null;
//       videoRef.current.remove();
//       videoRef.current = null;
//     }
//     sceneRef.current = null;
//     cameraRef.current = null;
//     sphereRef.current = null;
//   }, []);

//   const setup = useCallback(() => {
//     if (!containerRef.current || !stream) return;

//     const video = document.createElement('video');
//     video.autoplay = true;
//     video.playsInline = true;
//     video.loop = true;
//     video.muted = true;
//     video.crossOrigin = 'anonymous';
//     video.style.position = 'fixed';
//     video.style.top = '-9999px';
//     video.style.left = '-9999px';
//     video.srcObject = stream;
//     video.onloadedmetadata = () => video.play().catch(() => {});
//     document.body.appendChild(video);
//     videoRef.current = video;

//     const scene = new THREE.Scene();
//     sceneRef.current = scene;
//     const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
//     camera.position.set(0, 0, 0.1);
//     cameraRef.current = camera;
//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(1, 1);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     containerRef.current.appendChild(renderer.domElement);
//     rendererRef.current = renderer;

//     const geometry = new THREE.SphereGeometry(500, 48, 32);
//     const texture = new THREE.VideoTexture(video);
//     texture.minFilter = THREE.LinearFilter;
//     texture.magFilter = THREE.LinearFilter;
//     const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
//     const sphere = new THREE.Mesh(geometry, material);
//     scene.add(sphere);
//     sphereRef.current = sphere;

//     const onMouseMove = (e) => {
//       if (!isDraggingRef.current) return;
//       const dx = (e.clientX - lastMouseRef.current.x) * 0.005;
//       const dy = (e.clientY - lastMouseRef.current.y) * 0.005;
//       targetRotationRef.current.y += dx;
//       targetRotationRef.current.x += dy;
//       targetRotationRef.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetRotationRef.current.x));
//       lastMouseRef.current.x = e.clientX;
//       lastMouseRef.current.y = e.clientY;
//     };
//     const onMouseDown = (e) => {
//       isDraggingRef.current = true;
//       lastMouseRef.current.x = e.clientX;
//       lastMouseRef.current.y = e.clientY;
//     };
//     const onMouseUp = () => { isDraggingRef.current = false; };
//     const onTouchMove = (e) => {
//       if (e.touches.length === 1) {
//         const dx = (e.touches[0].clientX - lastMouseRef.current.x) * 0.005;
//         const dy = (e.touches[0].clientY - lastMouseRef.current.y) * 0.005;
//         targetRotationRef.current.y += dx;
//         targetRotationRef.current.x += dy;
//         targetRotationRef.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetRotationRef.current.x));
//         lastMouseRef.current.x = e.touches[0].clientX;
//         lastMouseRef.current.y = e.touches[0].clientY;
//       }
//     };
//     const onTouchStart = (e) => {
//       if (e.touches.length === 1) {
//         isDraggingRef.current = true;
//         lastMouseRef.current.x = e.touches[0].clientX;
//         lastMouseRef.current.y = e.touches[0].clientY;
//         e.preventDefault();
//       }
//     };
//     const onTouchEnd = () => { isDraggingRef.current = false; };

//     window.addEventListener('mousemove', onMouseMove);
//     window.addEventListener('mousedown', onMouseDown);
//     window.addEventListener('mouseup', onMouseUp);
//     window.addEventListener('touchmove', onTouchMove);
//     window.addEventListener('touchstart', onTouchStart);
//     window.addEventListener('touchend', onTouchEnd);

//     const animate = () => {
//       animationRef.current = requestAnimationFrame(animate);
//       currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.1;
//       currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.1;
//       if (sphereRef.current) {
//         sphereRef.current.rotation.x = currentRotationRef.current.x;
//         sphereRef.current.rotation.y = currentRotationRef.current.y;
//       }
//       if (video.readyState >= 2) texture.needsUpdate = true;
//       renderer.render(scene, camera);
//     };
//     animate();

//     const onResize = () => {
//       if (!containerRef.current) return;
//       const width = containerRef.current.clientWidth;
//       const height = containerRef.current.clientHeight;
//       if (width && height) {
//         camera.aspect = width / height;
//         camera.updateProjectionMatrix();
//         renderer.setSize(width, height);
//       }
//     };
//     window.addEventListener('resize', onResize);
//     onResize();

//     const cleanupHandlers = () => {
//       window.removeEventListener('mousemove', onMouseMove);
//       window.removeEventListener('mousedown', onMouseDown);
//       window.removeEventListener('mouseup', onMouseUp);
//       window.removeEventListener('touchmove', onTouchMove);
//       window.removeEventListener('touchstart', onTouchStart);
//       window.removeEventListener('touchend', onTouchEnd);
//       window.removeEventListener('resize', onResize);
//     };

//     return cleanupHandlers;
//   }, [stream]);

//   useEffect(() => {
//     if (!containerRef.current || !isVisible || !stream) {
//       cleanup();
//       return;
//     }
//     const cleanupHandlers = setup();
//     return () => {
//       cleanupHandlers?.();
//       cleanup();
//     };
//   }, [isVisible, stream, setup, cleanup]);

//   if (!stream) {
//     return (
//       <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
//         <div className="text-center text-white/60">No video for 360° view</div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative w-screen h-full bg-black">
//       <div ref={containerRef} className="w-full h-full" />
//       <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-lg px-4 py-2 rounded-full text-sm z-10">
//         🖱️ Click and drag to look around
//       </div>
//     </div>
//   );
// });

// export default ThreeSixtyView;