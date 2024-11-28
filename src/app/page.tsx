import Landing from "@/components/landing";
import { NetworkBackground } from "@/components/landing/network-background";
import Footer from "@/components/layout/footer";

const Home = () => {
  return (
    <>
      <main className="relative z-[1] overflow-hidden">
        <NetworkBackground />
        <Landing />
      </main>
      <Footer />
    </>
  );
};

export default Home;
