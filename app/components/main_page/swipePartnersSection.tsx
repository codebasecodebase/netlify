'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react'
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
  const sectionRef = useRef(null)
  const [isInView, setIsInView] = useState(false)

  // 2. Правильные настройки карусели
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      containScroll: 'trimSnaps',
      dragFree: true,
      inViewThreshold: 1, // Enables momentum-based scrolling
    },
    [autoplay]
  )
  // SSR: отслеживаем загрузку всех изображений
  const [imagesLoaded, setImagesLoaded] = useState(0)
  const totalSlides = 9
  useEffect(() => {
    if (emblaApi && imagesLoaded === totalSlides) {
      emblaApi.reInit()
    }
  }, [emblaApi, imagesLoaded])

  // Intersection Observer logic
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.5 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    if (isInView) {
      autoplay.play()
    } else {
      autoplay.stop()
    }
    return () => autoplay.stop()
  }, [emblaApi, autoplay, isInView])
  
  // Состояние для частиц
  const [particles, setParticles] = useState<Array<{x: number, y: number, size: number, color: string}>>([]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Увеличиваем разброс частиц (от 30 до 60 пикселей от центра)
    const newParticles = Array(3).fill(0).map((_, i) => ({
      x: x + (Math.random() * 60 - 30),
      y: y + (Math.random() * 60 - 30),
      size: Math.random() * 8 + 5, // Увеличиваем размер частиц
      color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, 0.7)`
    }));
    
    setParticles(prev => [...newParticles, ...prev.slice(0, 7)]);
  };
  
  // В эффекте анимации уменьшаем скорость исчезновения
  useEffect(() => {
    if (particles.length === 0) return;
    
    const timer = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          y: p.y - 0.3, // Медленнее поднимаются
          size: p.size * 0.95 // Медленнее уменьшаются
        })).filter(p => p.size > 1)
      );
    }, 50);
    
    return () => clearInterval(timer);
  }, [particles]);

  return (
    <section 
      className="embla section__responsive-padding text-center relative overflow-hidden" 
      ref={sectionRef} 
      style={{background:'#f9f9f9'}}
      onMouseMove={handleMouseMove}
    >
      {/* Рендерим частицы */}
      {particles.map((p, i) => (
        <div 
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            zIndex: 1,
            transform: `translate(-50%, -50%)`
          }}
        />
      ))}
      
      <h2 className="h2__section-title_responsive-font">НАШИ ПАРТНЕРЫ</h2>
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
                  //priority={index === 0}
                  quality={100}
                  sizes="100vw"
                  className="object-cover select-none outline-none touch-none"
                  onLoad={() => setImagesLoaded((v) => v + 1)}
                  loading="lazy"	
                />
                <h1  className="z-2 absolute text-white text-4xl">{index + 1}</h1>
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