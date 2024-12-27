import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Offer } from "types";

const fetchOffer = async (offerId: string) => {
  const response = await axiosInstance.get<Offer>(`/offers/${offerId}`);
  return response.data;
};

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
          <div className="flex flex-wrap gap-5">
            {/* Images */}
            <div>
              {offer.images.length > 0 && (
                <Carousel className="mx-14 w-full max-w-xs">
                  <CarouselContent>
                    <CarouselItem>
                      {offer.images.map((image) => (
                        <img
                          key={image.id}
                          src={`${import.meta.env.VITE_API_BASE_URL}/${
                            image.url
                          }`}
                          crossOrigin="anonymous"
                          className="w-80 h-80 object-cover rounded-lg"
                          alt={offer.product.name}
                        />
                      ))}
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:block" />
                  <CarouselNext className="hidden md:block" />
                </Carousel>
              )}
            </div>

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
                <Button>Kup teraz</Button>
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
