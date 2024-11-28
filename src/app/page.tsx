import Landing from "@/components/landing";
import Footer from "@/components/layout/footer";

const Home = () => {
  return (
    <>
      <main className="flex-grow overflow-hidden py-12 md:pb-0">
        <Landing />
      </main>
      <Footer />
    </>
  );
};

export default Home;
