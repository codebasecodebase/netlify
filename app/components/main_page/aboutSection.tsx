import '../../variables.scss';

import AnimatedTriangele from './aboutUs/AboutAnimatedI_Img_Background_Triangle';
import AnimatedArrow from './aboutUs/AboutAnimatedI_Img_Background_Arrow';

export default function AboutSection() {

    return (
        <section className="section__responsive-padding relative overflow-hidden" id="about-us">
            <AnimatedTriangele />
            <AnimatedArrow />
            <div className="container text-center relative z-10">
                <h2 className="h2__section-title_responsive-font ">О НАС</h2>
                <h3 className="h3__section-title_responsive-font font-semibold pt-[30px] pb-[30px]">Компания ООО "КомпЮнити"- это динамично развивающаяся компания, созданная успешными профессионалами в сфере оптовых продаж компьютерной и офисной техники. Наша цель - помочь нашим партнерам выбрать качественную компьютерную технику для решения всех ваших задач. Мы знаем, что важно для Вас и чего Вы ожидаете от надежного поставщика компьютерной техники и программного обеспечения:</h3>
                <ul>
                    <li className="li__section_responsive-font">- Иметь 100% уверенность, что заказ будет доставлен;</li>
                    <li className="li__section_responsive-font">- Быстрая доставка заказа в точно озвученные сроки;</li>
                    <li className="li__section_responsive-font">- Чтобы цена была выгодной и невысокой;</li>
                    <li className="li__section_responsive-font">- Чтобы техника была оригинальной со всеми соответствующими документами и сертификатами;</li>
                    <li className="li__section_responsive-font">- Официальная гарантия производителя техники;</li>
                    <li className="li__section_responsive-font">- Чтобы оборудование идеально решало ваши задачи и не было переплаты за лишний функционал;</li>
                    <li className="li__section_responsive-font">- Квалифицированный подбор оборудования специалистами компании;</li>
                    <li className="li__section_responsive-font">Мы стараемся все продумывать заранее, чтобы Вы, наши дорогие партнеры, всегда оставались довольны сделанным Вами выбором!</li>
                </ul>
            </div>
        </section>
    );
}