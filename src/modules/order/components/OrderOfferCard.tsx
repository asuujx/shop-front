import {
  Card,
  CardContent,
  CardDescription,
  CardTitle
} from "@/modules/core/components/ui/card";
import axiosInstance from "@/modules/core/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { Offer } from "types";

const fetchOffer = async (offerId: string) => {
  const response = await axiosInstance.get<Offer>(`/offers/${offerId}`);
  return response.data;
};

interface OfferCardProps {
  offerId: string;
}

function OrderOfferCard({ offerId }: OfferCardProps) {
  const { data: offer } = useQuery({
    queryKey: ["offer", offerId],
    queryFn: () => fetchOffer(offerId),
  });

  return (
    <Card>
      <CardContent className="flex gap-5">
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}/${offer?.images[0]?.url}`}
          crossOrigin="anonymous"
          className="w-32 h-32 object-cover rounded-lg"
          alt={offer?.product.name}
        />
        <div>
          <CardTitle>{offer?.title}</CardTitle>
          <CardDescription>
            {offer?.author.firstName} {offer?.author.lastName}
          </CardDescription>

          <div>
            <p className="font-semibold">Produkt</p>
            <div className="flex gap-2">
              <p className="text-muted-foreground">Nazwa: </p>
              <p>{offer?.product.name}</p>
            </div>
            <div className="flex gap-2">
              <p className="text-muted-foreground">Stan: </p>
              <p>{offer?.productState.name}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default OrderOfferCard;
