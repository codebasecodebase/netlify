import React from 'react';
import { YMaps, Map, Placemark } from '@iminside/react-yandex-maps';

export default function MapsSection() {
  const defaultState = {
    center: [55.751574, 37.573856],
    zoom: 5,
  };
  
  return (
    <section>
      <div className="mt-8 " style={{ width: '100%', height: '400px' }}>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2349.4763703814933!2d27.513646977015412!3d53.92328023139926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbc5ea68d6de79%3A0x922617fbf880c8ab!2z0J7QntCeINCa0L7QvNC_0K7QvdC40YLQuA!5e0!3m2!1sru!2snl!4v1747857200781!5m2!1sru!2snl" 
          width="100%"
          height="400px"
          style={{ border: '0' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}