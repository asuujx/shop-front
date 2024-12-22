import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Offer } from "types";

const fetchOffer = async (offerId: string) => {
  const response = await axiosInstance.get<Offer>(`/offers/${offerId}`);
  return response.data;
}

function OfferPage() {
  const offerId = useParams().id;

  const { data: offer } = useQuery({
    queryKey: ["offer", offerId],
    queryFn: () => fetchOffer(offerId!),
  });

  return (
    <div className="max-w-screen-xl mt-20 flex flex-col items-center m-5 md:mx-auto">
      {offer && (
        <div>
          <div className="flex gap-5">
            {/* Images */}
            <div>
              {offer.images.length > 0 && (
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}/${
                    offer.images[0].url
                  }`}
                  crossOrigin="anonymous"
                  className="w-64 h-64 object-cover rounded-lg"
                  alt={offer.title}
                />
              )}
            </div>

            {/* Specs */}
            <div>
              <h1 className="mb-5 text-4xl font-semibold">{offer.title}</h1>
              {/* <p>{offer.description}</p> */}
              {/* {offer.attributes.map((attribute) => (
                <div key={attribute.id} className="flex gap-5">
                  <p className="text-muted-foreground">{attribute.name}:</p>
                  <p>{attribute.value}</p>
                </div>
              ))} */}
              <Button>Kup teraz</Button>
            </div>
          </div>

          {/* Description */}
          <div>
            <p>{offer.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default OfferPage