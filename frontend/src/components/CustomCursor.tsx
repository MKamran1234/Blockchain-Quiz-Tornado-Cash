import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [point, setPoint] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const move = (event: PointerEvent) => setPoint({ x: event.clientX, y: event.clientY });
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-50 hidden h-9 w-9 rounded-full border border-teal-200/40 bg-teal-200/10 blur-[1px] lg:block"
      style={{ transform: `translate(${point.x - 18}px, ${point.y - 18}px)` }}
    />
  );
}
