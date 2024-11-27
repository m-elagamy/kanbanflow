import Hero from "./hero-section";
import { Features } from "./features";

const Landing = () => {
  return (
    <section>
      <div className="absolute -top-40 left-1/2 size-80 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20" />
      <div className="container relative pb-16 pt-32">
        <Hero />
        <Features />
      </div>
    </section>
  );
};

export default Landing;
