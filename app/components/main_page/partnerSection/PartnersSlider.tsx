'use client';
import React, { useEffect, useMemo, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import "./embla.css";

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

export default function PartnersSlider() {
  const autoplayRef = useRef<any>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(true);
  
  // Настройка автовоспроизведения
  const autoplay = useMemo(() => 
    Autoplay({ delay: 3000, stopOnInteraction: false }), 
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', dragFree: true },
    [autoplay]
  );
  
  // Получение экземпляра autoplay и настройка Intersection Observer
  useEffect(() => {
    if (!emblaApi) return;

    // Получаем экземпляр autoplay
    const autoplayInstance = emblaApi.plugins()?.autoplay;
    if (autoplayInstance) {
      autoplayRef.current = autoplayInstance;
    }

    // Настройка Intersection Observer
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
      
      if (entry.isIntersecting) {
        // Возобновляем автовоспроизведение при появлении в поле зрения
        if (autoplayRef.current && !autoplayRef.current.isPlaying()) {
          autoplayRef.current.play();
        }
      } else {
        // Приостанавливаем автовоспроизведение при выходе из поля зрения
        if (autoplayRef.current && autoplayRef.current.isPlaying()) {
          autoplayRef.current.stop();
        }
      }
    }, {
      threshold: 0.1 // Срабатывает при 10% видимости
    });

    if (sliderContainerRef.current) {
      observer.observe(sliderContainerRef.current);
    }

    // Восстановление автовоспроизведения после взаимодействия
    const restartAutoplay = () => {
      if (autoplayRef.current && !autoplayRef.current.isPlaying() && isVisibleRef.current) {
        autoplayRef.current.play();
      }
    };

    emblaApi.on('pointerUp', restartAutoplay);
    
    return () => {
      observer.disconnect();
      emblaApi.off('pointerUp', restartAutoplay);
    };
  }, [emblaApi]);

  return (
    <div ref={sliderContainerRef}>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container flex">
          {imageSources.map((src, index) => (
            <div key={index} className="embla__slide">
              <div className="w-full bg-gray-200 relative rounded-xl overflow-hidden embla-height cursor-grab">
                <Image
                  src={src}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover select-none"
                  loading="lazy"
                  sizes="100vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}