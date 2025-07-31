'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  const totalSlides = 9;
  
  useEffect(() => {
    if (emblaApi && imagesLoaded === totalSlides) {
      emblaApi.reInit();
    }
  }, [emblaApi, imagesLoaded]);

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
    </div>
  );
}