// ParticlesEffect.tsx
'use client';
import React from 'react';

type ParticlesEffectProps = {
  particles: Array<{
    x: number;
    y: number;
    baseSize: number;
    scale: number;
    color: string;
  }>;
  fadeDuration?: number;
};

export default function ParticlesEffect({ 
  particles,
  fadeDuration = 700 
}: ParticlesEffectProps) {
  return (
    <div 
      className="absolute inset-0 w-full h-full"
      style={{ 
        zIndex: 1,
        pointerEvents: 'none'
      }}
    >
      {particles.map((p, i) => (
        <div 
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${p.baseSize}px`,
            height: `${p.baseSize}px`,
            background: p.color,
            transform: `translate3d(${p.x}px, ${p.y}px, 0) scale(${p.scale})`,
            willChange: 'transform',
            opacity: p.scale * 0.8,
            transition: `opacity ${fadeDuration}ms ease-out`
          }}
        />
      ))}
    </div>
  );
}