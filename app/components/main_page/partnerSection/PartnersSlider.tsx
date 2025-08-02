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
  
  // Настройка автовоспроизведения
   const autoplay = useMemo(() => 
    Autoplay({ delay: 3000, stopOnInteraction: false }), 
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', dragFree: true },
    [autoplay]
  );
  
  // Восстановление автовоспроизведения после взаимодействия
  useEffect(() => {
    if (!emblaApi) return;

    const restartAutoplay = () => {
      if (autoplayRef.current && !autoplayRef.current.isPlaying()) {
        autoplayRef.current.play();
      }
    };

    emblaApi.on('pointerUp', restartAutoplay);
    
    return () => {
      emblaApi.off('pointerUp', restartAutoplay);
    };
  }, [emblaApi]);

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
                className="object-cover select-none"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}