import { Card, CardContent, CardDescription, CardTitle } from "@/modules/core/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/modules/core/components/ui/carousel";
import axiosInstance from "@/modules/core/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Offer } from "types";


const fetchOffers = async () => {
  const response = await axiosInstance.get<Offer[]>(
    "/offers?filter=status:eq:active&sort=createdAt:desc"
  );
  return response.data;
};

function OffersCarousel() {
  const { data: offers } = useQuery({
    queryKey: ["offers"],
    queryFn: fetchOffers,
  });
  return (
    <Carousel>
      <CarouselContent>
        {offers?.map((offer) => (
          <CarouselItem
            key={offer.id}
            className="sm:basis-1 md:basis-1/2 xl:basis-1/3"
          >
            <div className="p-1">
              <Link to={`/offers/${offer.id}`}>
                <Card>
                  <CardContent className="flex gap-5 p-5">
                    <div>
                      {offer.images.length > 0 && (
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}/${
                            offer.images[0].url
                          }`}
                          crossOrigin="anonymous"
                          className="w-32 h-32 object-cover rounded-lg"
                          alt={offer.product.name}
                        />
                      )}
                    </div>
                    <div>
                      <CardTitle>{offer.title}</CardTitle>
                      <CardDescription className="mb-2 text-foreground">
                        {offer.author.firstName} {offer.author.lastName}
                      </CardDescription>

                      <div className="flex flex-col">
                        <span className="flex gap-2 text-muted-foreground">
                          Produkt:{" "}
                          <p className="text-foreground">
                            {offer.product.name}
                          </p>
                        </span>
                        <span className="flex gap-2 text-muted-foreground">
                          Stan:{" "}
                          <p className="text-foreground">
                            {offer.productState.name}
                          </p>
                        </span>
                        <p className="mt-5 text-primary font-bold">
                          {offer.price} zł
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default OffersCarousel;
