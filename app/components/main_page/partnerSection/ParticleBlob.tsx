// components/particles/ParticleBlob.tsx
'use client';
import React, { useState, useEffect } from 'react';

export default function ParticleBlob() {
  const [particles, setParticles] = useState<Array<{x: number, y: number, size: number, color: string}>>([]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newParticles = Array(3).fill(0).map((_, i) => ({
      x: x + (Math.random() * 60 - 30),
      y: y + (Math.random() * 60 - 30),
      size: Math.random() * 8 + 5,
      color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, 0.7)`
    }));
    
    setParticles(prev => [...newParticles, ...prev.slice(0, 7)]);
  };
  
  useEffect(() => {
    if (particles.length === 0) return;
    
    const timer = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          y: p.y - 0.3,
          size: p.size * 0.95
        })).filter(p => p.size > 1)
      );
    }, 50);
    
    return () => clearInterval(timer);
  }, [particles]);

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      onMouseMove={handleMouseMove}
    >
      {particles.map((p, i) => (
        <div 
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            transform: `translate(-50%, -50%)`
          }}
        />
      ))}
    </div>
  );
}