import { useEffect, useRef, useState } from 'react';

const shouldSkipAnimation = () =>
  document.documentElement.classList.contains('reduce-motion') ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  !('IntersectionObserver' in window);

function AnimatedNumber({ value, label }) {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState(() =>
    shouldSkipAnimation() ? value : 0,
  );
  const startedRef = useRef(false);

  useEffect(() => {
    if (shouldSkipAnimation()) {
      startedRef.current = true;
      return undefined;
    }

    const element = ref.current;
    if (!element) return undefined;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        observer.disconnect();
        const startedAt = window.performance.now();
        const duration = 900;

        const tick = (time) => {
          const progress = Math.min((time - startedAt) / duration, 1);
          const eased = 1 - (1 - progress) ** 3;
          setDisplayValue(Math.round(value * eased));
          if (progress < 1) frame = window.requestAnimationFrame(tick);
        };

        frame = window.requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <div className="stat-item" ref={ref} aria-label={`${value} ${label}`}>
      <strong aria-hidden="true">{displayValue}</strong>
      <span aria-hidden="true">{label}</span>
      <span className="sr-only">{value} {label}</span>
    </div>
  );
}

export function AnimatedStats({ stats }) {
  return (
    <section className="project-stats" aria-labelledby="stats-title">
      <div className="section-heading">
        <p>On this page</p>
        <h2 id="stats-title">The work, counted.</h2>
      </div>
      <div className="project-stats__grid">
        {stats.map((stat) => (
          <AnimatedNumber key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </div>
    </section>
  );
}
