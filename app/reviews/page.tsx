export default function Reviews() {
  return (
    <div className="min-h-screen p-8 flex justify-center">
      {/* Контейнер с адаптивными размерами */}
      <div className="max-w-[560px] h-[800px] overflow-hidden relative">
        <iframe 
          title="Отзывы о КомпЮнити на Яндекс.Картах"
          className="w-full h-full border border-gray-200 rounded-lg box-border"
          src="https://yandex.ru/maps-reviews-widget/116356714415?comments"
          loading="lazy" // Ленивая загрузка
          allow="geolocation" // Разрешения при необходимости
        />
        <a 
          href="https://yandex.by/maps/org/kompyuniti/116356714415/" 
          target="_blank"
          rel="noopener noreferrer" // Безопасность ссылки
          className="text-xs text-gray-400 font-sans absolute bottom-2 w-full text-center block truncate px-4 box-border"
        >
          КомпЮнити на карте Минска — Яндекс Карты
        </a>
      </div>
    </div>
  );
}