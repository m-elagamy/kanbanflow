import Landing from "@/components/landing";
import Footer from "@/components/layout/footer";

const Home = () => {
  return (
    <>
      <main className="grid flex-grow place-content-center md:h-content">
        <Landing />
      </main>
      <Footer />
    </>
  );
};

export default Home;
