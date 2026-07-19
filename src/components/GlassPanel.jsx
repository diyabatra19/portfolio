import { forwardRef, useRef } from 'react';

export const GlassPanel = forwardRef(function GlassPanel({
  as: Component = 'div',
  className = '',
  children,
  interactive = true,
  ...props
}, forwardedRef) {
  const ref = useRef(null);

  const setRef = (node) => {
    ref.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  const handlePointerMove = (event) => {
    if (!interactive || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const tiltX = (y - 50) * -0.04;
    const tiltY = (x - 50) * 0.05;
    element.style.setProperty('--glass-x', `${x}%`);
    element.style.setProperty('--glass-y', `${y}%`);
    element.style.setProperty('--tilt-x', `${tiltX}deg`);
    element.style.setProperty('--tilt-y', `${tiltY}deg`);
  };

  const reset = () => {
    const element = ref.current;
    if (!element) return;
    element.style.setProperty('--glass-x', '50%');
    element.style.setProperty('--glass-y', '0%');
    element.style.setProperty('--tilt-x', '0deg');
    element.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <Component
      ref={setRef}
      className={`glass-panel ${interactive ? 'glass-panel--interactive' : ''} ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onBlur={reset}
      {...props}
    >
      {children}
    </Component>
  );
});
