'use client';
import React, { useState, useEffect, useCallback } from 'react';

// Кастомный хук для эффекта печатной машинки
const useTypewriter = (texts: string[], speed: number = 100, pause: number = 2000) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !reverse) {
      setReverse(true);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex(prev => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex(prev => prev + (reverse ? -1 : 1));
    }, reverse ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, texts, speed]);

  useEffect(() => {
    setCurrentText(texts[index].substring(0, subIndex));
  }, [subIndex, index, texts]);

  return currentText;
};

// Компонент с использованием кастомного хука
const AdvancedTypewriter: React.FC = () => {
  const texts = [
    "Отложенная доставка по предварительной записи",
    "Работаем с объемной доставкой",
    "Доставка по всей Республике Беларусь курьерскими службами",
    "Самовывоз со склада",
    "Отложенная доставка по предварительной записи"
  ];
  
  const displayText = useTypewriter(texts, 150, 1000);

  return (
    <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg text-center">
      <p className="text-xl">
        {displayText}
        <span className="animate-pulse duration-3000"> :</span>
      </p>
    </div>
  );
};

export default AdvancedTypewriter;