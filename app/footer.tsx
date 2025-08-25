"use client"

import React, { useRef, useEffect } from 'react';

const Footer = () => {
    const gridRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const gridElement = gridRef.current;
        if (!gridElement) return;

        const observer = new IntersectionObserver(([entry]) => {
            // Проверяем видимость элемента
            if (entry.isIntersecting) {
                gridElement.style.animationPlayState = 'running';
            } else {
                gridElement.style.animationPlayState = 'paused';
            }
        }, {
            threshold: 0.01 // Срабатывает даже при 1% видимости
        });

        observer.observe(gridElement);

        return () => observer.disconnect();
    }, []);

    return (
        <footer className="relative flex w-full flex-wrap section__responsive-padding justify-between max-[550px]:flex-col overflow-hidden">
            <div className="absolute inset-0 -z-10">
                <svg
                    ref={gridRef}
                    className="moving-grid"
                    width="100%"
                    height="200%"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        animation: 'moveGrid 2s linear infinite',
                        animationPlayState: 'running' // Начальное состояние
                    }}
                >
                    <defs>
                        <pattern
                            id="smallGrid"
                            width="50"
                            height="50"
                            patternUnits="userSpaceOnUse"
                        >
                            <path
                                d="M 50 0 L 0 0 0 50"
                                fill="none"
                                stroke="rgba(100, 100, 100, 0.3)"
                                strokeWidth="1"
                            />
                        </pattern>
                    </defs>
                    <rect
                        width="100%"
                        height="100%"
                        fill="url(#smallGrid)"
                    />
                </svg>
            </div>
            <div className="container flex w-full justify-between flex-wrap">
                <div className="w-[30%] max-[900px]:hidden">
                    <h3 className="text-[36px] font-bold">KOMPUNITY</h3>
                    <h4 className="text-[22px] font-semibold">
                        ООО "KompUnity" - это динамично развивающаяся компания, созданная успешными профессионалами в сфере оптовых продаж компьютерной и офисной техники.
                    </h4>
                </div>

                <div className="w-[30%] text-center max-[900px]:w-[50%] max-[550px]:w-[100%]">
                    <h3 className="text-[40px] font-semibold">Адрес</h3>
                    <ul className="font-medium">
                        <li>
                            <a href="https://yandex.by/maps/org/kompyuniti/116356714415/?ll=27.516313%2C53.923238&z=17">
                                Сапёров 5, Минск
                            </a>
                        </li>
                    </ul>
                    <ul className="font-medium">
                        <li>
                            <a href="mailto:kompunity.by@gmail.com">
                                kompunity.by@gmail.com
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="w-[30%] text-center max-[900px]:w-[50%] max-[550px]:w-[100%]">
                    <h3 className="text-[40px] font-semibold">Контакты</h3>
                    <ul className="font-medium">
                        <div>
                            <li>А1 44 703 97 07</li>
                            <li>МТС 33 636 97 07</li>
                            <li>Гор 17 307 97 07</li>
                        </div>
                    </ul>
                </div>

                <div className="w-full text-center font-medium mt-[10px] relative z-10">
                    <span>
                        OOO “КомпЮнити” Адрес: г. Минск, 220035, ул. Сапёров, д. 5-1, пом. 204 Банковские реквизиты: р/с BY 14 PJCB 3012 0747041000000 933 (BYN) ОАО “Приорбанк” г. Минск, БИК PJCBBY2X УНП 193633364 На основании Устава
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;