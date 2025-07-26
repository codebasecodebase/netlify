'use client';
import React, { useState, useEffect } from 'react';

export default function ParticlesEffect({ isActive }: { isActive: boolean }) {
  const [particles, setParticles] = useState<Array<{
    x: number, 
    y: number, 
    baseSize: number, 
    scale: number, 
    color: string
  }>>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) return; // Не обрабатываем события если не активны
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newParticles = Array(3).fill(0).map(() => ({
      x: x + (Math.random() * 60 - 30),
      y: y + (Math.random() * 60 - 30),
      baseSize: Math.random() * 8 + 5,
      scale: 1,
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
          scale: p.scale * 0.95
        })).filter(p => p.scale > 0.1)
      );
    }, 50);
    
    return () => clearInterval(timer);
  }, [particles]);

  return (
    <div 
      onMouseMove={handleMouseMove} 
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1 }}
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
            willChange: 'transform'
          }}
        />
      ))}
    </div>
  );
}