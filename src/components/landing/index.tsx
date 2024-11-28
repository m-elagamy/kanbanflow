import Hero from "./hero-section";
import { Features } from "./features";
import FloatingParticles from "./floating-particles";

const Landing = () => {
  return (
    <section>
      <div className="container relative pb-16 pt-32">
        <Hero />
        <Features />
      </div>
      <FloatingParticles />
    </section>
  );
};

export default Landing;
