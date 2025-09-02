'use client';
import '../../variables.scss';
import Image from 'next/image';
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CategorySection() {
    const canvasRefs = Array.from({ length: 12 }, () => useRef<HTMLCanvasElement>(null));
    const animationIdsRef = useRef<Array<number | null>>(Array(12).fill(null));
    const animationDataRef = useRef<Array<{
        drops: number[];
        frame: number;
        columns: number;
        width: number;
        height: number;
    } | null>>(Array(12).fill(null));

    const categoriesContainerRef = useRef<HTMLDivElement>(null);
    const [activatedIcons, setActivatedIcons] = useState<boolean[]>(Array(12).fill(false));
    const iconRefs = useRef<(SVGSVGElement | null)[]>(Array(12).fill(null));
    const iconTweensRef = useRef<Array<gsap.core.Tween | null>>(Array(12).fill(null));
    const iconObserversRef = useRef<Array<IntersectionObserver | null>>(Array(12).fill(null));
    const activeItemRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollAnimationFrameRef = useRef<number | null>(null);
    const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const rafActiveRef = useRef<boolean>(true);

    const setIconRef = useCallback((index: number) => (el: SVGSVGElement | null) => {
        iconRefs.current[index] = el;
    }, []);

    const isTouchDevice = useCallback((): boolean => {
        if (typeof window === "undefined") return false;
        return (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            window.matchMedia('(pointer: coarse)').matches
        );
    }, []);

    const startAnimation = useCallback((index: number) => {
        if (!rafActiveRef.current) return;
        
        const canvas = canvasRefs[index].current;
        if (!canvas) return;

        canvas.style.willChange = 'transform';

        const container = canvas.parentElement;
        if (!container) return;

        const displayWidth = container.clientWidth;
        const displayHeight = container.clientHeight;

        canvas.width = displayWidth;
        canvas.height = displayHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const letters = 'АァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ'.repeat(6).split('');
        const fontSize = 18;
        const columns = Math.floor(displayWidth / fontSize);

        let drops: number[];
        let frame = 0;

        if (animationDataRef.current[index]) {
            drops = animationDataRef.current[index]!.drops;
            frame = animationDataRef.current[index]!.frame;
        } else {
            drops = Array.from(
                { length: columns },
                () => Math.random() * displayHeight / fontSize
            );
        }

        if (animationIdsRef.current[index] !== null) {
            cancelAnimationFrame(animationIdsRef.current[index]!);
        }

        const targetFps = isTouchDevice() ? 20 : 30;
        const interval = 1000 / targetFps;
        let lastTime = 0;

        const draw = (currentTime: number) => {
            if (!rafActiveRef.current || !canvas.isConnected) {
                stopAnimation(index);
                return;
            }

            const elapsed = currentTime - lastTime;

            if (elapsed > interval) {
                lastTime = currentTime - (elapsed % interval);

                const rect = canvas.getBoundingClientRect();
                const isVisible = (
                    rect.top < window.innerHeight &&
                    rect.bottom > 0 &&
                    rect.left < window.innerWidth &&
                    rect.right > 0
                );

                if (!isVisible) {
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

                animationDataRef.current[index] = {
                    drops,
                    frame,
                    columns,
                    width: displayWidth,
                    height: displayHeight
                };
            }

            animationIdsRef.current[index] = requestAnimationFrame(draw);
        };

        animationIdsRef.current[index] = requestAnimationFrame(draw);
    }, [isTouchDevice]);

    const stopAnimation = useCallback((index: number) => {
        if (animationIdsRef.current[index] !== null) {
            cancelAnimationFrame(animationIdsRef.current[index]!);
            animationIdsRef.current[index] = null;
        }

        const canvas = canvasRefs[index].current;
        if (canvas) {
            canvas.style.willChange = 'auto';
        }
    }, []);

    useEffect(() => {
        rafActiveRef.current = true;
        
        const checkVisibility = () => {
            if (!rafActiveRef.current) return;
            
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
            canvasRefs.forEach(canvasRef => {
                if (canvasRef.current) {
                    canvasRef.current.style.willChange = 'auto';
                }
            });

            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }

            resizeTimeoutRef.current = setTimeout(() => {
                for (let i = 0; i < canvasRefs.length; i++) {
                    if (animationIdsRef.current[i] !== null) {
                        startAnimation(i);
                    }
                }
            }, 100);
        };

        window.addEventListener('resize', handleResize, { passive: true });
        window.addEventListener('scroll', checkVisibility, { passive: true });

        return () => {
            rafActiveRef.current = false;
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', checkVisibility);
            
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }

            for (let i = 0; i < canvasRefs.length; i++) {
                stopAnimation(i);
            }
        };
    }, [startAnimation, stopAnimation]);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        iconRefs.current.forEach((icon, index) => {
            if (icon && !activatedIcons[index]) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            iconTweensRef.current[index]?.resume();
                        } else {
                            iconTweensRef.current[index]?.pause();
                        }
                    });
                }, { threshold: 0.1 });

                observer.observe(icon);
                observers.push(observer);
                iconObserversRef.current[index] = observer;
            }
        });

        return () => {
            observers.forEach(observer => observer.disconnect());
        };
    }, [activatedIcons]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.utils.toArray('.category-item').forEach((element: any) => {
                gsap.fromTo(element,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1.5,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: element,
                            start: "top 85%",
                            toggleActions: "play none none none",
                            markers: false
                        }
                    }
                );
            });

            gsap.utils.toArray('.click-icon').forEach((icon: any, index: number) => {
                const pulseTween = gsap.to(icon, {
                    y: -8,
                    duration: 1.2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    paused: true
                });

                iconTweensRef.current[index] = pulseTween;

                gsap.fromTo(icon,
                    { opacity: 0, scale: 0.5 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        delay: 0.3,
                        scrollTrigger: {
                            trigger: icon,
                            start: "top 90%",
                            toggleActions: "play none none reverse",
                            onEnter: () => pulseTween.play(),
                            onLeaveBack: () => pulseTween.pause()
                        }
                    }
                );
            });
        }, categoriesContainerRef);

        return () => ctx.revert();
    }, []);

    const hideIcon = useCallback((index: number) => {
        if (activatedIcons[index]) return;
        
        iconTweensRef.current[index]?.pause();
        
        const icon = iconRefs.current[index];
        if (icon) {
            gsap.to(icon, {
                opacity: 0,
                scale: 0,
                duration: 0.4,
                onComplete: () => {
                    setActivatedIcons(prev => {
                        const newActivated = [...prev];
                        newActivated[index] = true;
                        return newActivated;
                    });
                    
                    if (iconObserversRef.current[index]) {
                        iconObserversRef.current[index]?.disconnect();
                        iconObserversRef.current[index] = null;
                    }
                }
            });
        }
    }, [activatedIcons]);

    const handleTouchClick = (index: number, duration: number = 1500) => {
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
            activeItemRef.current = index;
        } else if (activeItemRef.current === index) {
            smoothScrollToMap(duration);
            activeItemRef.current = null;
        } else {
            activeItemRef.current = index;
        }
    };

    const smoothScrollToMap = useCallback((duration: number = 1500): void => {
        const target = document.getElementById('hookForm');
        if (!target) return;

        if (scrollAnimationFrameRef.current) {
            cancelAnimationFrame(scrollAnimationFrameRef.current);
        }

        const start = window.scrollY;
        const end = target.getBoundingClientRect().top + window.scrollY;
        const change = end - start;
        const startTime = performance.now();

        const animateScroll = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = (t: number) => t * (2 - t);
            window.scrollTo(0, start + change * ease(progress));
            
            if (progress < 1) {
                scrollAnimationFrameRef.current = requestAnimationFrame(animateScroll);
            } else {
                scrollAnimationFrameRef.current = null;
            }
        };

        scrollAnimationFrameRef.current = requestAnimationFrame(animateScroll);
    }, []);

    useEffect(() => {
        const handleDocumentClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                activeItemRef.current = null;
            }
        };

        document.addEventListener('click', handleDocumentClick);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, []);

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
            subtitle: "(Серия Green Label) (Биометрическая идентификация) (Контроль доaccess) (Умный офис)",
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
                                if (!isTouchDevice()) {
                                    startAnimation(index);
                                    hideIcon(index);
                                }
                            }}
                            onMouseLeave={() => !isTouchDevice() && stopAnimation(index)}
                            onClick={() => handleTouchClick(index, 4000)}
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
                                <h4 className="h4__category-section_responsive-font">
                                    {category.title}
                                </h4>
                                {category.subtitle && (
                                    <h5 className="h5__category-section_responsive-font">
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
                                    transform: 'translateZ(0)'
                                }}
                            />
                            
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