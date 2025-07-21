'use client';
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplayay from 'embla-carousel-autoplay'
import Image from 'next/image'
import "./embla.css";

export default function PartnerSection() {
  // 1. Используем useMemo для сохранения инстанса автоплея
  const autoplay = useMemo(() => 
    Autoplayay({ delay: 3000, stopOnInteraction: false }), 
    []
  )

  // Intersection Observer ref
  const sectionRef = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)

  // 2. Правильные настройки карусели
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      containScroll: 'trimSnaps',
      dragFree: true,
      inViewThreshold: 1,
    },
    [autoplay]
  )
  
  // Оптимизация: кэширование размеров элемента
  const rectRef = useRef({ left: 0, top: 0, width: 0, height: 0 });
  
  // Обновление размеров при ресайзе
  useEffect(() => {
    const updateRect = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        rectRef.current = {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height
        };
      }
    };
    
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, []);

  // Состояние для частиц
  const [particles, setParticles] = useState<Array<{x: number, y: number, size: number, color: string}>>([]);
  const particlesRef = useRef(particles);
  particlesRef.current = particles;
  
  // Оптимизация: анимация через requestAnimationFrame
  const animationFrameRef = useRef<number | null>(null);
  
  const animateParticles = useCallback(() => {
    setParticles(prev => 
      prev.map(p => ({
        ...p,
        y: p.y - 0.3,
        size: p.size * 0.95
      })).filter(p => p.size > 1)
    );
    
    if (particlesRef.current.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animateParticles);
    }
  }, []);
  
  useEffect(() => {
    if (particles.length > 0 && !animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(animateParticles);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [particles, animateParticles]);

  // Оптимизированный обработчик мыши
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = rectRef.current;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Создаем новые частицы без обновления состояния
    const newParticles = Array(3).fill(0).map(() => ({
      x: x + (Math.random() * 60 - 30),
      y: y + (Math.random() * 60 - 30),
      size: Math.random() * 8 + 5,
      color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, 0.7)`
    }));
    
    // Батчинг обновлений частиц
    setParticles(prev => [...newParticles, ...prev.slice(0, 7)]);
  }, []);
  
  // SSR: отслеживаем загрузку всех изображений
  const imagesLoadedRef = useRef(0);
  const totalSlides = 9;
  
  useEffect(() => {
    if (emblaApi && imagesLoadedRef.current === totalSlides) {
      emblaApi.reInit();
    }
  }, [emblaApi]);

  const handleImageLoad = useCallback(() => {
    imagesLoadedRef.current += 1;
    if (emblaApi && imagesLoadedRef.current === totalSlides) {
      emblaApi.reInit();
    }
  }, [emblaApi]);

  // Intersection Observer оптимизация
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        requestAnimationFrame(() => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.5 }
    );
    
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    
    if (isInView) {
      autoplay.play();
    } else {
      autoplay.stop();
    }
    
    return () => autoplay.stop();
  }, [emblaApi, autoplay, isInView]);

  return (
    <section 
      className="embla section__responsive-padding text-center relative overflow-hidden" 
      ref={sectionRef} 
      style={{background:'#f9f9f9'}}
      onMouseMove={handleMouseMove}
    >
      {/* Оптимизированный рендеринг частиц */}
      {particles.map((p, i) => (
        <div 
          key={`${p.x}-${p.y}-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            zIndex: 1,
            transform: `translate(-50%, -50%)`,
            willChange: 'transform, opacity'
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
                  onLoad={handleImageLoad}
                  loading="lazy"	
                />
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