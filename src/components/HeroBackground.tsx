import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  CONFIGURATION — Campus Event Theme                                      ║
// ╚════════════════════════════════════════════════════════════════════════════╝

const CONFIG = {
  PARTICLES: {
    COUNT_DESKTOP: 80,
    COUNT_MOBILE: 30,
    CONFETTI_DESKTOP: 120,
    CONFETTI_MOBILE: 40,
  },
  COLORS: {
    BG_TOP: 0x0a0a1a,
    BG_MID: 0x100d25,
    BG_BOT: 0x0d0820,
    PRIMARY: 0x6366f1,
    SECONDARY: 0x8b5cf6,
    PINK: 0xec4899,
    AMBER: 0xf59e0b,
    EMERALD: 0x10b981,
    CYAN: 0x06b6d4,
  },
  PERF: {
    MAX_DPR: 1.5,
    MOBILE_BREAKPOINT: 768,
  },
  PARALLAX: {
    CAMERA_STRENGTH: 0.008,
    LERP: 0.04,
  },
};


// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  HERO BACKGROUND COMPONENT                                                ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const HeroBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    frameId: number;
    clock: THREE.Clock;
    isMobile: boolean;
    isVisible: boolean;
    mouse: { x: number; y: number; tx: number; ty: number };
    bgPlane: THREE.Mesh | null;
    confettiGeo: THREE.BufferGeometry | null;
    confettiVelocities: Float32Array | null;
    orbitGeo: THREE.BufferGeometry | null;
    ringMeshes: THREE.Mesh[];
  }>({
    renderer: null,
    scene: null,
    camera: null,
    frameId: 0,
    clock: new THREE.Clock(),
    isMobile: false,
    isVisible: true,
    mouse: { x: 0, y: 0, tx: 0, ty: 0 },
    bgPlane: null,
    confettiGeo: null,
    confettiVelocities: null,
    orbitGeo: null,
    ringMeshes: [],
  });


  // ════════════════════════════════════════════════════════════════════════
  // SCENE SETUP
  // ════════════════════════════════════════════════════════════════════════

  const initScene = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const S = stateRef.current;

    const w = container.clientWidth;
    const h = container.clientHeight;
    S.isMobile = w < CONFIG.PERF.MOBILE_BREAKPOINT;

    const renderer = new THREE.WebGLRenderer({
      antialias: !S.isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, CONFIG.PERF.MAX_DPR));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    S.renderer = renderer;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(CONFIG.COLORS.BG_TOP, 0.012);
    S.scene = scene;

    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 150);
    camera.position.set(0, 0, 22);
    S.camera = camera;

    // Build layers
    buildBackground(scene);
    buildFloatingConfetti(scene, S);
    buildGlowOrbs(scene, S);
    buildEventRings(scene, S);
    buildLighting(scene);
  }, []);


  // ════════════════════════════════════════════════════════════════════════
  // LAYER 1: ANIMATED GRADIENT BACKGROUND
  // ════════════════════════════════════════════════════════════════════════

  const buildBackground = (scene: THREE.Scene) => {
    const S = stateRef.current;
    const geo = new THREE.PlaneGeometry(100, 60);
    const mat = new THREE.ShaderMaterial({
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uColorTop: { value: new THREE.Color(CONFIG.COLORS.BG_TOP) },
        uColorMid: { value: new THREE.Color(CONFIG.COLORS.BG_MID) },
        uColorBot: { value: new THREE.Color(CONFIG.COLORS.BG_BOT) },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uColorTop;
        uniform vec3 uColorMid;
        uniform vec3 uColorBot;
        varying vec2 vUv;

        float hash21(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        float vnoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash21(i);
          float b = hash21(i + vec2(1.0, 0.0));
          float c = hash21(i + vec2(0.0, 1.0));
          float d = hash21(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 p) {
          float v = 0.0; float a = 0.5;
          for (int i = 0; i < 4; i++) { v += a * vnoise(p); p *= 2.0; a *= 0.5; }
          return v;
        }

        void main() {
          float t = pow(vUv.y, 0.85);
          vec3 base = mix(uColorBot, uColorTop, t);
          base = mix(base, uColorMid, smoothstep(0.2, 0.5, t) * smoothstep(0.8, 0.5, t) * 0.7);

          // Slow drifting color blobs — like stage lights
          float d1 = length(vUv - vec2(0.25 + sin(uTime * 0.04) * 0.1, 0.6 + cos(uTime * 0.03) * 0.08));
          base += vec3(0.20, 0.05, 0.35) * smoothstep(0.4, 0.0, d1) * 0.35;

          float d2 = length(vUv - vec2(0.75 + cos(uTime * 0.05) * 0.08, 0.35 + sin(uTime * 0.04) * 0.06));
          base += vec3(0.05, 0.10, 0.30) * smoothstep(0.35, 0.0, d2) * 0.30;

          float d3 = length(vUv - vec2(0.5 + sin(uTime * 0.03) * 0.05, 0.5));
          base += vec3(0.30, 0.05, 0.20) * smoothstep(0.5, 0.0, d3) * 0.15;

          // Subtle noise overlay
          float n = fbm(vUv * 4.0 + uTime * 0.01);
          base += vec3(0.08, 0.04, 0.15) * n * 0.15;

          // Vignette
          float vignette = 1.0 - length((vUv - 0.5) * vec2(1.3, 1.0)) * 0.55;
          base *= vignette;

          gl_FragColor = vec4(base, 1.0);
        }
      `,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.z = -30;
    mesh.renderOrder = -100;
    scene.add(mesh);
    S.bgPlane = mesh;
  };


  // ════════════════════════════════════════════════════════════════════════
  // LAYER 2: FLOATING CONFETTI PARTICLES (event/celebration feel)
  // ════════════════════════════════════════════════════════════════════════

  const buildFloatingConfetti = (scene: THREE.Scene, S: typeof stateRef.current) => {
    const count = S.isMobile ? CONFIG.PARTICLES.CONFETTI_MOBILE : CONFIG.PARTICLES.CONFETTI_DESKTOP;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    const palette = [
      new THREE.Color(CONFIG.COLORS.PRIMARY),
      new THREE.Color(CONFIG.COLORS.SECONDARY),
      new THREE.Color(CONFIG.COLORS.PINK),
      new THREE.Color(CONFIG.COLORS.AMBER),
      new THREE.Color(CONFIG.COLORS.EMERALD),
      new THREE.Color(CONFIG.COLORS.CYAN),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 20 - 5;
      sizes[i] = 1.5 + Math.random() * 4;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      velocities[i3] = (Math.random() - 0.5) * 0.03;
      velocities[i3 + 1] = 0.01 + Math.random() * 0.04; // gentle upward drift
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, CONFIG.PERF.MAX_DPR) },
        uTime: { value: 0 },
      },
      vertexShader: /* glsl */ `
        attribute float size;
        attribute vec3 color;
        uniform float uPixelRatio;
        uniform float uTime;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);

          // Twinkle animation
          float twinkle = sin(uTime * 2.0 + position.x * 5.0 + position.y * 3.0) * 0.5 + 0.5;
          vAlpha = 0.3 + twinkle * 0.7;

          // Depth fade
          float depth = smoothstep(-25.0, -3.0, mv.z);
          vAlpha *= depth * 0.85;

          gl_PointSize = size * uPixelRatio * (280.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float d = length(gl_PointCoord - 0.5);
          float core = smoothstep(0.15, 0.0, d);
          float glow = smoothstep(0.45, 0.0, d) * 0.3;
          float bloom = smoothstep(0.5, 0.0, d) * 0.1;
          float alpha = (core + glow + bloom) * vAlpha;
          if (alpha < 0.005) discard;
          vec3 col = vColor * (1.0 + core * 1.2);
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });

    const points = new THREE.Points(geo, mat);
    points.renderOrder = 10;
    scene.add(points);
    S.confettiGeo = geo;
    S.confettiVelocities = velocities;
  };


  // ════════════════════════════════════════════════════════════════════════
  // LAYER 3: GLOWING ORB LIGHTS (spotlight / stage feel)
  // ════════════════════════════════════════════════════════════════════════

  const buildGlowOrbs = (scene: THREE.Scene, S: typeof stateRef.current) => {
    const count = S.isMobile ? 3 : 5;
    const orbColors = [0x6366f1, 0xec4899, 0x8b5cf6, 0xf59e0b, 0x06b6d4];
    
    for (let i = 0; i < count; i++) {
      const geo = new THREE.SphereGeometry(0.6 + Math.random() * 0.4, 16, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: orbColors[i % orbColors.length],
        transparent: true,
        opacity: 0.15,
      });
      const orb = new THREE.Mesh(geo, mat);
      orb.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 16,
        -8 + Math.random() * 6,
      );
      orb.userData = {
        baseX: orb.position.x,
        baseY: orb.position.y,
        speed: 0.3 + Math.random() * 0.5,
        amplitude: 2 + Math.random() * 3,
        phase: Math.random() * Math.PI * 2,
      };
      scene.add(orb);
    }
  };


  // ════════════════════════════════════════════════════════════════════════
  // LAYER 4: EVENT RINGS (abstract circular elements — like calendar/event icons)
  // ════════════════════════════════════════════════════════════════════════

  const buildEventRings = (scene: THREE.Scene, S: typeof stateRef.current) => {
    const ringCount = S.isMobile ? 2 : 4;
    const ringColors = [0x6366f1, 0x8b5cf6, 0xec4899, 0x06b6d4];

    for (let i = 0; i < ringCount; i++) {
      const radius = 2 + Math.random() * 3;
      const geo = new THREE.RingGeometry(radius, radius + 0.05, 64);
      const mat = new THREE.MeshBasicMaterial({
        color: ringColors[i],
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.position.set(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 14,
        -10 - Math.random() * 5,
      );
      ring.rotation.x = Math.random() * Math.PI * 0.4;
      ring.rotation.y = Math.random() * Math.PI * 0.4;
      ring.userData = {
        rotSpeed: 0.1 + Math.random() * 0.3,
        floatSpeed: 0.2 + Math.random() * 0.3,
        floatAmp: 0.5 + Math.random() * 1,
        baseY: ring.position.y,
      };
      scene.add(ring);
      S.ringMeshes.push(ring);
    }
  };


  // ════════════════════════════════════════════════════════════════════════
  // LIGHTING
  // ════════════════════════════════════════════════════════════════════════

  const buildLighting = (scene: THREE.Scene) => {
    const ambient = new THREE.AmbientLight(0x1a103a, 0.5);
    scene.add(ambient);

    const configs: [number, number, number, number, number][] = [
      [CONFIG.COLORS.PRIMARY, 2.0, 35, 8, 6],
      [CONFIG.COLORS.SECONDARY, 1.5, 30, -8, -5],
      [CONFIG.COLORS.PINK, 1.0, 25, 0, 8],
    ];

    for (const [color, intensity, dist, x, y] of configs) {
      const pl = new THREE.PointLight(color, intensity, dist);
      pl.position.set(x, y, 12);
      scene.add(pl);
    }
  };


  // ════════════════════════════════════════════════════════════════════════
  // ANIMATION LOOP
  // ════════════════════════════════════════════════════════════════════════

  const animate = useCallback(() => {
    const S = stateRef.current;
    S.frameId = requestAnimationFrame(animate);

    if (!S.isVisible || !S.scene || !S.camera || !S.renderer) return;

    const t = S.clock.getElapsedTime();

    // Smooth mouse lerp
    const m = S.mouse;
    m.x += (m.tx - m.x) * CONFIG.PARALLAX.LERP;
    m.y += (m.ty - m.y) * CONFIG.PARALLAX.LERP;

    // Camera parallax
    const cs = CONFIG.PARALLAX.CAMERA_STRENGTH;
    S.camera.position.x = m.x * cs * 8;
    S.camera.position.y = m.y * cs * 5;
    S.camera.position.z = 22 + Math.sin(t * 0.1) * 0.3;
    S.camera.lookAt(0, 0, 0);

    // Update background shader
    if (S.bgPlane) {
      (S.bgPlane.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
    }

    // Animate confetti particles
    if (S.confettiGeo && S.confettiVelocities) {
      const pos = S.confettiGeo.attributes.position.array as Float32Array;
      const vel = S.confettiVelocities;
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        pos[i3] += vel[i3];
        pos[i3 + 1] += vel[i3 + 1];
        pos[i3 + 2] += vel[i3 + 2];

        // Gentle sine wave drift
        pos[i3] += Math.sin(t * 0.5 + i) * 0.003;

        // Wrap around bounds
        if (pos[i3] > 25) pos[i3] = -25;
        if (pos[i3] < -25) pos[i3] = 25;
        if (pos[i3 + 1] > 15) pos[i3 + 1] = -15;
        if (pos[i3 + 1] < -15) pos[i3 + 1] = 15;
      }

      S.confettiGeo.attributes.position.needsUpdate = true;
      const mat = (S.confettiGeo as any).__points?.material as THREE.ShaderMaterial;

      // Update time uniform via the points object
      S.scene.children.forEach(child => {
        if (child instanceof THREE.Points && child.geometry === S.confettiGeo) {
          (child.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
        }
      });
    }

    // Animate glow orbs
    S.scene.children.forEach(child => {
      if (child instanceof THREE.Mesh && child.userData.amplitude) {
        const d = child.userData;
        child.position.x = d.baseX + Math.sin(t * d.speed + d.phase) * d.amplitude;
        child.position.y = d.baseY + Math.cos(t * d.speed * 0.7 + d.phase) * d.amplitude * 0.6;
      }
    });

    // Animate event rings
    S.ringMeshes.forEach(ring => {
      const d = ring.userData;
      ring.rotation.z += d.rotSpeed * 0.005;
      ring.position.y = d.baseY + Math.sin(t * d.floatSpeed) * d.floatAmp;
    });

    S.renderer.render(S.scene, S.camera);
  }, []);


  // ════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    initScene();
    const S = stateRef.current;
    S.frameId = requestAnimationFrame(animate);

    // Mouse
    const onMouse = (e: MouseEvent) => {
      S.mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      S.mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    // Resize
    const onResize = () => {
      const container = containerRef.current;
      if (!container || !S.renderer || !S.camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      S.camera.aspect = w / h;
      S.camera.updateProjectionMatrix();
      S.renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // Visibility
    const onVis = () => {
      S.isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(S.frameId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      if (S.renderer) {
        S.renderer.dispose();
        S.renderer.domElement.remove();
      }
    };
  }, [initScene, animate]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
};
