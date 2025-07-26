'use client';
import React, { useEffect, useState, useRef } from 'react';
import ParticlesEffect from './partnerSection/ParticlesEffect';
import PartnersSlider from './partnerSection/PartnersSlider';

export default function PartnerSection() {
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.5 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      className="embla section__responsive-padding text-center relative overflow-hidden" 
      ref={sectionRef} 
      style={{ background: '#f9f9f9' }}
    >
      <ParticlesEffect isActive={isInView} />
      <h2 className="h2__section-title_responsive-font z-2">НАШИ ПАРТНЕРЫ</h2>
      <PartnersSlider />
    </section>
  );
}