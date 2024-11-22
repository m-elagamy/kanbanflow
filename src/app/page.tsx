import Landing from "@/components/landing";
import Footer from "@/components/layout/footer";

const Home = () => {
  return (
    <>
      <main className="md:h-content grid flex-grow place-content-center">
        <Landing />
      </main>
      <Footer />
    </>
  );
};

export default Home;
