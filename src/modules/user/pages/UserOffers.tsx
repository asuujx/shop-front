import { Card, CardContent, CardHeader, CardTitle } from "@/modules/core/components/ui/card";
import axiosInstance from "@/modules/core/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Offer } from "types";

const fetchUserOffers = async () => {
  const response = await axiosInstance.get<Offer[]>("/offers/user");
  return response.data;
};

function UserOffers() {
  const { data: offers } = useQuery({
    queryKey: ["userOffers"],
    queryFn: fetchUserOffers,
  });

  return (
    <div className="mt-20 max-w-screen-xl mx-auto">
      <h1 className="mb-10 text-4xl font-semibold">Moje oferty</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers?.map((offer) => (
          <Link to={`/offers/${offer.id}`} key={offer.id}>
            <Card>
              <CardHeader>
                <CardTitle>{offer.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{offer.product.name}</p>
                <p>{offer.productState.name}</p>
                <p>{offer.price} zł</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default UserOffers;
