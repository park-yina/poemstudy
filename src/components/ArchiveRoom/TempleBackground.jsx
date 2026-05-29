import React, { useEffect, useRef } from 'react';

import styles from './temple-background.module.css';

const defaultGateThemes = {
  cosmos: {
    tone: [96, 166, 255],
    core: [18, 34, 76],
  },
  forge: {
    tone: [236, 164, 72],
    core: [74, 26, 18],
  },
  seal: {
    tone: [238, 180, 82],
    core: [54, 18, 12],
  },
  machine: {
    tone: [92, 222, 156],
    core: [12, 52, 38],
  },
};

const fallbackTheme = {
  type: 'cosmos',
  tone: [198, 162, 92],
  core: [24, 18, 34],
};

const normalizeColor = (color, fallback) => (
  Array.isArray(color) && color.length >= 3
    ? color
    : fallback
);

const clamp01 = (value) => Math.max(0, Math.min(1, value));

const GATES = [
  {
    name: 'REALTIME',
    x: 0.2,
    mode: 'nebula',
    type: 'cosmos',
    ...defaultGateThemes.cosmos,
  },
  {
    name: 'INFRA',
    x: 0.4,
    mode: 'ember',
    type: 'forge',
    ...defaultGateThemes.forge,
  },
  {
    name: 'SECURITY',
    x: 0.6,
    mode: 'dust',
    type: 'seal',
    ...defaultGateThemes.seal,
  },
  {
    name: 'DEVICE',
    x: 0.8,
    mode: 'signal',
    type: 'machine',
    ...defaultGateThemes.machine,
  },
].map((gate) => {
  const fallback =
    defaultGateThemes[gate.type] ?? fallbackTheme;

  return {
    ...gate,
    tone: normalizeColor(gate.tone, fallback.tone),
    core: normalizeColor(gate.core, fallback.core),
  };
});

