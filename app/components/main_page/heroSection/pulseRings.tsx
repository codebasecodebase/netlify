'use client';

import { useRef, useEffect } from 'react';

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

      <style jsx>{`
        .pulse-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
        
        .pulse-container.paused .ring {
          animation-play-state: paused !important;
        }
        
        .ring {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border: 1.5px solid #00ff64;
          border-radius: 50%;
          animation: pulseAnimation 2.5s infinite;
          z-index: -1;
          will-change: transform, opacity;
          backface-visibility: hidden;
          transform: translateZ(0);
          pointer-events: none;
        }
        
        .ring1 {
          --scale-end: 1.3;
        }
        
        .ring2 {
          --scale-end: 1.5;
        }
        
        .ring3 {
          --scale-end: 1.7;
        }
        
        @keyframes pulseAnimation {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 0;
            transform: scale(var(--scale-end, 1.3));
          }
        }
      `}</style>
    </div>
  );
}