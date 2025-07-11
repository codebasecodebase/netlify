'use client';
import React, { useEffect, useState } from 'react';

type Review = {
  author_name: string;
  rating: number;
  text: string;
  time: string;
};

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJed7WaOrF20YRq8iA-PsXJpI&fields=reviews&key=AIzaSyCT7EaAq9AwP_UFAKn1vD260EFdMFiekvg`
        );
        const data = await response.json();
        
        if (data.result && data.result.reviews) {
          setReviews(data.result.reviews.map((review: any) => ({
            author_name: review.author_name,
            rating: review.rating,
            text: review.text,
            time: review.time
          })));
        } else {
          setError('Отзывы не найдены');
        }
      } catch (err) {
        setError('Ошибка при загрузке отзывов');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <div>Загрузка отзывов...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <section className="section__responsive-padding">
      <div className="container">
        <h2 className="h2__section-title_responsive-font text-center">ОТЗЫВЫ О НАС</h2>
        
        <div className="mt-8 space-y-6">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-2">
                <div className="text-yellow-400 text-xl">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
                <span className="ml-2 font-medium">{review.author_name}</span>
              </div>
              <p className="text-gray-600 mb-2">{review.text}</p>
              <p className="text-sm text-gray-400">
                {new Date(review.time).toLocaleDateString('ru-RU')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}