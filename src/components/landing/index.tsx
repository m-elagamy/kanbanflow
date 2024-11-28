import Hero from "./hero-section";
import { Features } from "./features";
import FloatingParticles from "./floating-particles";

const Landing = () => {
  return (
    <div className="container">
      <Hero />
      <Features />
      <FloatingParticles />
    </div>
  );
};

export default Landing;
