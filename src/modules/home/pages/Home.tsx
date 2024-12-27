import OffersCarousel from "../components/OffersCarousel";

function Home() {
  return (
    <div className="mt-20 max-w-screen-xl mx-auto">
      <h1 className="mb-10 text-4xl font-semibold text-center">
        Najnowsze oferty
      </h1>
      <div className="max-w-screen-lg mx-auto">
        <OffersCarousel />
      </div>
    </div>
  );
}

export default Home;
