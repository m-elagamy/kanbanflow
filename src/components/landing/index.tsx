import Hero from "./hero";
import Features from "./features";
import HowItWorks from "./how-it-works";
import FAQ from "./faq";
import Cta from "./cta";

const Landing = () => {
  return (
    <div className="container">
      <Hero />
      <div className="border-border/40 my-16 border-t" />
      <Features />
      <div className="border-border/40 my-16 border-t" />
      <HowItWorks />
      <div className="border-border/40 my-16 border-t" />
      <FAQ />
      <div className="border-border/40 my-16 border-t" />
      <Cta />
    </div>
  );
};

export default Landing;
