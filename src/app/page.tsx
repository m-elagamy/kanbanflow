import Landing from "@/components/landing";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

const LandingPage = () => {
  return (
    <>
      <Header />
      <main className="relative z-[1] overflow-hidden">
        <Landing />
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
