import { useEffect, useRef } from "react";
import v38Backdrop from "@/assets/v38-cosmic-reference.jpg";

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

export function CosmicEnvironment() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
      root.style.setProperty("--cosmic-x-far", `${nx * 5}px`);
      root.style.setProperty("--cosmic-y-far", `${ny * 4}px`);
      root.style.setProperty("--cosmic-x-mid", `${nx * 9}px`);
      root.style.setProperty("--cosmic-y-mid", `${ny * 6}px`);
      root.style.setProperty("--cosmic-scroll", `${Math.min(scrollY * 0.012, 14)}px`);
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

      const count = Math.min(5600, Math.max(2400, Math.round((width * height) / 235)));
      stars = Array.from({ length: count }, (_, i) => ({
        x: random(i + 11) * width,
        y: random(i + 419) * height,
        size: 0.2 + Math.pow(random(i + 877), 4.4) * 2.35,
        depth: 0.05 + random(i + 1219) * 0.82,
        phase: random(i + 1801) * TAU,
        tone: random(i + 2311),
      }));

      meteors = Array.from({ length: 7 }, (_, i) => {
        const angle = (132 + random(i + 3000) * 12) * (Math.PI / 180);
        return {
          startX: width * (0.70 + random(i + 3100) * 0.34),
          startY: -height * 0.06 + random(i + 3200) * height * 0.44,
          dirX: Math.cos(angle),
          dirY: Math.sin(angle),
          length: 95 + random(i + 3300) * 135,
          pathLength: Math.hypot(width, height) * 1.16,
          speed: 0.000022 + random(i + 3400) * 0.000018,
          delay: random(i + 3500) * 29000,
          brightness: 0.32 + random(i + 3600) * 0.38,
          width: 0.48 + random(i + 3700) * 0.7,
        };
      });
    }

    function drawStars(time: number) {
      for (const star of stars) {
        const scrollShift = reduced ? 0 : scrollY * star.depth * 0.12;
        const y = ((star.y - (scrollShift % height)) % height + height) % height;
        const dx = star.x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.hypot(dx, dy);
        const influence = !coarse && !reduced && distance < 150
          ? Math.pow(1 - distance / 150, 2) * 30 * star.depth
          : 0;
        const x = star.x + (distance > 0 ? (dx / distance) * influence : 0);
        const displacedY = y + (distance > 0 ? (dy / distance) * influence : 0);
        const twinkle = reduced ? 1 : 0.80 + Math.sin(time * 0.0008 + star.phase) * 0.20;
        const alpha = Math.min(1, (0.30 + star.depth * 0.70) * twinkle);
        ctx.fillStyle = star.tone > 0.84
          ? `rgba(133,215,255,${alpha})`
          : star.tone > 0.62
            ? `rgba(220,241,255,${alpha})`
            : `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(x, displacedY, star.size, 0, TAU);
        ctx.fill();
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
      gradient.addColorStop(0.76, `rgba(66,176,255,${0.10 * meteor.brightness})`);
      gradient.addColorStop(1, `rgba(238,251,255,${0.58 * meteor.brightness})`);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = meteor.width;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(headX, headY);
      ctx.stroke();
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
      root.style.setProperty("--cosmic-scroll", `${Math.min(scrollY * 0.012, 14)}px`);
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
    <div className="cosmic-environment v38-cosmic-environment" aria-hidden="true">
      <img className="v38-cosmic-reference" src={v38Backdrop} alt="" />
      <div className="v38-reference-cleanup" />
      <canvas ref={canvasRef} className="cosmic-star-canvas v38-star-canvas" />
      <div className="cosmic-vignette v38-cosmic-vignette" />
    </div>
  );
}
