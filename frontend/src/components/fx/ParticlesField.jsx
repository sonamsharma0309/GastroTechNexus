import React, { useEffect, useMemo, useRef } from "react";

export default function ParticlesField({ count = 26 }) {
  const ref = useRef(null);

  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: 6 + Math.random() * 10,
      o: 0.10 + Math.random() * 0.22,
      d: 10 + Math.random() * 18,
    }));
  }, [count]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--mx", `${mx}%`);
      el.style.setProperty("--my", `${my}%`);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(900px 450px at var(--mx,50%) var(--my,50%), rgba(255,110,210,.12), transparent 55%)",
        }}
      />
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full blur-[1px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.s}px`,
            height: `${p.s}px`,
            opacity: p.o,
            background:
              "linear-gradient(120deg, rgba(160,90,255,1), rgba(0,190,255,1), rgba(0,255,170,1))",
            animation: `floaty ${p.d}s ease-in-out infinite`,
          }}
        />
      ))}

      <style>{`
        @keyframes floaty {
          0%,100% { transform: translate3d(0,0,0) }
          50% { transform: translate3d(18px,-22px,0) }
        }
      `}</style>
    </div>
  );
}
