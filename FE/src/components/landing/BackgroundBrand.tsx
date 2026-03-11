import { useEffect, useRef, useState } from 'react';

export default function BackgroundBrand() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [opacity, setOpacity] = useState(0.02);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

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
  }, []);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[-0.22em] z-0 overflow-hidden select-none" ref={ref}>
      <p
        style={{ opacity }}
        className="whitespace-nowrap text-center text-[clamp(5rem,20vw,24rem)] font-extrabold leading-none tracking-[-0.05em] text-[var(--landing-text)] transition-opacity duration-500"
      >
        ChatLo.io
      </p>
    </div>
  );
}
