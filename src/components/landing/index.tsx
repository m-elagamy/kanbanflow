import Hero from "./hero";
import Features from "./features";
import HowItWorks from "./how-it-works";

const Landing = () => {
  return (
    <div className="container">
      <Hero />
      <Features />
      <HowItWorks />
    </div>
  );
};

export default Landing;
