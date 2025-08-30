'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';

const useTypewriter = (
  texts: string[], 
  speed: number = 100, 
  pause: number = 2000,
  isRunning: boolean = true // Новый параметр для контроля анимации
) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    if (!isRunning) return; // Останавливаем анимацию если isRunning = false

    if (subIndex === texts[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), pause);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts, speed, pause, isRunning]);

  useEffect(() => {
    setCurrentText(texts[index].substring(0, subIndex));
  }, [subIndex, index, texts]);

  return currentText;
};

const AdvancedTypewriter: React.FC = () => {
  const texts = [
    "Отложенная доставка по предварительной записи",
    "Работаем с объемной доставкой",
    "Доставка по всей Республике Беларусь курьерскими службами",
    "Самовывоз со склада",
    "Отложенная доставка по предварительной записи"
  ];
  
  const [isRunning, setIsRunning] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  // Настройка Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsRunning(entry.isIntersecting);
      },
      { threshold: 0.1 } // Срабатывает когда видно хотя бы 10% элемента
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const displayText = useTypewriter(texts, 150, 1000, isRunning);

  return (
    <div ref={ref} className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg text-center">
      <p className="text-xl">
        {displayText}
        <span className="animate-pulse"> :</span>
      </p>
    </div>
  );
};

export default AdvancedTypewriter;