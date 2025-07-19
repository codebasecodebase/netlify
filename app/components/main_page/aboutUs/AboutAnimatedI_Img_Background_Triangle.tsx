'use client';
import React, { useEffect, useRef, useState, useCallback } from "react";

export default function AnimatedTriangele() {
    type Rect = {
        x: number;
        y: number;
        zIndex: number;
        size: number;
        baseRotation: number;
        rotation: number;
        scale: number;
        scaleDir: number;
        rotateDir: number;
    };

    const [rects, setRects] = useState<Rect[]>([]);
    const animationRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);
    const interval = 16; // 60 FPS (1000ms/60 ≈ 16ms)
    const containerRef = useRef<HTMLDivElement>(null);
    const isPageVisibleRef = useRef(true);
    const isContainerVisibleRef = useRef(true);
    const isRunningRef = useRef(true);

    // Инициализация фигур
    useEffect(() => {
        const fixedRects: Rect[] = [
            { x: 10, y: 20, zIndex: 20, size: 200, baseRotation: 0, rotation: 0, scale: 1, scaleDir: 1, rotateDir: 1 },
            { x: 50, y: 25, zIndex: 30, size: 150, baseRotation: 45, rotation: 0, scale: 1, scaleDir: -1, rotateDir: -1 },
            { x: 30, y: 30, zIndex: 30, size: 350, baseRotation: 45, rotation: 0, scale: 1, scaleDir: -1, rotateDir: -1 },
            { x: 90, y: 60, zIndex: 40, size: 180, baseRotation: 90, rotation: 0, scale: 1, scaleDir: 1, rotateDir: 1 },
            { x: 80, y: 80, zIndex: 50, size: 320, baseRotation: 135, rotation: 0, scale: 1, scaleDir: -1, rotateDir: -1 },
            { x: 50, y: 10, zIndex: 60, size: 400, baseRotation: 180, rotation: 0, scale: 1, scaleDir: 1, rotateDir: 1 },
            // Добавьте больше объектов по необходимости (до 10 или больше)
            // Пример: { x: 20, y: 30, zIndex: 60, size: 90, baseRotation: 225, rotation: 0, scale: 1, scaleDir: -1, rotateDir: -1 },
        ];
        setRects(fixedRects);
    }, []);

    // Функция анимации
    const animate = useCallback((time: number) => {
        if (time - lastTimeRef.current >= interval) {
            setRects(prev => prev.map(r => {
                let newScale = r.scale + 0.005 * r.scaleDir;
                if (newScale > 1.08 || newScale < 0.92) {
                    newScale = Math.max(0.92, Math.min(1.08, newScale));
                    return { 
                        ...r, 
                        scale: newScale,
                        rotation: r.rotation + r.rotateDir * 0.2,
                        scaleDir: r.scaleDir * -1
                    };
                }
                return { 
                    ...r, 
                    scale: newScale,
                    rotation: r.rotation + r.rotateDir * 0.2
                };
            }));
            lastTimeRef.current = time;
        }
        animationRef.current = requestAnimationFrame(animate);
    }, []);

    // Обновление состояния анимации
    const updateAnimationState = useCallback(() => {
        const shouldRun = isPageVisibleRef.current && isContainerVisibleRef.current;
        
        if (shouldRun && !isRunningRef.current) {
            // Возобновляем анимацию
            isRunningRef.current = true;
            lastTimeRef.current = performance.now();
            animationRef.current = requestAnimationFrame(animate);
        } else if (!shouldRun && isRunningRef.current) {
            // Останавливаем анимацию
            isRunningRef.current = false;
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        }
    }, [animate]);

    // Настройка Intersection Observer и Page Visibility
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Обработчик видимости страницы
        const handleVisibilityChange = () => {
            isPageVisibleRef.current = document.visibilityState === 'visible';
            updateAnimationState();
        };

        // Обработчик видимости контейнера
        const observer = new IntersectionObserver(([entry]) => {
            isContainerVisibleRef.current = entry.isIntersecting;
            updateAnimationState();
        }, { threshold: 0.1 });

        // Подписка на события
        observer.observe(container);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Инициализация анимации
        animationRef.current = requestAnimationFrame(animate);

        // Очистка
        return () => {
            observer.disconnect();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [animate, updateAnimationState]);

    return (
        <div ref={containerRef} className="absolute inset-0">
            {rects.map((r, i) => (
                <svg
                    key={i}
                    className="absolute pointer-events-none"
                    style={{
                        left: `${r.x}%`,
                        top: `${r.y}%`,
                        zIndex: `${r.zIndex}`,
                        width: `${r.size}px`,
                        height: `${r.size}px`,
                        transform: `rotate(${r.baseRotation + r.rotation}deg) scale(${r.scale})`,
                        opacity: 0.3,
                        transition: 'transform 0.2s',
                        willChange: 'transform, opacity'
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 1550 1550"
                >
                    <defs>
                        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="nnneon-grad">
                            <stop stopColor="hsl(162, 100%, 58%)" stopOpacity="1" offset="0%"></stop>
                            <stop stopColor="hsl(270, 73%, 53%)" stopOpacity="1" offset="100%"></stop>
                        </linearGradient>
                        <filter id="nnneon-filter" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feGaussianBlur stdDeviation="14 14" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur"></feGaussianBlur>
                        </filter>
                        <filter id="nnneon-filter2" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feGaussianBlur stdDeviation="42 51" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur"></feGaussianBlur>
                        </filter>
                    </defs>
                    <g strokeWidth="16" stroke="url(#nnneon-grad)" fill="none">
                        <polygon points="400,255.5 255.5,544.5 544.5,544.5" filter="url(#nnneon-filter)"></polygon>
                        <polygon points="412,255.5 267.5,544.5 556.5,544.5" filter="url(#nnneon-filter2)" opacity="0.25"></polygon>
                        <polygon points="388,255.5 243.5,544.5 532.5,544.5" filter="url(#nnneon-filter2)" opacity="0.25"></polygon>
                        <polygon points="400,255.5 255.5,544.5 544.5,544.5"></polygon>
                    </g>
                </svg>
            ))}
        </div>
    );
}