import HeroSection from "./components/main_page/heroSection";
import AboutSection from "./components/main_page/aboutSection";
import CategorySection from "./components/main_page/categoryProductSection";
import AdventagesSection from "./components/main_page/advantagesSection";
import PartnerSection from "./components/main_page/swipePartnersSection";
import ReactHookForm from "./components/main_page/reactHookForm";
import ReviewsSection from "./components/main_page/reviewsSection";
import MarqueeSection from "./components/main_page/marqueSection";
import MapsSection from "./components/main_page/mapsSection";

export default async function MainPage() {

    return (
      <div className="">
        *<HeroSection />
        <AboutSection/>
        {/*<CategorySection/>*/}
        <AdventagesSection/>
        {/*<PartnerSection/>*/}
        {/*<<ReactHookForm/>*/}
        <MarqueeSection/>
        <MapsSection/>
      </div>
    )
}