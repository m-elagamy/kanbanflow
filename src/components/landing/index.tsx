import Hero from "./hero";
import Features from "./features";
import HowItWorks from "./how-it-works";
import Cta from "./cta";

const Landing = () => {
  return (
    <div className="container">
      <Hero />
      <Features />
      <HowItWorks />
      <Cta />
    </div>
  );
};

export default Landing;
