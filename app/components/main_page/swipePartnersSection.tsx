'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplayay from 'embla-carousel-autoplay';
import Image from 'next/image';
import "./embla.css";

export default function PartnerSection() {
  const autoplay = useMemo(() => 
    Autoplayay({ delay: 3000, stopOnInteraction: false }), 
    []
  );

  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      containScroll: 'trimSnaps',
      dragFree: true,
      inViewThreshold: 1,
    },
    [autoplay]
  );
  
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const totalSlides = 9;
  
  useEffect(() => {
    if (emblaApi && imagesLoaded === totalSlides) {
      emblaApi.reInit();
    }
  }, [emblaApi, imagesLoaded]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.5 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    isInView ? autoplay.play() : autoplay.stop();
    return () => autoplay.stop();
  }, [emblaApi, autoplay, isInView]);
  
  // Новый интерфейс для частиц с базовым размером и масштабом
  const [particles, setParticles] = useState<Array<{
    x: number, 
    y: number, 
    baseSize: number, 
    scale: number, 
    color: string
  }>>([]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newParticles = Array(3).fill(0).map(() => ({
      x: x + (Math.random() * 60 - 30),
      y: y + (Math.random() * 60 - 100),
      baseSize: Math.random() * 8 + 5,
      scale: 1, // Начальный масштаб
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
          scale: p.scale * 0.95 // Уменьшаем масштаб вместо размера
        })).filter(p => p.scale > 0.1) // Фильтруем по масштабу
      );
    }, 50);
    
    return () => clearInterval(timer);
  }, [particles]);

  return (
    <section 
      className="embla section__responsive-padding text-center relative overflow-hidden" 
      ref={sectionRef} 
      style={{ background: '#f9f9f9' }}
      onMouseMove={handleMouseMove}
    >
      {/* Частицы с transform translate3d */}
      {particles.map((p, i) => (
        <div 
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${p.baseSize}px`,
            height: `${p.baseSize}px`,
            background: p.color,
            zIndex: 1,
            // Комбинируем позиционирование и масштабирование
            transform: `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${p.scale})`,
            willChange: 'transform', // Оптимизация для браузера
          }}
        />
      ))}

      <h2 className="h2__section-title_responsive-font z-2">НАШИ ПАРТНЕРЫ</h2>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container flex">
          {imageSources.map((src, index) => (
            <div 
              key={index}
              className="embla__slide"
            >
              <div className="w-full bg-gray-200 relative rounded-xl overflow-hidden embla-height">
                <Image
                  src={src}
                  alt={`Slide ${index + 1}`}
                  fill
                  quality={100}
                  sizes="100vw"
                  className="object-cover select-none outline-none touch-none"
                  onLoad={() => setImagesLoaded((v) => v + 1)}
                  loading="lazy"	
                />
                <h1 className="z-2 absolute text-white text-4xl">{index + 1}</h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const imageSources = [
  "https://papik.pro/grafic/uploads/posts/2023-04/thumbs/1681607014_papik-pro-p-logotip-nvidia-vektor-12.jpg",
  "https://img.tehnomaks.ru/img/prod/full/1552289243_10.png",
  "/mizurina-zakat.jpg",
  "/laptop.webp",
  "/mizurina-zakat.jpg",
  "/laptop.webp",
  "/laptop.webp",
  "/mizurina-zakat.jpg",
  "/laptop.webp",
];