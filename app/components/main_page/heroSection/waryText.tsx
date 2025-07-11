'use client';
import React, { useEffect, useRef, useState } from "react";

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
            <style jsx>{`
                .char {
                    animation-play-state: paused;
                }
                .char.animate {
                    animation: wave 3s ease-in-out infinite;
                    animation-play-state: running;
                }
                @keyframes wave {
                    0%, 100% { 
                        transform: translate3d(0, 0, 0) rotate(0deg); 
                    }
                    25% { 
                        transform: translate3d(0, -10px, 0) rotate(3deg); 
                    }
                    50% { 
                        transform: translate3d(0, 0, 0) rotate(0deg); 
                    }
                    75% { 
                        transform: translate3d(0, -5px, 0) rotate(-2deg); 
                    }
                }
            `}</style>
        </div>
    );
}