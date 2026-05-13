import React, { useEffect, useRef } from 'react';

import styles from './temple-background.module.css';

const GATES = [
  {
    name: 'REALTIME',
    x: 0.2,
    tone: [92, 158, 224],
    core: [52, 112, 210],
    mode: 'nebula',
  },
  {
    name: 'INFRA',
    x: 0.4,
    tone: [218, 174, 88],
    core: [174, 122, 42],
    mode: 'dust',
  },
  {
    name: 'SECURITY',
    x: 0.6,
    tone: [224, 116, 64],
    core: [178, 54, 36],
    mode: 'ember',
  },
  {
    name: 'DEVICE',
    x: 0.8,
    tone: [102, 206, 146],
    core: [44, 150, 108],
    mode: 'pulse',
  },
];

export default function TempleBackground() {
  const hostRef = useRef(null);

  useEffect(() => {
    let sketchInstance;
    let cancelled = false;
    let removeMouseMove = () => {};

    const buildSketch = (p) => {
      const hallParticles = [];
      const portalParticles = [];
      const dustParticles = [];
      const fogBands = [];
      const hoverState = GATES.map(() => 0);
      const mouse = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
      };

      let width = 0;
      let height = 0;

      const makeHallParticle = () => ({
        x: p.random(-0.05, 1.05),
        y: p.random(0.08, 0.94),
        z: p.random(0.15, 1),
        drift: p.random(0.08, 0.24),
        size: p.random(0.8, 2.4),
        phase: p.random(p.TWO_PI),
      });

      const makePortalParticle = (gateIndex) => ({
        gateIndex,
        angle: p.random(p.TWO_PI),
        radius: p.random(0.04, 0.48),
        speed: p.random(0.14, 0.48),
        depth: p.random(0.2, 1),
        size: p.random(0.7, 2.8),
        phase: p.random(p.TWO_PI),
      });

      const makeDustParticle = () => ({
        x: p.random(-0.08, 1.08),
        y: p.random(0.16, 0.96),
        z: p.random(0.15, 1),
        drift: p.random(0.08, 0.26),
        size: p.random(0.8, 2.8),
        lag: p.random(0.018, 0.065),
        phase: p.random(p.TWO_PI),
      });

      const getGateBounds = (gate) => {
        const cameraPull = getCameraPull();
        const gateHeight = height * p.lerp(0.3, 0.36, cameraPull);
        const gateWidth = width * p.lerp(0.1, 0.122, cameraPull);
        const x = width * gate.x + (mouse.x - width * 0.5) * 0.012;
        const y = height * p.lerp(0.58, 0.55, cameraPull);

        return {
          x,
          y,
          w: gateWidth,
          h: gateHeight,
        };
      };

      const getCameraPull = () => Math.max(...hoverState) * 0.75;

      const resetScene = () => {
        width = hostRef.current?.clientWidth || window.innerWidth;
        height = hostRef.current?.clientHeight || window.innerHeight;

        p.pixelDensity(Math.min(window.devicePixelRatio || 1, 1.5));
        p.resizeCanvas(width, height);

        hallParticles.length = 0;
        portalParticles.length = 0;
        dustParticles.length = 0;
        fogBands.length = 0;

        const hallCount = Math.min(92, Math.max(34, Math.floor(width / 22)));

        for (let i = 0; i < hallCount; i += 1) {
          hallParticles.push(makeHallParticle());
        }

        const dustCount = Math.min(120, Math.max(44, Math.floor(width / 18)));

        for (let i = 0; i < dustCount; i += 1) {
          dustParticles.push(makeDustParticle());
        }

        GATES.forEach((_, gateIndex) => {
          for (let i = 0; i < 34; i += 1) {
            portalParticles.push(makePortalParticle(gateIndex));
          }
        });

        for (let i = 0; i < 8; i += 1) {
          fogBands.push({
            y: p.random(0.38, 0.9),
            depth: p.random(0.2, 1),
            speed: p.random(0.006, 0.024),
            offset: p.random(1000),
            alpha: p.random(8, 18),
          });
        }
      };

      const updateMouse = () => {
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        GATES.forEach((gate, index) => {
          const bounds = getGateBounds(gate);
          const dx = (mouse.x - bounds.x) / (bounds.w * 0.68);
          const dy = (mouse.y - bounds.y) / (bounds.h * 0.64);
          const inside = dx * dx + dy * dy < 1;
          const target = inside ? 1 : 0;
          hoverState[index] += (target - hoverState[index]) * 0.08;
        });
      };

      const drawGradient = () => {
        const ctx = p.drawingContext;
        const sky = ctx.createLinearGradient(0, 0, 0, height);

        sky.addColorStop(0, '#020308');
        sky.addColorStop(0.42, '#06070d');
        sky.addColorStop(0.72, '#0b0b12');
        sky.addColorStop(1, '#030305');

        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, width, height);
      };

      const drawVolumetricLight = (time) => {
        const cameraPull = getCameraPull();

        p.noStroke();

        for (let i = 0; i < 5; i += 1) {
          const cx =
            width * (0.34 + i * 0.08) +
            Math.sin(time * 0.12 + i) * width * 0.01 +
            (mouse.x - width * 0.5) * 0.018;
          const spread = width * (0.08 + i * 0.012 + cameraPull * 0.02);
          const alpha = 5 + cameraPull * 8;

          p.fill(218, 204, 172, alpha);
          p.quad(
            cx - spread * 0.18,
            -height * 0.04,
            cx + spread * 0.18,
            -height * 0.04,
            cx + spread,
            height,
            cx - spread,
            height
          );
        }
      };

      const drawHall = () => {
        const cameraPull = getCameraPull();
        const horizon = height * p.lerp(0.43, 0.4, cameraPull);
        const floorTop = height * p.lerp(0.58, 0.56, cameraPull);
        const center = width * 0.5 + (mouse.x - width * 0.5) * 0.01;

        p.noStroke();
        p.fill(3, 4, 8, 176);
        p.rect(0, horizon, width, height - horizon);

        p.stroke(184, 152, 98, 18);
        p.strokeWeight(1);

        for (let i = 0; i < 12; i += 1) {
          const t = i / 11;
          const x = p.lerp(center, width * (t < 0.5 ? -0.18 : 1.18), Math.abs(t - 0.5) * 2);
          p.line(center, floorTop, x, height);
        }

        for (let i = 0; i < 9; i += 1) {
          const y = p.lerp(floorTop, height * 0.98, i / 8);
          p.stroke(198, 171, 116, p.map(i, 0, 8, 18, 4));
          p.line(width * 0.05, y, width * 0.95, y);
        }

        p.noStroke();
        p.fill(0, 0, 0, 88);
        p.quad(0, height * 0.94, width * 0.32, floorTop, width * 0.68, floorTop, width, height * 0.94);
      };

      const drawPillars = () => {
        const cameraPull = getCameraPull();
        const horizon = height * 0.2;
        const base = height * 0.96;
        const parallax = (mouse.x - width * 0.5) * 0.015;

        for (let side = -1; side <= 1; side += 2) {
          for (let i = 0; i < 4; i += 1) {
            const depth = i / 3;
            const x =
              (side < 0
                ? p.lerp(width * 0.03, width * 0.28, depth)
                : p.lerp(width * 0.97, width * 0.72, depth)) -
              parallax * (1 - depth);
            const pillarWidth = p.lerp(width * 0.086, width * 0.034, depth) * (1 + cameraPull * 0.08);
            const top = p.lerp(height * -0.08, horizon, depth);
            const alpha = p.lerp(118, 34, depth);

            p.noStroke();
            p.fill(8, 8, 12, alpha);
            p.rect(x - pillarWidth / 2, top, pillarWidth, base - top);

            p.fill(202, 174, 124, p.lerp(12, 4, depth));
            p.rect(x - pillarWidth * 0.45, top, pillarWidth * 0.05, base - top);
            p.rect(x + pillarWidth * 0.4, top, pillarWidth * 0.05, base - top);
          }
        }
      };

      const drawDistantArchive = (time) => {
        p.noStroke();

        for (let i = 0; i < 7; i += 1) {
          const x = width * (0.18 + i * 0.105) + (mouse.x - width * 0.5) * 0.006;
          const h = height * (0.08 + (i % 3) * 0.025);

          p.fill(18, 18, 24, 70);
          p.rect(x, height * 0.32 - h, width * 0.024, h);

          p.fill(198, 162, 92, 6 + Math.sin(time * 0.4 + i) * 4);
          p.rect(x + width * 0.006, height * 0.32 - h * 0.72, width * 0.003, h * 0.45);
        }
      };

      const drawPortalInterior = (gate, index, time, bounds) => {
        const hover = hoverState[index];
        const [r, g, b] = gate.tone;
        const [cr, cg, cb] = gate.core;
        const distortionX = (mouse.x - bounds.x) * 0.025 * hover;
        const distortionY = (mouse.y - bounds.y) * 0.018 * hover;
        const spin = time * (0.09 + hover * 0.18) * (index % 2 === 0 ? 1 : -1);

        p.push();
        p.translate(bounds.x + distortionX, bounds.y + distortionY);
        p.noStroke();

        for (let i = 6; i >= 0; i -= 1) {
          const ratio = i / 6;
          const pulse = Math.sin(time * 1.3 + index + i * 0.55) * 0.08;
          const w = bounds.w * (0.36 + ratio * 0.72 + pulse + hover * 0.1);
          const h = bounds.h * (0.32 + ratio * 0.58 + pulse + hover * 0.08);
          const alpha = (7 + hover * 18) * (1 - ratio * 0.1);

          p.fill(
            p.lerp(cr, r, ratio),
            p.lerp(cg, g, ratio),
            p.lerp(cb, b, ratio),
            alpha
          );
          p.ellipse(0, -bounds.h * 0.12, w, h);
        }

        for (let i = 0; i < 5; i += 1) {
          const n = p.noise(index * 8, i * 0.4, time * (0.08 + hover * 0.08));
          const angle = spin + i * 1.26 + n * 0.7;
          const radius = bounds.w * (0.12 + i * 0.045);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius * 0.75 - bounds.h * 0.12;
          const alpha = 9 + hover * 18;

          if (gate.mode === 'nebula') {
            p.fill(96, 166, 255, alpha);
            p.ellipse(x, y, bounds.w * 0.42, bounds.h * 0.12);
          } else if (gate.mode === 'dust') {
            p.fill(236, 192, 98, alpha);
            p.ellipse(x, y, bounds.w * 0.2, bounds.h * 0.06);
          } else if (gate.mode === 'ember') {
            p.fill(238, 98, 42, alpha);
            p.ellipse(x, y, bounds.w * 0.18, bounds.h * 0.08);
          } else {
            p.fill(92, 222, 156, alpha);
            p.ellipse(x, y, bounds.w * (0.18 + Math.sin(time * 2 + i) * 0.04), bounds.h * 0.08);
          }
        }

        p.pop();
      };

      const drawPortalParticles = (time) => {
        portalParticles.forEach((particle) => {
          const gate = GATES[particle.gateIndex];
          const bounds = getGateBounds(gate);
          const hover = hoverState[particle.gateIndex];
          const [r, g, b] = gate.tone;
          const speed = particle.speed * (1 + hover * 2.2);

          particle.angle += speed * 0.006;
          particle.radius += Math.sin(time * 0.2 + particle.phase) * 0.00018;

          if (particle.radius > 0.52) {
            particle.radius = 0.04;
          }

          const wobble = p.noise(particle.phase, time * (0.12 + hover * 0.12)) - 0.5;
          const x =
            bounds.x +
            Math.cos(particle.angle + wobble) * bounds.w * particle.radius +
            (mouse.x - bounds.x) * 0.012 * hover * particle.depth;
          const y =
            bounds.y -
            bounds.h * 0.12 +
            Math.sin(particle.angle) * bounds.h * particle.radius * 0.72 +
            (mouse.y - bounds.y) * 0.008 * hover * particle.depth;
          const alpha = p.lerp(20, 76, particle.depth) * (0.7 + hover * 0.8);

          p.noStroke();
          p.fill(r, g, b, alpha);
          p.circle(x, y, particle.size * p.lerp(0.75, 1.85, particle.depth) * (1 + hover * 0.28));
        });
      };

      const drawGate = (gate, index, time) => {
        const bounds = getGateBounds(gate);
        const hover = hoverState[index];
        const [r, g, b] = gate.tone;
        const breathe = 0.5 + Math.sin(time * 0.9 + index) * 0.5;
        const glow = 16 + breathe * 14 + hover * 48;

        drawPortalInterior(gate, index, time, bounds);

        p.noFill();
        p.stroke(r, g, b, glow);
        p.strokeWeight(1.4 + hover * 1.4);
        p.arc(bounds.x, bounds.y, bounds.w, bounds.h, p.PI, p.TWO_PI);
        p.line(bounds.x - bounds.w / 2, bounds.y, bounds.x - bounds.w / 2, bounds.y + bounds.h * 0.42);
        p.line(bounds.x + bounds.w / 2, bounds.y, bounds.x + bounds.w / 2, bounds.y + bounds.h * 0.42);

        p.stroke(226, 207, 166, 10 + hover * 22);
        p.strokeWeight(1);
        for (let i = 0; i < 4; i += 1) {
          const y = bounds.y + bounds.h * (0.1 + i * 0.11);
          p.line(bounds.x - bounds.w * 0.32, y, bounds.x - bounds.w * 0.22, y + Math.sin(time + i) * 2);
          p.line(bounds.x + bounds.w * 0.22, y, bounds.x + bounds.w * 0.32, y + Math.cos(time + i) * 2);
        }

        p.noStroke();
        p.fill(222, 210, 180, 22 + hover * 54);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(Math.max(8, width * 0.0065));
        p.text(gate.name, bounds.x, bounds.y + bounds.h * 0.5);
      };

      const drawFog = (time) => {
        const cameraPull = getCameraPull();

        p.noStroke();
        fogBands.forEach((fog, index) => {
          const y = height * fog.y;
          const bandHeight = height * p.lerp(0.06, 0.16, fog.depth);
          const drift = ((time * fog.speed + fog.offset) % 1) * width;
          const mouseOffsetX = (mouse.x - width * 0.5) * 0.012 * fog.depth;
          const mouseOffsetY = (mouse.y - height * 0.5) * 0.008 * fog.depth;
          const alpha = fog.alpha + cameraPull * 16;

          p.fill(178, 184, 180, alpha);

          for (let i = -1; i < 3; i += 1) {
            const x = i * width * 0.5 + drift - width * 0.5 + mouseOffsetX;

            p.ellipse(
              x,
              y + Math.sin(time * 0.08 + index) * 4 + mouseOffsetY,
              width * 0.62,
              bandHeight
            );
          }
        });
      };

      const drawHallParticles = (time) => {
        p.noStroke();

        hallParticles.forEach((particle) => {
          particle.y -= 0.00008 * particle.drift * (1 + getCameraPull());
          particle.x += Math.sin(time * 0.12 + particle.phase) * 0.00003;

          if (particle.y < 0.05) {
            Object.assign(particle, makeHallParticle(), { y: 0.95 });
          }

          const px = particle.x * width + (mouse.x - width * 0.5) * 0.01 * particle.z;
          const py = particle.y * height + (mouse.y - height * 0.5) * 0.006 * particle.z;
          const size = particle.size * p.lerp(0.5, 1.4, particle.z);
          const alpha =
            p.lerp(8, 32, particle.z) *
            (0.72 + Math.sin(time + particle.phase) * 0.14);

          p.fill(229, 211, 166, alpha);
          p.circle(px, py, size);
        });
      };

      const drawMouseDust = (time) => {
        p.noStroke();

        const cursorPullX = mouse.x - width * 0.5;
        const cursorPullY = mouse.y - height * 0.5;

        dustParticles.forEach((particle) => {
          particle.x +=
            Math.sin(time * 0.24 + particle.phase) * 0.00008 * particle.drift +
            cursorPullX * 0.00000042 * particle.z;

          particle.y +=
            Math.cos(time * 0.18 + particle.phase) * 0.00006 * particle.drift +
            cursorPullY * 0.00000034 * particle.z -
            0.000035 * particle.drift;

          if (particle.x < -0.1 || particle.x > 1.1 || particle.y < 0.08) {
            Object.assign(particle, makeDustParticle(), {
              y: p.random(0.72, 1.04),
            });
          }

          const px =
            particle.x * width +
            cursorPullX * particle.lag * particle.z;

          const py =
            particle.y * height +
            cursorPullY * particle.lag * 0.62 * particle.z;

          const distance = p.dist(mouse.x, mouse.y, px, py);
          const wake = p.constrain(1 - distance / Math.max(180, width * 0.18), 0, 1);
          const shimmer = 0.74 + Math.sin(time * 1.6 + particle.phase) * 0.22;
          const alpha = (10 + particle.z * 28 + wake * 32) * shimmer;

          p.fill(235, 218, 176, alpha);
          p.circle(
            px,
            py,
            particle.size * p.lerp(0.7, 1.8, particle.z) * (1 + wake * 0.9)
          );
        });
      };

      p.setup = () => {
        const canvas = p.createCanvas(1, 1);
        canvas.parent(hostRef.current);
        canvas.elt.setAttribute('aria-hidden', 'true');

        p.frameRate(30);
        p.textFont('Georgia');
        resetScene();

        const handleMouseMove = (event) => {
          mouse.targetX = event.clientX;
          mouse.targetY = event.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        removeMouseMove = () => window.removeEventListener('mousemove', handleMouseMove);
      };

      p.draw = () => {
        const time = p.millis() * 0.001;

        updateMouse();
        drawGradient();
        drawVolumetricLight(time);
        drawDistantArchive(time);
        drawPillars();
        drawHall();
        GATES.forEach((gate, index) => drawGate(gate, index, time));
        drawPortalParticles(time);
        drawFog(time);
        drawHallParticles(time);
        drawMouseDust(time);
      };

      p.windowResized = () => {
        resetScene();
      };
    };

    import('p5').then(({ default: P5 }) => {
      if (cancelled || !hostRef.current) {
        return;
      }

      sketchInstance = new P5(buildSketch);
    });

    return () => {
      cancelled = true;
      removeMouseMove();
      sketchInstance?.remove();
    };
  }, []);

  return <div ref={hostRef} className={styles.templeBackground} />;
}
