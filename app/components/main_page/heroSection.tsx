'use client';
import React, { useState, useEffect } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import BlobsButton from './heroSection/blobsButton';
import WavyText from './heroSection/waryText';
import PulseRings from './heroSection/pulseRings';
import NextSection from './heroSection/nextSection';

export default function HeroSection() {

    return (
        <section className="relative w-full h-[650px] overflow-hidden">
            <Image src="/laptop.avif"
                alt="Slide 1"
                fill
                priority={true}	
                quality={100}
                sizes="100vw"
                className="object-cover w-full h-full"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white flex flex-col items-center justify-center">
            <h1 className="h1__slider-title_responsive-font  text-7xl font-bold mb-6 text-center whitespace-nowrap" style={{ textShadow: 'rgba(0, 0, 0, 0.49) 2px 2px 5px' }}>СИСТЕМЫ ВИДЕОНАБЛЮДЕНИЯ</h1>
                <h2 className="h2__slider-title_responsive-font text-7xl mb-14 text-center" 
                    style={{ textShadow: 'rgba(0, 0, 0, 0.49) 2px 2px 5px' }}>
                    {/*<WavyText text="Компьютерная и офисная техника" delay={2} />*/}
                </h2>
                <div className="relative">
                    <BlobsButton text="Запросить Прайс Лист Или Получить Консультацию" />
                    <PulseRings/>
                </div>
            </div>
            {/*<NextSection/>*/}
        </section>
    );
}
