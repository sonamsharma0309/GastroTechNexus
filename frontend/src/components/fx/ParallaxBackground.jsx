import React, { useEffect, useRef } from "react";

export default function ParallaxBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 14;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div ref={ref} className="absolute inset-0 transition-transform duration-200">
        <div className="absolute inset-0 grid-fade" />
        <div
          className="absolute -left-24 top-10 h-72 w-72 rounded-full blur-3xl opacity-30"
          style={{ background: "rgba(160,90,255,.55)" }}
        />
        <div
          className="absolute -right-28 top-28 h-80 w-80 rounded-full blur-3xl opacity-25"
          style={{ background: "rgba(0,190,255,.55)" }}
        />
        <div
          className="absolute left-1/2 top-[70%] h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-3xl opacity-20"
          style={{ background: "rgba(0,255,170,.45)" }}
        />
      </div>
    </div>
  );
}
