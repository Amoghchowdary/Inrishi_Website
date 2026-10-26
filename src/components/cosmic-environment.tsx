import { useEffect, useMemo, useRef, type CSSProperties } from "react";

const GALAXY_URL = "https://assets.science.nasa.gov/dynamicimage/assets/science/missions/hubble/galaxies/spiral/STScI-01EVT1G6TZED22XN93TR47XF4C.png?fit=clip&h=960&w=2000";
const BENNU_URL = "https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/09/b/bennu_dec10.png?crop=faces%2Cfocalpoint&fit=crop&h=150&w=150";
const JUPITER_URL = "https://assets.science.nasa.gov/dynamicimage/assets/science/missions/webb/science/2023/10/STScI-01HCX1B69H5ZEF6S18S0F6PM1V.png?fit=clip&h=1615&w=1603";

type Star = { x: number; y: number; size: number; depth: number; phase: number; tone: number };
type Meteor = {
  startX: number;
  startY: number;
  dirX: number;
  dirY: number;
  length: number;
  pathLength: number;
  speed: number;
  delay: number;
  brightness: number;
  width: number;
};

type BeltRock = {
  left: number;
  top: number;
  size: number;
  rotation: number;
  opacity: number;
  blur: number;
};

export function CosmicEnvironment() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const rocks = useMemo<BeltRock[]>(() => {
    const random = (seed: number) => {
      const value = Math.sin(seed * 127.1 + 78.233) * 43758.5453123;
      return value - Math.floor(value);
    };
    return Array.from({ length: 36 }, (_, i) => ({
      left: 2 + (i / 35) * 96,
      top: 42 + (random(i + 700) - 0.5) * 56,
      size: 8 + Math.pow(random(i + 900), 2.4) * 28,
      rotation: -180 + random(i + 1200) * 360,
      opacity: 0.22 + random(i + 1500) * 0.34,
      blur: random(i + 1700) < 0.22 ? 0.45 + random(i + 1900) * 0.7 : 0,
    }));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const maybeContext = canvasElement.getContext("2d");
    if (!maybeContext) return;
    const activeCanvas: HTMLCanvasElement = canvasElement;
    const ctx: CanvasRenderingContext2D = maybeContext;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let width = 0;
    let height = 0;
    let scrollY = window.scrollY;
    let raf = 0;
    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    const TAU = Math.PI * 2;

    const random = (seed: number) => {
      const value = Math.sin(seed * 127.1 + 78.233) * 43758.5453123;
      return value - Math.floor(value);
    };

    function updateParallax(clientX: number, clientY: number) {
      const nx = (clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      const ny = (clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
      root.style.setProperty("--cosmic-x-near", `${nx * 11}px`);
      root.style.setProperty("--cosmic-y-near", `${ny * 8}px`);
      root.style.setProperty("--cosmic-x-mid", `${nx * 7}px`);
      root.style.setProperty("--cosmic-y-mid", `${ny * 5}px`);
      root.style.setProperty("--cosmic-x-far", `${nx * 4}px`);
      root.style.setProperty("--cosmic-y-far", `${ny * 3}px`);
      root.style.setProperty("--cosmic-tilt", `${nx * 0.25}deg`);
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      activeCanvas.width = Math.round(width * ratio);
      activeCanvas.height = Math.round(height * ratio);
      activeCanvas.style.width = `${width}px`;
      activeCanvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.min(5600, Math.max(2200, Math.round((width * height) / 245)));
      stars = Array.from({ length: count }, (_, i) => ({
        x: random(i + 11) * width,
        y: random(i + 419) * height,
        size: 0.18 + Math.pow(random(i + 877), 4.9) * 2.25,
        depth: 0.05 + random(i + 1219) * 0.74,
        phase: random(i + 1801) * TAU,
        tone: random(i + 2311),
      }));

      meteors = Array.from({ length: 6 }, (_, i) => {
        // Move down-left. Tail is always drawn opposite to the velocity vector.
        const angle = (132 + random(i + 3000) * 12) * (Math.PI / 180);
        return {
          startX: width * (0.78 + random(i + 3100) * 0.26),
          startY: -height * 0.06 + random(i + 3200) * height * 0.36,
          dirX: Math.cos(angle),
          dirY: Math.sin(angle),
          length: 90 + random(i + 3300) * 120,
          pathLength: Math.hypot(width, height) * 1.1,
          speed: 0.000024 + random(i + 3400) * 0.000018,
          delay: random(i + 3500) * 26000,
          brightness: 0.24 + random(i + 3600) * 0.26,
          width: 0.42 + random(i + 3700) * 0.55,
        };
      });
    }

    function drawStars(time: number) {
      for (const star of stars) {
        const scrollShift = reduced ? 0 : scrollY * star.depth * 0.14;
        const y = ((star.y - (scrollShift % height)) % height + height) % height;
        const dx = star.x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.hypot(dx, dy);
        const influence = !coarse && !reduced && distance < 130
          ? Math.pow(1 - distance / 130, 2) * 32 * star.depth
          : 0;
        const x = star.x + (distance > 0 ? (dx / distance) * influence : 0);
        const displacedY = y + (distance > 0 ? (dy / distance) * influence : 0);
        const twinkle = reduced ? 1 : 0.82 + Math.sin(time * 0.0007 + star.phase) * 0.18;
        const alpha = Math.min(0.98, (0.23 + star.depth * 0.68) * twinkle);
        ctx.fillStyle = star.tone > 0.84
          ? `rgba(145,221,255,${alpha})`
          : star.tone > 0.62
            ? `rgba(221,240,255,${alpha})`
            : `rgba(255,252,248,${alpha})`;
        ctx.beginPath();
        ctx.arc(x, displacedY, star.size, 0, TAU);
        ctx.fill();

        if (star.size > 1.45) {
          ctx.strokeStyle = star.tone > 0.8
            ? `rgba(159,228,255,${alpha * 0.28})`
            : `rgba(255,255,255,${alpha * 0.22})`;
          ctx.lineWidth = 0.5;
          const glint = star.size * 2.8;
          ctx.beginPath();
          ctx.moveTo(x - glint, displacedY);
          ctx.lineTo(x + glint, displacedY);
          ctx.moveTo(x, displacedY - glint);
          ctx.lineTo(x, displacedY + glint);
          ctx.stroke();
        }
      }
    }

    function drawMeteor(time: number, meteor: Meteor) {
      const progress = ((time + meteor.delay) * meteor.speed) % 1;
      const distance = progress * meteor.pathLength;
      const headX = meteor.startX + meteor.dirX * distance;
      const headY = meteor.startY + meteor.dirY * distance;
      const tailX = headX - meteor.dirX * meteor.length;
      const tailY = headY - meteor.dirY * meteor.length;

      const gradient = ctx.createLinearGradient(tailX, tailY, headX, headY);
      gradient.addColorStop(0, "rgba(255,255,255,0)");
      gradient.addColorStop(0.72, `rgba(139,203,255,${0.02 * meteor.brightness})`);
      gradient.addColorStop(1, `rgba(236,250,255,${0.42 * meteor.brightness})`);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = meteor.width;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(headX, headY);
      ctx.stroke();

      ctx.fillStyle = `rgba(245,253,255,${0.44 * meteor.brightness})`;
      ctx.beginPath();
      ctx.arc(headX, headY, meteor.width * 0.68, 0, TAU);
      ctx.fill();
    }

    function draw(time = 0) {
      ctx.clearRect(0, 0, width, height);
      drawStars(time);
      if (!reduced) {
        for (const meteor of meteors) drawMeteor(time, meteor);
        raf = requestAnimationFrame(draw);
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!reduced && !coarse) updateParallax(event.clientX, event.clientY);
    };
    const onPointerLeave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
      updateParallax(window.innerWidth / 2, window.innerHeight / 2);
    };
    const onScroll = () => {
      scrollY = window.scrollY;
      root.style.setProperty("--cosmic-scroll", `${Math.min(scrollY * 0.012, 12)}px`);
      if (reduced) draw();
    };

    resize();
    updateParallax(window.innerWidth / 2, window.innerHeight / 2);
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="cosmic-environment" aria-hidden="true">
      <div className="real-space-photo-layer">
        <img className="real-galaxy-photo" src={GALAXY_URL} alt="" referrerPolicy="no-referrer" />
        <img className="real-jupiter-photo" src={JUPITER_URL} alt="" referrerPolicy="no-referrer" />
        <div className="real-asteroid-belt">
          {rocks.map((rock, index) => (
            <img
              key={index}
              src={BENNU_URL}
              alt=""
              referrerPolicy="no-referrer"
              className="real-asteroid-rock"
              style={{
                left: `${rock.left}%`,
                top: `${rock.top}%`,
                width: `${rock.size}px`,
                height: `${rock.size}px`,
                opacity: rock.opacity,
                filter: `grayscale(1) brightness(.78) contrast(1.12) blur(${rock.blur}px)`,
                transform: `translate(-50%, -50%) rotate(${rock.rotation}deg)`,
              } as CSSProperties}
            />
          ))}
        </div>
      </div>
      <canvas ref={canvasRef} className="cosmic-star-canvas" />
      <div className="cosmic-vignette" />
    </div>
  );
}
