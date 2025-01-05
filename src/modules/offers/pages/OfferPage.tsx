import { Button } from "@/modules/core/components/ui/button";
import axiosInstance from "@/modules/core/lib/axios-instance";
import { useUser } from "@/modules/core/providers/userProvider";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Offer } from "types";
import OfferImagesCarousel from "../components/offer-page/OfferImagesCarousel";

const fetchOffer = async (offerId: string) => {
  const response = await axiosInstance.get<Offer>(`/offers/${offerId}`);
  return response.data;
};

function OfferPage() {
  const offerId = useParams().id;
  const { user } = useUser();
  const navigate = useNavigate();

  const { data: offer } = useQuery({
    queryKey: ["offer", offerId],
    queryFn: () => fetchOffer(offerId!),
  });

  const handleBuyNowClick = () => {
    navigate("/order", { state: { offerId } })
  }

  // console.log(offer);
  console.log("offer:", offer?.author.id);
  console.log("user:", user?.id);

  return (
    <div className="max-w-screen-xl mt-20 flex flex-col items-center m-5 md:mx-auto">
      {offer && (
        <div>
          <div className="flex flex-wrap gap-5">
            {/* Images */}
            <OfferImagesCarousel offer={offer} />

            <div>
              {/* Title */}
              <h1 className="mb-5 text-4xl font-semibold">{offer.title}</h1>

              {/* Product */}
              <p className="font-semibold">Produkt</p>
              <div className="mb-5">
                <div className="flex gap-2">
                  <p className="text-muted-foreground">Nazwa: </p>
                  <p>{offer.product.name}</p>
                </div>
                <div className="flex gap-2">
                  <p className="text-muted-foreground">Stan: </p>
                  <p>{offer.productState.name}</p>
                </div>
              </div>

              {/* Author */}
              <p className="font-semibold">Użytkownik</p>
              <div className="mb-5">
                <div className="flex gap-2">
                  <p className="text-muted-foreground">Imię i nazwisko: </p>
                  <p>
                    {offer.author.firstName} {offer.author.lastName}
                  </p>
                </div>
                <div className="flex gap-2">
                  <p className="text-muted-foreground">Email: </p>
                  <p>{offer.author.email}</p>
                </div>
              </div>

              {/* Price */}
              <div className="flex gap-2 items-center">
                <Button onClick={handleBuyNowClick} disabled={user?.id === offer.author.id}>Kup teraz</Button>
                <p className="text-xl text-primary font-bold">
                  {offer.price} zł
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="max-w-screen-lg text-justify mt-5">
            <p>{offer.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default OfferPage;
