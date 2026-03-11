import { useEffect, useRef, useState } from 'react';

export default function BackgroundBrand() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [opacity, setOpacity] = useState(0.06);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    if (typeof window === "undefined") return;
    if (typeof window.IntersectionObserver === "undefined") {
      setOpacity(0.06);
      return;
    }

    try {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const ratio = entry.intersectionRatio;
          const next = 0.015 + ratio * 0.09;
          setOpacity(Number(next.toFixed(3)));
        },
        {
          threshold: [0, 0.08, 0.2, 0.35, 0.5, 0.75, 1],
        },
      );

      observer.observe(target);
      return () => observer.disconnect();
    } catch {
      setOpacity(0.06);
      return;
    }
  }, []);

  return (
    <div
      className="pointer-events-none relative z-0 mt-8 h-[clamp(9rem,18vw,16rem)] w-full overflow-hidden select-none"
      ref={ref}
    >
      <p
        style={{ opacity }}
        className="whitespace-nowrap text-center text-[clamp(6rem,16vw,18rem)] font-extrabold leading-none tracking-[-0.04em] text-[var(--landing-text)] transition-opacity duration-500 translate-y-[16%]"
      >
        ChatLo.io
      </p>
    </div>
  );
}
