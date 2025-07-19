'use client';
import React, { useEffect, useRef, useState } from "react";

import './style_nextSection.scss'

declare global {
  interface SVGSVGElement {
    pauseAnimations(): void;
    unpauseAnimations(): void;
  }
}

export default function NextSection() {
    const [isVisible, setIsVisible] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const svgCircleRef = useRef<SVGSVGElement>(null);
    const svgArrowRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!containerRef.current || !svgCircleRef.current || !svgArrowRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
                
                if (entry.isIntersecting) {
                    svgCircleRef.current?.unpauseAnimations();
                    svgArrowRef.current?.unpauseAnimations();
                } else {
                    svgCircleRef.current?.pauseAnimations();
                    svgArrowRef.current?.pauseAnimations();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(containerRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    const handleClick = () => {
        const nextSection = document.getElementById('about-us');
        nextSection?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div 
            ref={containerRef}
            className="absolute left-1/2 bottom-8 transform -translate-x-1/2 cursor-pointer z-10 group"
            onClick={handleClick}
        >
            <div className={`relative ${isVisible ? 'animate-bounce-fade' : 'opacity-0'}`}>
                <svg 
                    ref={svgCircleRef}
                    width="64" 
                    height="64" 
                    viewBox="0 0 64 64" 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                    style={{ zIndex: 0 }}
                >
                    <defs>
                        <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#d84ed7">
                                <animate attributeName="stop-color" values="#d84ed7;#55449a;#d84ed7" dur="4s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="100%" stopColor="#55449a">
                                <animate attributeName="stop-color" values="#55449a;#d84ed7;#55449a" dur="4s" repeatCount="indefinite" />
                            </stop>
                        </linearGradient>
                        <linearGradient id="circleStatic" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fff" />
                            <stop offset="100%" stopColor="#fff" />
                        </linearGradient>
                    </defs>
                    <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="#ffffff55"
                        strokeWidth="4"
                    />
                    <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="url(#circleGradient)"
                        strokeWidth="4"
                        strokeDasharray={2 * Math.PI * 28}
                        strokeDashoffset={2 * Math.PI * 28}
                        className="circle-timer"
                        style={{ 
                            transform: 'rotate(-90deg)',
                            transformOrigin: '50% 50%',
                            willChange: 'transform, stroke-dashoffset' 
                        }}
                    />
                </svg>
                <svg 
                    ref={svgArrowRef}
                    width="48" 
                    height="48" 
                    viewBox="0 0 48 48" 
                    fill="none" 
                    className="drop-shadow-lg relative z-10"
                >
                    <defs>
                        <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#d84ed7">
                                <animate attributeName="stop-color" values="#d84ed7;#55449a;#d84ed7" dur="4s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="100%" stopColor="#55449a">
                                <animate attributeName="stop-color" values="#55449a;#d84ed7;#55449a" dur="4s" repeatCount="indefinite" />
                            </stop>
                        </linearGradient>
                        <linearGradient id="arrowStatic" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#fff" />
                            <stop offset="100%" stopColor="#fff" />
                        </linearGradient>
                    </defs>
                    <path 
                        d="M24 36V12M24 36L12 24M24 36L36 24" 
                        stroke="url(#arrowGradient)" 
                        strokeWidth="4" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                    />
                </svg>
            </div>
        </div>
    );
}