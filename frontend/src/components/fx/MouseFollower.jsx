import React, { useEffect, useRef } from "react";

export default function MouseFollower() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const move = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      el.style.transform = `translate(${x - 140}px, ${y - 140}px)`;
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-[2] h-[280px] w-[280px] rounded-full opacity-70 blur-2xl"
      style={{
        background:
          "radial-gradient(circle at 30% 30%, rgba(160,90,255,.35), transparent 60%), radial-gradient(circle at 70% 60%, rgba(0,190,255,.28), transparent 55%), radial-gradient(circle at 50% 80%, rgba(0,255,170,.16), transparent 60%)",
      }}
    />
  );
}
