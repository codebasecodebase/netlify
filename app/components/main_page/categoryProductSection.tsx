'use client';
import '../../variables.scss';
import Image from 'next/image';
import React, { useRef, useEffect, useCallback } from 'react';

export default function CategorySection() {
    // Создаем рефы для всех canvas (по количеству блоков)
    const canvasRefs = Array.from({ length: 12 }, () => useRef<HTMLCanvasElement>(null));
    const animationIdsRef = useRef<Array<number | null>>(Array(12).fill(null));
    const animationDataRef = useRef<Array<{
        drops: number[];
        frame: number;
        columns: number;
        width: number;
        height: number;
    } | null>>(Array(12).fill(null));

    // Функция запуска анимации для конкретного индекса
    const startAnimation = useCallback((index: number) => {
        const canvas = canvasRefs[index].current;
        if (!canvas) return;

        // Активируем GPU оптимизацию
        canvas.style.willChange = 'transform';

        const container = canvas.parentElement;
        if (!container) return;

        // Получаем размеры контейнера
        const displayWidth = container.clientWidth;
        const displayHeight = container.clientHeight;

        // Устанавливаем размеры canvas
        canvas.width = displayWidth;
        canvas.height = displayHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Параметры анимации
        const letters = 'АァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ'.repeat(6).split('');
        const fontSize = 18;
        const columns = Math.floor(displayWidth / fontSize);

        // Используем существующие данные или создаем новые
        let drops: number[];
        let frame = 0;

        if (animationDataRef.current[index]) {
            // Восстанавливаем из сохраненных данных
            drops = animationDataRef.current[index]!.drops;
            frame = animationDataRef.current[index]!.frame;
        } else {
            // Создаем новые данные
            drops = Array.from(
                { length: columns },
                () => Math.random() * displayHeight / fontSize
            );
        }

        // Останавливаем предыдущую анимацию, если была
        if (animationIdsRef.current[index] !== null) {
            cancelAnimationFrame(animationIdsRef.current[index]!);
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, displayWidth, displayHeight);
            ctx.font = `${fontSize}px monospace`;
            ctx.fillStyle = '#0f0';

            for (let i = 0; i < drops.length; i++) {
                const text = letters[Math.floor(Math.random() * letters.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > displayHeight && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                if (frame % 5 === 0) {
                    drops[i]++;
                }
            }

            frame++;

            // Сохраняем состояние анимации
            animationDataRef.current[index] = {
                drops,
                frame,
                columns,
                width: displayWidth,
                height: displayHeight
            };

            animationIdsRef.current[index] = requestAnimationFrame(draw);
        };

        animationIdsRef.current[index] = requestAnimationFrame(draw);
    }, []);

    // Функция остановки анимации
    const stopAnimation = useCallback((index: number) => {
        if (animationIdsRef.current[index] !== null) {
            cancelAnimationFrame(animationIdsRef.current[index]!);
            animationIdsRef.current[index] = null;
        }

        // Деактивируем GPU оптимизацию
        const canvas = canvasRefs[index].current;
        if (canvas) {
            canvas.style.willChange = 'auto';
        }
    }, []);

    // Обработчик ресайза
    useEffect(() => {
        let resizeTimeout: NodeJS.Timeout;

        const handleResize = () => {
            // Временно отключаем GPU оптимизацию
            canvasRefs.forEach(canvasRef => {
                if (canvasRef.current) {
                    canvasRef.current.style.willChange = 'auto';
                }
            });

            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Перезапускаем активные анимации
                for (let i = 0; i < canvasRefs.length; i++) {
                    if (animationIdsRef.current[i] !== null) {
                        startAnimation(i);
                    }
                }
            }, 100);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimeout);

            // Останавливаем все анимации
            for (let i = 0; i < canvasRefs.length; i++) {
                if (animationIdsRef.current[i] !== null) {
                    cancelAnimationFrame(animationIdsRef.current[i]!);
                }
                // Сбрасываем GPU оптимизацию
                const canvas = canvasRefs[i].current;
                if (canvas) {
                    canvas.style.willChange = 'auto';
                }
            }
        };
    }, [startAnimation]);

    function isTouchDevice(): boolean {
        if (typeof window === "undefined") return false;
        return (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            window.matchMedia('(pointer: coarse)').matches
        );
    };

    // Внутри компонента:
    const activeItemRef = useRef<number | null>(null);
    const handleTouchClick = (index: number, duration: number = 1500) => {
        if (!isTouchDevice()) {
            smoothScrollToMap(duration);
            return;
        }

        if (activeItemRef.current === null) {
            // Первый клик - активируем элемент
            activeItemRef.current = index;
        } else if (activeItemRef.current === index) {
            // Второй клик на тот же элемент - скроллим
            smoothScrollToMap(duration);
            activeItemRef.current = null;
        } else {
            // Клик на другой элемент - просто меняем активный
            activeItemRef.current = index;
        }
    };

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleDocumentClick = (e: MouseEvent) => {
            if (containerRef.current &&
                !containerRef.current.contains(e.target as Node)) {
                activeItemRef.current = null;
            }
        };

        document.addEventListener('click', handleDocumentClick);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    function smoothScrollToMap(duration: number = 1500): void {
        const target = document.getElementById('hookForm');
        if (!target) return;
        const start = window.scrollY;
        const end = target.getBoundingClientRect().top + window.scrollY;
        const change = end - start;
        const startTime = performance.now();

        function easeInOutCubic(t: number): number {
            return t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function animateScroll(currentTime: number): void {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);
            window.scrollTo(0, start + change * easedProgress);
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        }
        requestAnimationFrame(animateScroll);
    }

    // Данные для блоков
    const categories = [
        {
            img: "https://kompunity.by/wp-content/uploads/2023/07/camera.jpg",
            title: "Системы видеонаблюдения",
            subtitle: "(TRASSIR, Dahua, EZ-IP, Tiandy, Hikvision, HiWatch, Ezviz, Uniview)",
            className: "category-image-main",
            width: 1468,
            height: 370
        },
        {
            img: "https://kompunity.by/wp-content/uploads/2023/07/pvem.jpg",
            title: "Компьютеры \"ПЭВМ\" (Производство РБ)",
            subtitle: "Собираем компьютеры любой конфигурации",
            className: "category-image-row",
            width: 479,
            height: 370
        },
        {
            img: "https://kompunity.by/wp-content/uploads/2023/07/monitor.jpg",
            title: "Мониторы, телевизоры",
            subtitle: "",
            className: "category-image-row",
            width: 479,
            height: 370
        },
        {
            img: "https://kompunity.by/wp-content/uploads/2023/07/komplektuyushie.jpg",
            title: "Компьютерные комплектующие",
            subtitle: "",
            className: "category-image-row",
            width: 479,
            height: 370
        },
        {
            img: "https://kompunity.by/wp-content/uploads/2023/07/nout.jpg",
            title: "Ноутбуки",
            subtitle: "(Asus, Lenovo, HP, Acer, Dell, MSI)",
            className: "category-image-row",
            width: 479,
            height: 370
        },
        {
            img: "https://kompunity.by/wp-content/uploads/2023/07/printer.jpg",
            title: "Принтеры МФУ",
            subtitle: "Canon, HP, Kyocera, Pantum",
            className: "category-image-row",
            width: 479,
            height: 370
        },
        {
            img: "https://kompunity.by/wp-content/uploads/2023/07/server.jpg",
            title: "Сервера (Производство РБ)",
            subtitle: "а так же HP, Dell.",
            className: "category-image-row",
            width: 479,
            height: 370
        },
        {
            img: "https://kompunity.by/wp-content/uploads/2023/07/monoblok.jpg",
            title: "Моноблок",
            subtitle: "(Производство РБ), а так же ASUS, Lenovo, Acer, HP.",
            className: "category-image-row",
            width: 479,
            height: 370
        },
        {
            img: "https://kompunity.by/wp-content/uploads/2023/07/rashodnie.jpg",
            title: "Расходные материалы для печатной техники",
            subtitle: "(картриджи, тонер, фотобарабаны и т.д.)",
            className: "category-image-row",
            width: 479,
            height: 370
        },
        {
            img: "https://kompunity.by/wp-content/uploads/2023/07/setevoe.jpg",
            title: "Интерактивные доски, интерактивные панели",
            subtitle: "",
            className: "category-image-row",
            width: 479,
            height: 370
        },
        {
            img: "https://kompunity.by/wp-content/uploads/2023/07/aksesuari.jpg",
            title: "Компьютерная переферия",
            subtitle: "(Мыши, клавиатуры, колонки, web-камеры и т.д)",
            className: "category-image-row-bottom",
            width: 727,
            height: 370
        },
        {
            img: "https://kompunity.by/wp-content/uploads/2023/07/zkteco.jpg",
            title: "Турникеты TRASSIR, ZKTeco",
            subtitle: "(Серия Green Label) (Биометрическая идентификация) (Контроль доступа) (Умный офис)",
            className: "category-image-row-bottom",
            width: 727,
            height: 370
        }
    ];

    return (
        <section className="section__responsive-padding relative" style={{ background: '#f9f9f9' }}>
            <div className="container text-center">
                <h2 className="h2__section-title_responsive-font">ОБОРУДОВАНИЕ</h2>
                <h3 className="h3__section-title_responsive-font pb-[25px] font-semibold">Мы поставляем следующее оборудование</h3>
                <div className="text-center flex justify-center items-center relative max-[1150px]:flex-col max-[1150px]:mt-[15px]">
                    <h3 className="h3__section-title_responsive-font mr-[30px] italic font-semibold max-[1150px]:mr-[0px]" style={{ color: '#2f4a99' }}>ТОП ДИСТРИБЬЮТОР БРЕНДА</h3>
                    <Image
                        src="https://kompunity.by/wp-content/uploads/2023/08/trassir.png"
                        alt="Slide"
                        width={285}
                        height={87}
                        quality={100}
                        sizes="100vw"
                        className="ml-[20px] z-10 max-[1150px]:ml-[0px]"
                        loading="lazy"
                    />
                </div>

                <div className="category-section__images" ref={containerRef}>
                    {categories.map((category, index) => (
                        <picture
                            key={index}
                            className={category.className}
                            style={{ position: 'relative' }}
                            onMouseEnter={() => startAnimation(index)}
                            onMouseLeave={() => stopAnimation(index)}
                            ref={containerRef}
                        >
                            <Image
                                src={category.img}
                                alt={`Slide ${index + 1}`}
                                width={category.width}
                                height={category.height}
                                quality={100}
                                sizes="100vw"
                                loading="lazy"
                            />
                            <div className='category-text select-none'>
                                <h4
                                    className="h4__category-section_responsive-font"
                                    onClick={() => handleTouchClick(index, 4000)}
                                    ref={containerRef}
                                >
                                    {category.title}
                                </h4>
                                {category.subtitle && (
                                    <h5
                                        className="h5__category-section_responsive-font"
                                        onClick={() => handleTouchClick(index, 4000)}
                                        ref={containerRef}
                                    >
                                        {category.subtitle}
                                    </h5>
                                )}
                            </div>
                            <canvas
                                ref={canvasRefs[index]}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    zIndex: 0,
                                    pointerEvents: 'none',
                                    opacity: 0.2,
                                    transform: 'translateZ(0)' // Форсируем GPU рендеринг
                                }}
                            />
                        </picture>
                    ))}
                </div>
            </div>
        </section>
    );
}