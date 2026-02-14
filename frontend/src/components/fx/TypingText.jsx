import React, { useEffect, useState } from "react";

export default function TypingText({ text = "", speed = 22, className = "" }) {
  const [out, setOut] = useState("");

  useEffect(() => {
    let i = 0;
    setOut("");
    const t = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);

  return (
    <span className={className}>
      {out}
      <span className="inline-block w-2 animate-pulse opacity-60">|</span>
    </span>
  );
}
