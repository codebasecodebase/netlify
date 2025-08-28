'use client';
import '../../variables.scss';
import Image from 'next/image';
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Регистрируем плагин ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

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

    // Ref для контейнера категорий
    const categoriesContainerRef = useRef<HTMLDivElement>(null);
    
    // Состояние для отслеживания, была ли иконка активирована
    const [activatedIcons, setActivatedIcons] = useState<boolean[]>(Array(12).fill(false));
    
    // Ref для SVG иконок - исправленный тип
    const iconRefs = useRef<(SVGSVGElement | null)[]>(Array(12).fill(null));

    // Функция для установки ref
    const setIconRef = useCallback((index: number) => (el: SVGSVGElement | null) => {
        iconRefs.current[index] = el;
    }, []);

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
            const canvas = canvasRefs[index].current;
            if (!canvas) return;

            // Check if element is in viewport
            const rect = canvas.getBoundingClientRect();
            const isVisible = (
                rect.top < window.innerHeight &&
                rect.bottom > 0 &&
                rect.left < window.innerWidth &&
                rect.right > 0
            );

            if (!isVisible) {
                // Создаем событие mouseleave
                const mouseLeaveEvent = new MouseEvent('mouseleave', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });

                // Рассылаем событие всем элементам
                document.querySelectorAll('*').forEach(el => {
                    el.dispatchEvent(mouseLeaveEvent);
                });

                stopAnimation(index);
                return;
            }

            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, displayWidth, displayHeight);
            ctx.font = `${fontSize}px monospace`;
            ctx.fillStyle = '#0f0';

            for (let i = 0; i < drops.length; i++) {
                const text = frame % 5 === 0 ? letters[Math.floor(Math.random() * letters.length)] : ' ';
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > displayHeight && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                if (frame % 20 === 0) {
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

        const checkVisibility = () => {
            for (let i = 0; i < canvasRefs.length; i++) {
                if (animationIdsRef.current[i] !== null) {
                    const canvas = canvasRefs[i].current;
                    if (canvas) {
                        const rect = canvas.getBoundingClientRect();
                        const isVisible = (
                            rect.top < window.innerHeight &&
                            rect.bottom > 0 &&
                            rect.left < window.innerWidth &&
                            rect.right > 0
                        );
                        if (!isVisible) {
                            stopAnimation(i);
                        }
                    }
                }
            }
        };

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
        window.addEventListener('scroll', checkVisibility);

        // Initial check
        checkVisibility();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', checkVisibility);
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

    // Эффект для анимации появления элементов
    useEffect(() => {
        const ctx = gsap.context(() => {
            const elements = gsap.utils.toArray('.category-item');
            
            elements.forEach((element: any) => {
                gsap.fromTo(element,
                    {
                        opacity: 0,
                        y: 50
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 2,
                        scrollTrigger: {
                            trigger: element,
                            start: "top 80%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            });

            // Анимация для SVG иконок
            const icons = gsap.utils.toArray('.click-icon');
            icons.forEach((icon: any) => {
                gsap.fromTo(icon,
                    {
                        opacity: 0,
                        scale: 0.5
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        delay: 0.5,
                        scrollTrigger: {
                            trigger: icon,
                            start: "top 90%",
                            toggleActions: "play none none none"
                        }
                    }
                );
                
                // Анимация пульсации
                gsap.to(icon, {
                    y: -10,
                    duration: 1,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            });
        }, categoriesContainerRef);

        return () => ctx.revert();
    }, []);

    // Функция для скрытия иконки при взаимодействии
    const hideIcon = useCallback((index: number) => {
        if (activatedIcons[index]) return;
        
        const icon = iconRefs.current[index];
        if (icon) {
            gsap.to(icon, {
                opacity: 0,
                scale: 0,
                duration: 0.5,
                onComplete: () => {
                    const newActivated = [...activatedIcons];
                    newActivated[index] = true;
                    setActivatedIcons(newActivated);
                }
            });
        }
    }, [activatedIcons]);

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
        // Скрываем иконку при первом клике на мобильном устройстве
        if (isTouchDevice() && !activatedIcons[index]) {
            hideIcon(index);
            activeItemRef.current = index;
            return;
        }

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
            // Клик на другой элемента - просто меняем активный
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

                <div className="category-section__images" ref={categoriesContainerRef}>
                    {categories.map((category, index) => (
                        <picture
                            key={index}
                            className={`${category.className} category-item`}
                            style={{ position: 'relative' }}
                            onMouseEnter={() => {
                                startAnimation(index);
                                // Скрываем иконку при наведении на десктопе
                                if (!isTouchDevice()) {
                                    hideIcon(index);
                                }
                            }}
                            onMouseLeave={() => stopAnimation(index)}
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
                                >
                                    {category.title}
                                </h4>
                                {category.subtitle && (
                                    <h5
                                        className="h5__category-section_responsive-font"
                                        onClick={() => handleTouchClick(index, 4000)}
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
                                    zIndex: 1,
                                    pointerEvents: 'none',
                                    opacity: 0.3,
                                    transform: 'translateZ(0)' // Форсируем GPU рендеринг
                                }}
                            />
                            
                            {/* Анимированная SVG иконка */}
                            {!activatedIcons[index] && (
                                <svg 
                                    ref={setIconRef(index)}
                                    className="click-icon"
                                    viewBox="0 0 24 24" 
                                    width="48" 
                                    height="48"
                                    style={{
                                        position: 'absolute',
                                        bottom: '20px',
                                        right: '20px',
                                        zIndex: 2,
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        if (isTouchDevice()) {
                                            handleTouchClick(index, 4000);
                                        }
                                    }}
                                >
                                    <path
                                        fill="#ffffff"
                                        d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"
                                    />
                                    <path
                                        fill="#8f0000"
                                        d="M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10Z"
                                    />
                                </svg>
                            )}
                        </picture>
                    ))}
                </div>
            </div>
        </section>
    );
}