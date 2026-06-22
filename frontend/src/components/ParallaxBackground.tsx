import { useEffect, useRef } from "react";

export default function ParallaxBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const points = Array.from({ length: 66 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random() * 0.8 + 0.2,
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
    }));

    let frame = 0;
    let raf = 0;
    const resize = () => {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
    };

    const draw = () => {
      frame += 0.006;
      context.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      for (const point of points) {
        point.x = (point.x + point.vx + 1) % 1;
        point.y = (point.y + point.vy + 1) % 1;
        const px = point.x * width + Math.sin(frame + point.z * 4) * 28 * point.z;
        const py = point.y * height + Math.cos(frame + point.z * 3) * 20 * point.z;
        const radius = 1.4 + point.z * 2.6;
        context.beginPath();
        context.arc(px, py, radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(45, 212, 191, ${0.18 + point.z * 0.32})`;
        context.fill();
      }

      for (let i = 0; i < points.length; i += 1) {
        for (let j = i + 1; j < points.length; j += 1) {
          const a = points[i];
          const b = points[j];
          const ax = a.x * width;
          const ay = a.y * height;
          const bx = b.x * width;
          const by = b.y * height;
          const distance = Math.hypot(ax - bx, ay - by);
          if (distance < 150 * devicePixelRatio) {
            context.beginPath();
            context.moveTo(ax, ay);
            context.lineTo(bx, by);
            context.strokeStyle = `rgba(96, 165, 250, ${0.12 * (1 - distance / (150 * devicePixelRatio))})`;
            context.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_15%_20%,rgba(45,212,191,0.16),transparent_26%),radial-gradient(circle_at_84%_8%,rgba(125,211,252,0.12),transparent_24%),linear-gradient(135deg,#020617_0%,#0b1120_54%,#111827_100%)]" />
    </>
  );
}
