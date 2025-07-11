'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

// Регистрируем плагин ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const OptimizedAnimatedImageContactFormBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Анимация входа (справа налево)
    gsap.fromTo(containerRef.current,
      { x: 300, opacity: 0 }, // Начальное состояние (за пределами экрана справа)
      {
        x: 0,                 // Конечное положение
        opacity: 1,           // Полная видимость
        duration: 1.5,        // Продолжительность
        ease: "power3.out",   // Сглаживание
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",   // Старт анимации при достижении 90% элемента
          end: "bottom 60%",  // Конец области срабатывания
          toggleActions: "play none none reverse", // Только play при входе
          //once: true          // Однократное выполнение
        }
      }
    );

    // Плавающая анимация
    const floatAnimation = gsap.to(containerRef.current, {
      y: -40,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      force3D: true
    });

    // Управление плавающей анимацией через ScrollTrigger
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 90%",
      end: "bottom 10%",
      onEnter: () => floatAnimation.play(),
      onLeave: () => floatAnimation.pause(),
      onEnterBack: () => floatAnimation.play(),
      onLeaveBack: () => floatAnimation.pause()
    });

    return () => {
      floatAnimation.kill();
      ScrollTrigger.getAll().forEach(instance => instance.kill());
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{ 
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        opacity: 0 // Начальная прозрачность для анимации появления
      }}
    >
      <Image
        src="/Typing-rafiki.svg"
        alt="Floating animation"
        width={400}
        height={400}
        priority
        quality={100}
        sizes="100vw"
      />
    </div>
  );
};

export default OptimizedAnimatedImageContactFormBackground;