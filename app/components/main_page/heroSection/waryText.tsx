'use client';
import React, { useEffect, useRef, useState } from "react";
import './style_waryText.scss';

export default function WavyText({ text }: { text: string; delay?: number }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;
        
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Используем requestAnimationFrame для синхронизации с рендер-циклом
                requestAnimationFrame(() => {
                    setIsVisible(entry.isIntersecting);
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -100px 0px" // Оптимизация: срабатывает на 100px раньше
            }
        );

        observer.observe(containerRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div 
            ref={containerRef}
            className="wavy-text-container flex items-center h-[80px]" 
            aria-label={text} // Для доступности
        >
            {text.split('').map((char, index) => {
                // Оптимизация: используем CSS variables вместо inline-стилей
                const style = {
                    '--delay': `${index * 50}ms`,
                } as React.CSSProperties;

                return (
                    <span
                        key={index}
                        className={`char ${isVisible ? 'animate' : ''}`}
                        style={style}
                        aria-hidden="true" // Скрываем от скринридеров
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                );
            })}
        </div>
    );
}