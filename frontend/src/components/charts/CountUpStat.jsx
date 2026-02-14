import React, { useEffect, useState } from "react";

export default function CountUpStat({ value = 0, duration = 650 }) {
  const [v, setV] = useState(0);

  useEffect(() => {
    let start = 0;
    const steps = Math.max(10, Math.floor(duration / 16));
    const inc = value / steps;

    const t = setInterval(() => {
      start += inc;
      if (start >= value) {
        setV(value);
        clearInterval(t);
      } else setV(Math.floor(start));
    }, 16);

    return () => clearInterval(t);
  }, [value, duration]);

  return <span>{v}</span>;
}
