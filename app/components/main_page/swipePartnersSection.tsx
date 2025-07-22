'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import "./embla.css";

export default function PartnerSection() {
  const autoplay = useMemo(() => 
    Autoplay({ delay: 3000, stopOnInteraction: false }), 
    []
  );

  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const totalSlides = 9;

  // Оптимизированные настройки карусели
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

  // Оптимизация: избегаем синхронного реинита
  useEffect(() => {
    if (!emblaApi || imagesLoaded !== totalSlides) return;
    
    const timer = setTimeout(() => {
      emblaApi.reInit();
    }, 0);
    
    return () => clearTimeout(timer);
  }, [emblaApi, imagesLoaded]);

  // Intersection Observer
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

  // Управление автоплеем
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
      style={{ background: '#f9f9f9' }}
    >
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
                  className="object-cover select-none touch-none"
                  onLoadingComplete={() => setImagesLoaded(v => v + 1)}
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