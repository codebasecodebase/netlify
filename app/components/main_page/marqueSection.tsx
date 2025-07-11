'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../../variables.scss';

type MarqueeSectionProps = {
  speed?: number;
};

export default function MarqueeSection({ speed = 35 }: MarqueeSectionProps) {
  const marqueeText = "Принимаем оплату: Visa, MasterCard, наличные платежи. Остались вопросы ? +375(44)703-97-07. Время работы с 9.00-17.00 Пн-Пт.";
  const sectionRef = useRef<HTMLElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    
    // Создаем анимацию
    animationRef.current = gsap.to(wrapperRef.current, {
      xPercent: -100,
      duration: speed,
      ease: 'none',
      repeat: -1,
      paused: true, // Начинаем с паузой
      force3D: true
    });

    // Создаем Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animationRef.current?.play();
        } else {
          animationRef.current?.pause();
        }
      });
    }, {
      threshold: 0.1, // Срабатывает при 10% видимости
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Очистка
    return () => {
      observer.disconnect();
      animationRef.current?.kill();
    };
  }, [speed]);

  return (
    <section 
      ref={sectionRef}
      className="bg-black overflow-hidden text-white h-[100px] flex items-center relative"
    >
      <div 
        ref={wrapperRef}
        className="whitespace-nowrap text-[22px] relative z-10"
        style={{
          display: 'inline-block',
          paddingLeft: '100%',
          willChange: 'transform'
        }}
      >
        {marqueeText}
      </div>
    </section>
  );
}