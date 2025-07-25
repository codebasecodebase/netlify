// components/carousel/EmblaCarousel.tsx
'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import "./embla.css";

interface EmblaCarouselProps {
  slides: string[];
}

export default function EmblaCarousel({ slides }: EmblaCarouselProps) {
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
  const totalSlides = slides.length;

  useEffect(() => {
    if (emblaApi && imagesLoaded === totalSlides) {
      emblaApi.reInit();
    }
  }, [emblaApi, imagesLoaded, totalSlides]);

  return (
    <div className="embla__viewport" ref={emblaRef}>
      <div className="embla__container flex">
        {slides.map((src, index) => (
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}