import Hero from "./hero";
import Features from "./features";
import HowItWorks from "./how-it-works";
import FAQ from "./faq";
import Cta from "./cta";

const Landing = () => {
  return (
    <div className="container">
      <Hero />
      <Features />
      <HowItWorks />
      <FAQ />
      <Cta />
    </div>
  );
};

export default Landing;
