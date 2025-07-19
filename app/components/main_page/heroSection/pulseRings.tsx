'use client';

import { useRef, useEffect } from 'react';

import './style.scss'

export default function PulseRings() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        container.classList.toggle('paused', !entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="pulse-container">
      <span className="ring ring1"></span>
      <span className="ring ring2"></span>
      <span className="ring ring3"></span>
    </div>
  );
}