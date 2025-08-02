'use client';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay, { AutoplayType } from 'embla-carousel-autoplay';
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
  const autoplayRef = useRef<AutoplayType | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // 1. Настройка Autoplay с возможностью ручного управления
  const autoplay = useMemo(() => 
    Autoplay({ delay: 3000, stopOnInteraction: false }), 
    []
  );

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
  const totalSlides = imageSources.length;
  
  // 2. Восстановление воспроизведения после взаимодействия
  useEffect(() => {
    if (!emblaApi) return;

    const restartAutoplay = () => {
      if (autoplayRef.current && !autoplayRef.current.isPlaying()) {
        autoplayRef.current.play();
        setIsPlaying(true);
      }
    };

    // Перезапуск автовоспроизведения после окончания взаимодействия
    emblaApi.on('pointerUp', restartAutoplay);
    emblaApi.on('select', restartAutoplay);
    
    return () => {
      emblaApi.off('pointerUp', restartAutoplay);
      emblaApi.off('select', restartAutoplay);
    };
  }, [emblaApi]);

  // 3. Реинициализация после загрузки изображений
  useEffect(() => {
    if (emblaApi && imagesLoaded === totalSlides) {
      emblaApi.reInit();
      if (autoplayRef.current && isPlaying) {
        autoplayRef.current.play();
      }
    }
  }, [emblaApi, imagesLoaded, totalSlides, isPlaying]);

  // 4. Управление воспроизведением при видимости
  useEffect(() => {
    if (!emblaApi || !autoplayRef.current) return;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isPlaying) {
        autoplayRef.current?.play();
      } else {
        autoplayRef.current?.stop();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [emblaApi, isPlaying]);

  return (
    <div className="embla__viewport" ref={emblaRef}>
      <div className="embla__container flex">
        {imageSources.map((src, index) => (
          <div key={index} className="embla__slide">
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
      
      {/* 5. Кнопки управления для тестирования */}
      <div className="absolute bottom-4 right-4 z-10 flex space-x-2">
        <button 
          onClick={() => {
            autoplayRef.current?.play();
            setIsPlaying(true);
          }}
          className="bg-white p-2 rounded"
        >
          ▶️
        </button>
        <button 
          onClick={() => {
            autoplayRef.current?.stop();
            setIsPlaying(false);
          }}
          className="bg-white p-2 rounded"
        >
          ⏹️
        </button>
      </div>
    </div>
  );
}