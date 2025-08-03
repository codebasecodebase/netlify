"use client"

import '../../variables.scss';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useRef, useLayoutEffect } from 'react';

export default function AdventagesSection() {
    type GSAPElement = HTMLElement | null;
    // Создаем массив рефов
    // Типизированный массив рефов
    const itemRefs = useRef<GSAPElement[]>([]);

    useLayoutEffect(() => {
        // Регистрируем плагин (если еще не зарегистрирован)
        gsap.registerPlugin(ScrollTrigger);

        // Проверяем и анимируем каждый элемент
        if (itemRefs.current[0]) {
            gsap.fromTo(itemRefs.current[0],
                { autoAlpha: 0, y: 50 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.8,
                    force3D: true,
                    scrollTrigger: {
                        trigger: itemRefs.current[0],
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    }
                }
            );
        }

        if (itemRefs.current[1]) {
            gsap.fromTo(itemRefs.current[1],
                { autoAlpha: 0, x: 100, rotation: -5 },
                {
                    autoAlpha: 1,
                    x: 0,
                    rotation: 0,
                    duration: 1.2,
                    ease: 'back.out(1.5)',
                    force3D: true,
                    scrollTrigger: {
                        trigger: itemRefs.current[1],
                        start: 'top 85%',
                        toggleActions: 'play pause resume reverse',
                    }
                }
            );
        }

        // Элемент 3: Появление сверху
        if (itemRefs.current[2]) {
            gsap.fromTo(itemRefs.current[2],
                { autoAlpha: 0, y: -50 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.9,
                    ease: 'power3.out',
                    force3D: true,
                    scrollTrigger: {
                        trigger: itemRefs.current[2],
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    }
                }
            );
        }

        // Элемент 4: Появление с масштабированием
        if (itemRefs.current[3]) {
            gsap.fromTo(itemRefs.current[3],
                { autoAlpha: 0, scale: 0.8 },
                {
                    autoAlpha: 1,
                    scale: 1,
                    duration: 1.1,
                    ease: 'elastic.out(1, 0.8)',
                    force3D: true,
                    scrollTrigger: {
                        trigger: itemRefs.current[3],
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    }
                }
            );
        }

        // Элемент 5: Появление с прозрачностью и размытием
        if (itemRefs.current[4]) {
            gsap.fromTo(itemRefs.current[4],
                { autoAlpha: 0, filter: 'blur(10px)' },
                {
                    autoAlpha: 1,
                    filter: 'blur(0)',
                    duration: 1.3,
                    ease: 'slow(0.7, 0.7, false)',
                    force3D: true,
                    scrollTrigger: {
                        trigger: itemRefs.current[4],
                        start: 'top 85%',
                        toggleActions: 'play pause resume reverse',
                    }
                }
            );
        }

        // Элемент 6: Появление с вращением
        if (itemRefs.current[5]) {
            gsap.fromTo(itemRefs.current[5],
                { autoAlpha: 0, rotation: 45 },
                {
                    autoAlpha: 1,
                    rotation: 0,
                    duration: 1.0,
                    ease: 'expo.out',
                    force3D: true,
                    scrollTrigger: {
                        trigger: itemRefs.current[5],
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    }
                }
            );
        }

        // Элемент 7: Волнообразное появление
        if (itemRefs.current[6]) {
            gsap.fromTo(itemRefs.current[6],
                { autoAlpha: 0, y: 30 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 1.4,
                    ease: 'bounce.out',
                    force3D: true,
                    scrollTrigger: {
                        trigger: itemRefs.current[6],
                        start: 'top 85%',
                        toggleActions: 'play pause resume reverse',
                    }
                }
            );
        }

        // Элемент 8: Появление с отскоком слева
        if (itemRefs.current[7]) {
            gsap.fromTo(itemRefs.current[7],
                { autoAlpha: 0, x: -100 },
                {
                    autoAlpha: 1,
                    x: 0,
                    duration: 1.1,
                    ease: 'circ.out',
                    force3D: true,
                    scrollTrigger: {
                        trigger: itemRefs.current[7],
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    }
                }
            );
        }

        // Элемент 9: Плавное увеличение прозрачности
        if (itemRefs.current[8]) {
            gsap.fromTo(itemRefs.current[8],
                { autoAlpha: 0 },
                {
                    autoAlpha: 1,
                    duration: 1.6,
                    ease: 'sine.inOut',
                    force3D: true,
                    scrollTrigger: {
                        trigger: itemRefs.current[8],
                        start: 'top 85%',
                        toggleActions: 'play pause resume reverse',
                    }
                }
            );
        }

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    // Типизированная функция для добавления рефов
    const addToRefs = (el: GSAPElement) => {
        if (el && !itemRefs.current.includes(el)) {
            itemRefs.current.push(el);
        }
    };

    return (
        <section className="section__responsive-padding relative">
            <div className="lines">
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>
            <div className="container text-center overflow-hidden">
                <h2 className="h2__section-title_responsive-font z-20">НАШИ ПРЕИМУЩЕСТВА</h2>
                <div className="advantages__section">
                    <div className="advantages__section-item p-[25px]" ref={addToRefs} style={{ willChange: 'transform' }}>
                        <Image src="https://kompunity.by/wp-content/uploads/2023/08/stock.webp"
                            alt="Slide"
                            width={170}
                            height={200}
                            quality={100}
                            sizes="100vw"
                            className="pb-[25px]"
                            loading="lazy"
                        />
                        <h4 className="h4__advantages-section_responsive-font">
                            Склад
                        </h4>
                        <p className="p__advantages-section_responsive-font font-medium">
                            У нас всегда доступно к заказу более 10000 наименований товара.
                        </p>
                    </div>
                    <div className="advantages__section-item p-[25px]" ref={addToRefs} style={{ willChange: 'transform' }}>
                        <Image src="https://kompunity.by/wp-content/uploads/2023/08/delivery.webp"
                            alt="Slide"
                            width={170}
                            height={200}
                            quality={100}
                            sizes="100vw"
                            className="pb-[25px]"
                            loading="lazy"
                        />
                        <h4 className="h4__advantages-section_responsive-font">
                            Доставка
                        </h4>
                        <p className="p__advantages-section_responsive-font font-medium">
                            Доставим товар в любую точку Республики Беларусь в кратчайшие сроки!
                        </p>
                    </div>
                    <div className="advantages__section-item p-[25px]" ref={addToRefs} style={{ willChange: 'transform' }}>
                        <Image src="https://kompunity.by/wp-content/uploads/2023/08/job.webp"
                            alt="Slide"
                            width={170}
                            height={200}
                            quality={100}
                            sizes="100vw"
                            className="pb-[25px]"
                            loading="lazy"
                        />
                        <h4 className="h4__advantages-section_responsive-font">
                            Опыт работы
                        </h4>
                        <p className="p__advantages-section_responsive-font font-medium">
                            Большой опыт работы с юридическими лицами, а так же с государственными организациями.
                        </p>
                    </div>
                    <div className="advantages__section-item p-[25px]" ref={addToRefs} style={{ willChange: 'transform' }}>
                        <Image src="https://kompunity.by/wp-content/uploads/2023/08/solution.webp"
                            alt="Slide"
                            width={170}
                            height={200}
                            quality={100}
                            sizes="100vw"
                            className="pb-[25px]"
                            loading="lazy"
                        />
                        <h4 className="h4__advantages-section_responsive-font">
                            Уникальные решения
                        </h4>
                        <p className="p__advantages-section_responsive-font font-medium">
                            В нашем портфеле есть уникальные решения для организаций.
                        </p>
                    </div>
                    <div className="advantages__section-item p-[25px]" ref={addToRefs} style={{ willChange: 'transform' }}>
                        <Image src="https://kompunity.by/wp-content/uploads/2023/08/low-price.webp"
                            alt="Slide"
                            width={170}
                            height={200}
                            quality={100}
                            sizes="100vw"
                            className="pb-[25px]"
                            loading="lazy"
                        />
                        <h4 className="h4__advantages-section_responsive-font">
                            Низкие цены
                        </h4>
                        <p className="p__advantages-section_responsive-font font-medium">
                            Оптимальные цены на все оборудование.
                        </p>
                    </div>
                    <div className="advantages__section-item p-[25px]" ref={addToRefs} style={{ willChange: 'transform' }}>
                        <Image src="https://kompunity.by/wp-content/uploads/2023/08/licensing.webp"
                            alt="Slide"
                            width={170}
                            height={200}
                            quality={100}
                            sizes="100vw"
                            className="pb-[25px]"
                            loading="lazy"
                        />
                        <h4 className="h4__advantages-section_responsive-font">
                            Официальные поставки
                        </h4>
                        <p className="p__advantages-section_responsive-font font-medium">
                            Возможность закупить все необходимое оборудование для офиса у одного поставщика.
                        </p>
                    </div>
                    <div className="advantages__section-item p-[25px]" ref={addToRefs} style={{ willChange: 'transform' }}>
                        <Image src="https://kompunity.by/wp-content/uploads/2023/08/certified.webp"
                            alt="Slide"
                            width={170}
                            height={200}
                            quality={100}
                            sizes="100vw"
                            className="pb-[25px]"
                            loading="lazy"
                        />
                        <h4 className="h4__advantages-section_responsive-font">
                            Гарантия
                        </h4>
                        <p className="p__advantages-section_responsive-font font-medium">
                            На все наше оборудование предоставляется гарантия, согласно завода изготовителя.
                        </p>
                    </div>
                    <div className="advantages__section-item p-[25px]" ref={addToRefs} style={{ willChange: 'transform' }}>
                        <Image src="https://kompunity.by/wp-content/uploads/2023/08/individuality.webp"
                            alt="Slide"
                            width={170}
                            height={200}
                            quality={100}
                            sizes="100vw"
                            className="pb-[25px]"
                            loading="lazy"
                        />
                        <h4 className="h4__advantages-section_responsive-font font-medium">
                            Индивидуальный подход
                        </h4>
                        <p className="p__advantages-section_responsive-font">
                            Персональный менеджер для клиента, способный удовлетворить запросы самых требовательных клиентов.
                        </p>
                    </div>
                    <div className="advantages__section-item p-[25px]" ref={addToRefs} style={{ willChange: 'transform' , width:'100%'}}>
                        <Image src="https://kompunity.by/wp-content/uploads/2023/08/benchmarking.webp"
                            alt="Slide"
                            width={170}
                            height={200}
                            quality={100}
                            sizes="100vw"
                            className="pb-[25px]"
                            loading="lazy"
                        />
                        <h4 className="h4__advantages-section_responsive-font">
                            Продвинутая экосистема
                        </h4>
                        <p className="p__advantages-section_responsive-font font-medium">
                            Актуально, безопасно
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}