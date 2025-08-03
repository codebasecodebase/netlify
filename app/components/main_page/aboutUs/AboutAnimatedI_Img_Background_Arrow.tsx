"use client"

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function AnimatedArrow() {
  const svgRef = useRef(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Анимация для верхней стрелки (влево)
      gsap.to(".arrow-1", {
        x: -1000,
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top center",
          end: "bottom bottom",
          scrub: true,
        }
      });

      // Анимация для средней и нижней стрелок (вправо)
      gsap.to([".arrow-2", ".arrow-3"], {
        x: 1000,
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top center",
          end: "bottom bottom",
          scrub: true,
        }
      });
    }, svgRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      className="absolute left-0 top-0 w-full h-full pointer-events-none select-none max-[1150px]:hidden"
      style={{ zIndex: 0, transform: 'translateZ(0)' }}
      viewBox="0 0 1550 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L8,3 Z" fill="#7300FF" />
        </marker>
      </defs>
      <style>{`
        .arrow {
          opacity: 0.3;
          transform: translateZ(0);
          marker-end: url(#arrowhead);
        }
        .arrow-1 { animation: arrowPulse 10s infinite; }
        .arrow-2 { 
          animation: arrowPulse 10s infinite 3.3s; 
        }
        .arrow-3 { 
          animation: arrowPulse 10s infinite 6.6s; 
        }
        @keyframes arrowPulse {
          0%   { opacity: 0.3; }
          10%  { opacity: 0.5; }
          20%  { opacity: 0.5; }
          30%  { opacity: 0.3; }
          100% { opacity: 0.3; }
        }
      `}</style>

      <path
        className="arrow arrow-1"
        d="M0,100 C500,0 400,250 700,100"
        stroke="#08C1FF"
        strokeWidth="3"
        fill="none"
        strokeDasharray="8 8"
      />
      <path
        className="arrow arrow-2"
        d="M1550,120 C1100,300 700,50 500,300"
        stroke="#08C1FF"
        strokeWidth="2.5"
        fill="none"
        strokeDasharray="4 6"
      />
      <path
        className="arrow arrow-3"
        d="M1550,400 C900,200 600,400 100,380"
        stroke="#08C1FF"
        strokeWidth="2"
        fill="none"
        strokeDasharray="6 10"
      />
    </svg>
  );
}