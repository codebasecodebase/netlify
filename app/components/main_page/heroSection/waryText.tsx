'use client';
import React, { useEffect, useRef, useState } from "react";

import './style_waryText.scss'


export default function WavyText({ text }: { text: string; delay?: number }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 } // Срабатывает при 10% видимости
        );

        const currentContainer = containerRef.current;
        if (currentContainer) {
            observer.observe(currentContainer);
        }

        return () => {
            if (currentContainer) {
                observer.unobserve(currentContainer);
            }
        };
    }, []);

    return (
        <div 
            ref={containerRef}
            className="wavy-text-container" 
            style={{ display: 'inline-block' }}
        >
            {text.split('').map((char, index) => (
                <span
                    key={index}
                    className={`char ${isVisible ? 'animate' : ''}`}
                    style={{
                        display: 'inline-block',
                        whiteSpace: 'pre',
                        animationDelay: `${index * 0.05}s`,
                        transformOrigin: 'bottom center',
                        willChange: 'transform'
                    }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </div>
    );
}