export default function TempleBackground({
  ritualIntensity = 0,
}) {
  const hostRef = useRef(null);
  const intensityRef = useRef(ritualIntensity);

  useEffect(() => {
    intensityRef.current = clamp01(ritualIntensity);
  }, [ritualIntensity]);

  useEffect(() => {
    let sketchInstance;
    let cancelled = false;
    let removeMouseMove = () => {};

    const buildSketch = (p) => {
      const hallParticles = [];
      const portalParticles = [];
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

      const IDLE_AWAKENING = 0.12;
      const MAX_PARTICLE_ALPHA = 18;

      const getRitualIntensity = () => clamp01(intensityRef.current);

      const getAwakening = () => {
        const hoverAwakening = Math.max(...hoverState) * 0.58;

        return Math.max(
          IDLE_AWAKENING,
          getRitualIntensity(),
          hoverAwakening
        );
      };

      const getCameraPull = () => getAwakening() * 0.42;

      const makeHallParticle = () => ({
        x: p.random(-0.05, 1.05),
        y: p.random(0.12, 0.94),
        z: p.random(0.15, 1),
        drift: p.random(0.04, 0.12),
        size: p.random(0.6, 1.7),
        phase: p.random(p.TWO_PI),
      });

      const makePortalParticle = (gateIndex) => ({
        gateIndex,
        angle: p.random(p.TWO_PI),
        radius: p.random(0.06, 0.42),
        speed: p.random(0.08, 0.28),
        depth: p.random(0.2, 1),
        size: p.random(0.45, 1.6),
        phase: p.random(p.TWO_PI),
      });

      const getGateBounds = (gate) => {
        const cameraPull = getCameraPull();

        const gateHeight = height * p.lerp(0.28, 0.33, cameraPull);
        const gateWidth = width * p.lerp(0.092, 0.112, cameraPull);

        const x =
          width * gate.x +
          (mouse.x - width * 0.5) * 0.007;

        const y =
          height * p.lerp(0.59, 0.56, cameraPull);

        return {
          x,
          y,
          w: gateWidth,
          h: gateHeight,
        };
      };

      const resetScene = () => {
        width = hostRef.current?.clientWidth || window.innerWidth;
        height = hostRef.current?.clientHeight || window.innerHeight;

        p.pixelDensity(Math.min(window.devicePixelRatio || 1, 1.35));
        p.resizeCanvas(width, height);

        mouse.x = width * 0.5;
        mouse.y = height * 0.5;
        mouse.targetX = mouse.x;
        mouse.targetY = mouse.y;

        hallParticles.length = 0;
        portalParticles.length = 0;
        fogBands.length = 0;

        const hallCount = Math.min(
          64,
          Math.max(24, Math.floor(width / 34))
        );

        for (let i = 0; i < hallCount; i += 1) {
          hallParticles.push(makeHallParticle());
        }

        GATES.forEach((_, gateIndex) => {
          for (let i = 0; i < 20; i += 1) {
            portalParticles.push(makePortalParticle(gateIndex));
          }
        });

        for (let i = 0; i < 5; i += 1) {
          fogBands.push({
            y: p.random(0.44, 0.88),
            depth: p.random(0.2, 1),
            speed: p.random(0.003, 0.011),
            offset: p.random(1000),
            alpha: p.random(4, 10),
          });
        }
      };

      const updateMouse = () => {
        mouse.x += (mouse.targetX - mouse.x) * 0.045;
        mouse.y += (mouse.targetY - mouse.y) * 0.045;

        GATES.forEach((gate, index) => {
          const bounds = getGateBounds(gate);

          const dx = (mouse.x - bounds.x) / (bounds.w * 0.72);
          const dy = (mouse.y - bounds.y) / (bounds.h * 0.68);

          const inside = dx * dx + dy * dy < 1;
          const target = inside ? 1 : 0;

          hoverState[index] += (target - hoverState[index]) * 0.07;
        });
      };

      const drawGradient = () => {
        const ctx = p.drawingContext;
        const sky = ctx.createLinearGradient(0, 0, 0, height);

        sky.addColorStop(0, '#020308');
        sky.addColorStop(0.42, '#06070d');
        sky.addColorStop(0.72, '#090910');
        sky.addColorStop(1, '#030305');

        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, width, height);
      };

      const drawVolumetricLight = (time) => {
        const awakening = getAwakening();
        const cameraPull = getCameraPull();

        p.noStroke();

        for (let i = 0; i < 4; i += 1) {
          const cx =
            width * (0.36 + i * 0.09) +
            Math.sin(time * 0.08 + i) * width * 0.006 +
            (mouse.x - width * 0.5) * 0.01;

          const spread =
            width * (0.055 + i * 0.011 + cameraPull * 0.016);

          const alpha =
            0.8 + awakening * 5.5;

          p.fill(218, 204, 172, alpha);

          p.quad(
            cx - spread * 0.16,
            -height * 0.04,
            cx + spread * 0.16,
            -height * 0.04,
            cx + spread,
            height,
            cx - spread,
            height
          );
        }
      };

      const drawHall = () => {
        const awakening = getAwakening();
        const cameraPull = getCameraPull();

        const horizon = height * p.lerp(0.43, 0.4, cameraPull);
        const floorTop = height * p.lerp(0.59, 0.565, cameraPull);
        const center =
          width * 0.5 +
          (mouse.x - width * 0.5) * 0.007;

        p.noStroke();
        p.fill(3, 4, 8, 190);
        p.rect(0, horizon, width, height - horizon);

        p.stroke(184, 152, 98, 3 + awakening * 9);
        p.strokeWeight(1);

        for (let i = 0; i < 12; i += 1) {
          const t = i / 11;
          const x = p.lerp(
            center,
            width * (t < 0.5 ? -0.18 : 1.18),
            Math.abs(t - 0.5) * 2
          );

          p.line(center, floorTop, x, height);
        }

        for (let i = 0; i < 9; i += 1) {
          const y = p.lerp(floorTop, height * 0.98, i / 8);

          p.stroke(
            198,
            171,
            116,
            p.map(i, 0, 8, 5 + awakening * 10, 1.5 + awakening * 3)
          );

          p.line(width * 0.05, y, width * 0.95, y);
        }

        p.noStroke();
        p.fill(0, 0, 0, 76);
        p.quad(
          0,
          height * 0.95,
          width * 0.32,
          floorTop,
          width * 0.68,
          floorTop,
          width,
          height * 0.95
        );
      };

      const drawPillars = () => {
        const awakening = getAwakening();
        const cameraPull = getCameraPull();

        const horizon = height * 0.2;
        const base = height * 0.96;
        const parallax = (mouse.x - width * 0.5) * 0.01;

        for (let side = -1; side <= 1; side += 2) {
          for (let i = 0; i < 4; i += 1) {
            const depth = i / 3;

            const x =
              (
                side < 0
                  ? p.lerp(width * 0.03, width * 0.28, depth)
                  : p.lerp(width * 0.97, width * 0.72, depth)
              ) -
              parallax * (1 - depth);

            const pillarWidth =
              p.lerp(width * 0.086, width * 0.034, depth) *
              (1 + cameraPull * 0.06);

            const top = p.lerp(height * -0.08, horizon, depth);

            const alpha =
              p.lerp(62, 24, depth) +
              awakening * p.lerp(22, 8, depth);

            p.noStroke();
            p.fill(8, 8, 12, alpha);
            p.rect(x - pillarWidth / 2, top, pillarWidth, base - top);

            p.fill(202, 174, 124, p.lerp(8, 3, depth));
            p.rect(x - pillarWidth * 0.45, top, pillarWidth * 0.04, base - top);
            p.rect(x + pillarWidth * 0.41, top, pillarWidth * 0.04, base - top);
          }
        }
      };

      const drawDistantArchive = (time) => {
        const awakening = getAwakening();

        p.noStroke();

        for (let i = 0; i < 7; i += 1) {
          const x =
            width * (0.18 + i * 0.105) +
            (mouse.x - width * 0.5) * 0.004;

          const h = height * (0.08 + (i % 3) * 0.025);

          p.fill(18, 18, 24, 16 + awakening * 24);
          p.rect(x, height * 0.32 - h, width * 0.024, h);

          p.fill(
            198,
            162,
            92,
            2.5 + awakening * 5 + Math.sin(time * 0.28 + i) * 1.4
          );

          p.rect(
            x + width * 0.006,
            height * 0.32 - h * 0.72,
            width * 0.003,
            h * 0.45
          );
        }
      };

      const drawPortalInterior = (gate, index, time, bounds) => {
        const hover = hoverState[index];
        const awakening = getAwakening();

        const [r, g, b] = gate.tone;
        const [cr, cg, cb] = gate.core;

        const distortionX = (mouse.x - bounds.x) * 0.012 * hover;
        const distortionY = (mouse.y - bounds.y) * 0.009 * hover;

        const spin =
          time *
          (0.045 + hover * 0.12) *
          (index % 2 === 0 ? 1 : -1);

        p.push();
        p.translate(bounds.x + distortionX, bounds.y + distortionY);
        p.noStroke();

        for (let i = 6; i >= 0; i -= 1) {
          const ratio = i / 6;
          const pulse = Math.sin(time * 0.75 + index + i * 0.55) * 0.035;

          const w =
            bounds.w *
            (0.34 + ratio * 0.68 + pulse + hover * 0.065);

          const h =
            bounds.h *
            (0.3 + ratio * 0.54 + pulse + hover * 0.05);

          const alpha =
            (1.2 + awakening * 3.8 + hover * 10) *
            (1 - ratio * 0.12);

          p.fill(
            p.lerp(cr, r, ratio),
            p.lerp(cg, g, ratio),
            p.lerp(cb, b, ratio),
            alpha
          );

          p.ellipse(0, -bounds.h * 0.12, w, h);
        }

        for (let i = 0; i < 4; i += 1) {
          const n = p.noise(index * 8, i * 0.4, time * 0.06);
          const angle = spin + i * 1.42 + n * 0.5;
          const radius = bounds.w * (0.11 + i * 0.04);

          const x = Math.cos(angle) * radius;
          const y =
            Math.sin(angle) * radius * 0.72 -
            bounds.h * 0.12;

          const alpha = 2 + awakening * 5 + hover * 12;

          if (gate.mode === 'nebula') {
            p.fill(96, 166, 255, alpha);
            p.ellipse(x, y, bounds.w * 0.32, bounds.h * 0.08);
          } else if (gate.mode === 'dust') {
            p.fill(236, 192, 98, alpha);
            p.ellipse(x, y, bounds.w * 0.15, bounds.h * 0.045);
          } else if (gate.mode === 'ember') {
            p.fill(238, 98, 42, alpha);
            p.ellipse(x, y, bounds.w * 0.14, bounds.h * 0.06);
          } else {
            p.fill(92, 222, 156, alpha);
            p.ellipse(
              x,
              y,
              bounds.w * (0.14 + Math.sin(time * 1.2 + i) * 0.025),
              bounds.h * 0.06
            );
          }
        }

        p.pop();
      };

      const drawPortalParticles = (time) => {
        portalParticles.forEach((particle) => {
          const gate = GATES[particle.gateIndex];
          const bounds = getGateBounds(gate);
          const hover = hoverState[particle.gateIndex];
          const awakening = getAwakening();

          const [r, g, b] = gate.tone;

          const speed = particle.speed * (1 + hover * 1.35);

          particle.angle += speed * 0.0045;

          particle.radius +=
            Math.sin(time * 0.18 + particle.phase) * 0.00008;

          particle.radius = p.constrain(
            particle.radius,
            0.05,
            0.48
          );

          const wobble =
            p.noise(particle.phase, time * 0.08) - 0.5;

          const x =
            bounds.x +
            Math.cos(particle.angle + wobble) *
              bounds.w *
              particle.radius +
            (mouse.x - bounds.x) * 0.006 * hover * particle.depth;

          const y =
            bounds.y -
            bounds.h * 0.12 +
            Math.sin(particle.angle) *
              bounds.h *
              particle.radius *
              0.7 +
            (mouse.y - bounds.y) * 0.004 * hover * particle.depth;

          const alpha = Math.min(
            MAX_PARTICLE_ALPHA,
            p.lerp(2, 9, particle.depth) *
              (0.36 + awakening * 0.95 + hover * 1.2)
          );

          p.noStroke();
          p.fill(r, g, b, alpha);

          p.circle(
            x,
            y,
            particle.size *
              p.lerp(0.72, 1.45, particle.depth) *
              (1 + hover * 0.22)
          );
        });
      };

      const drawGate = (gate, index, time) => {
        const bounds = getGateBounds(gate);
        const hover = hoverState[index];
        const awakening = getAwakening();

        const [r, g, b] = gate.tone;

        const breathe =
          0.5 + Math.sin(time * 0.55 + index) * 0.5;

        const glow =
          3 +
          awakening * (5 + breathe * 5) +
          hover * 28;

        drawPortalInterior(gate, index, time, bounds);

        p.noFill();
        p.stroke(r, g, b, glow);
        p.strokeWeight(1.15 + hover * 1.05);

        p.arc(
          bounds.x,
          bounds.y,
          bounds.w,
          bounds.h,
          p.PI,
          p.TWO_PI
        );

        p.line(
          bounds.x - bounds.w / 2,
          bounds.y,
          bounds.x - bounds.w / 2,
          bounds.y + bounds.h * 0.42
        );

        p.line(
          bounds.x + bounds.w / 2,
          bounds.y,
          bounds.x + bounds.w / 2,
          bounds.y + bounds.h * 0.42
        );

        p.stroke(226, 207, 166, 2 + awakening * 5 + hover * 14);
        p.strokeWeight(1);

        for (let i = 0; i < 4; i += 1) {
          const y = bounds.y + bounds.h * (0.1 + i * 0.11);

          p.line(
            bounds.x - bounds.w * 0.32,
            y,
            bounds.x - bounds.w * 0.23,
            y + Math.sin(time * 0.6 + i) * 1.2
          );

          p.line(
            bounds.x + bounds.w * 0.23,
            y,
            bounds.x + bounds.w * 0.32,
            y + Math.cos(time * 0.6 + i) * 1.2
          );
        }

        p.noStroke();
        p.fill(222, 210, 180, 8 + awakening * 8 + hover * 34);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(Math.max(8, width * 0.0062));
        p.text(gate.name, bounds.x, bounds.y + bounds.h * 0.5);
      };

      const drawFog = (time) => {
        const cameraPull = getCameraPull();

        p.noStroke();

        fogBands.forEach((fog, index) => {
          const y = height * fog.y;
          const bandHeight =
            height * p.lerp(0.04, 0.105, fog.depth);

          const drift =
            ((time * fog.speed + fog.offset) % 1) * width;

          const mouseOffsetX =
            (mouse.x - width * 0.5) * 0.008 * fog.depth;

          const mouseOffsetY =
            (mouse.y - height * 0.5) * 0.004 * fog.depth;

          const alpha = fog.alpha * 0.18 + cameraPull * 6;

          p.fill(178, 184, 180, alpha);

          for (let i = -1; i < 3; i += 1) {
            const x =
              i * width * 0.5 +
              drift -
              width * 0.5 +
              mouseOffsetX;

            p.ellipse(
              x,
              y + Math.sin(time * 0.045 + index) * 3 + mouseOffsetY,
              width * 0.52,
              bandHeight
            );
          }
        });
      };

      const drawHallParticles = (time) => {
        const awakening = getAwakening();

        p.noStroke();

        hallParticles.forEach((particle) => {
          particle.y -=
            0.000045 *
            particle.drift *
            (1 + getCameraPull());

          particle.x +=
            Math.sin(time * 0.08 + particle.phase) * 0.000018;

          if (particle.y < 0.06) {
            Object.assign(
              particle,
              makeHallParticle(),
              { y: 0.96 }
            );
          }

          const px =
            particle.x * width +
            (mouse.x - width * 0.5) * 0.006 * particle.z;

          const py =
            particle.y * height +
            (mouse.y - height * 0.5) * 0.003 * particle.z;

          const size =
            particle.size *
            p.lerp(0.45, 1.18, particle.z);

          const alpha = Math.min(
            12,
            p.lerp(1.5, 7, particle.z) *
              (
                0.38 +
                awakening * 0.82 +
                Math.sin(time * 0.7 + particle.phase) * 0.08
              )
          );

          p.fill(229, 211, 166, alpha);
          p.circle(px, py, size);
        });
      };

      p.setup = () => {
        const canvas = p.createCanvas(1, 1);

        canvas.parent(hostRef.current);
        canvas.elt.setAttribute('aria-hidden', 'true');

        p.frameRate(24);
        p.textFont('Georgia');

        resetScene();

        const handleMouseMove = (event) => {
          mouse.targetX = event.clientX;
          mouse.targetY = event.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove, {
          passive: true,
        });

        removeMouseMove = () => {
          window.removeEventListener('mousemove', handleMouseMove);
        };
      };

      p.draw = () => {
        const time = p.millis() * 0.001;

        updateMouse();

        drawGradient();
        drawVolumetricLight(time);
        drawDistantArchive(time);
        drawPillars();
        drawHall();

        GATES.forEach((gate, index) => {
          drawGate(gate, index, time);
        });

        drawPortalParticles(time);
        drawFog(time);
        drawHallParticles(time);
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

  return (
    <div
      ref={hostRef}
      className={styles.templeBackground}
      style={{
        '--archive-awakening': ritualIntensity,
      }}
    />
  );
}