'use client';
import React, { useEffect, useState, useRef } from 'react';
import ParticlesEffect from './partnerSection/ParticlesEffect';
import PartnersSlider from './partnerSection/PartnersSlider';

// Конфигурация эффекта частиц
const PARTICLE_SETTINGS = {
  SPEED: 0.4,          // Скорость движения вверх (px/frame)
  SCALE_DECAY: 0.985,   // Коэффициент уменьшения размера за кадр
  REMOVE_THRESHOLD: 0.15, // Минимальный размер перед удалением
  FADE_DURATION: 700,   // Длительность исчезновения (ms)
  COUNT: 3,             // Количество создаваемых частиц за событие
  MAX_PARTICLES: 15     // Максимальное количество частиц
};

type Particle = {
  x: number;
  y: number;
  baseSize: number;
  scale: number;
  color: string;
};

export default function PartnerSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  // Отслеживаем видимость секции
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (!entry.isIntersecting) {
          // Очищаем частицы при скрытии секции
          setParticles([]);
        }
      },
      { threshold: 0.5 }
    );
    
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Обработчик движения мыши
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isInView || !sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Создаем новые частицы
    const newParticles = Array(PARTICLE_SETTINGS.COUNT).fill(0).map(() => ({
      x: x + (Math.random() * 60 - 30),
      y: y + (Math.random() * 60 - 30),
      baseSize: Math.random() * 8 + 5,
      scale: 1,
      color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, 0.7)`
    }));
    
    setParticles(prev => [
      ...newParticles, 
      ...prev.slice(0, PARTICLE_SETTINGS.MAX_PARTICLES - PARTICLE_SETTINGS.COUNT)
    ]);
  };

  // Анимация частиц
  useEffect(() => {
    if (!isInView || particles.length === 0) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }
    
    const animate = () => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            y: p.y - PARTICLE_SETTINGS.SPEED,
            scale: p.scale * PARTICLE_SETTINGS.SCALE_DECAY
          }))
          .filter(p => p.scale > PARTICLE_SETTINGS.REMOVE_THRESHOLD)
      );
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Запускаем анимацию только если она еще не активна
    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [particles, isInView]);

  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="embla text-center relative overflow-hidden section__responsive-padding" 
      style={{ 
        background: '#f9f9f9',
      }}
    >
      <ParticlesEffect 
        particles={particles} 
        fadeDuration={PARTICLE_SETTINGS.FADE_DURATION} 
      />
      
      <h2 className="h2__section-title_responsive-font z-2 relative">НАШИ ПАРТНЕРЫ</h2>
      
      <PartnersSlider />
    </section>
  );
}