import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/core/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/core/components/ui/select";
import { Skeleton } from "@/modules/core/components/ui/skeleton";
import axiosInstance from "@/modules/core/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Offer } from "types";

const fetchOffers = async (productId: string, sort: string, order: string) => {
  const response = await axiosInstance.get<Offer[]>(
    `/offers?filter=productId:eq:${productId}&sort=${sort}:${order}`
  );
  return response.data;
};

const fetchProduct = async (productId: string) => {
  const response = await axiosInstance.get(`/products/${productId}`);
  return response.data;
};

function OffersList() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");

  const [sort, setSort] = useState<string>("price");
  const [order, setOrder] = useState<string>("asc");

  const { data: offers } = useQuery({
    queryKey: ["offers", { productId, sort, order }],
    queryFn: () => fetchOffers(productId!, sort, order),
  });

  const { data: product, isFetching: isProductFetching } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId!),
  });

  // console.log(offers);

  return (
    <div className="max-w-screen-xl mt-20 flex flex-col items-center m-5 md:mx-auto">
      <h1 className="mb-10 text-5xl font-semibold">
        {isProductFetching ? <Skeleton /> : product.name}
      </h1>
      <div className="w-full mb-10 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Sorting */}
        <Select onValueChange={(value) => setSort(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sortuj" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nazwa</SelectItem>
            <SelectItem value="createdAt">Data dodania</SelectItem>
            <SelectItem value="updatedAt">Data modyfikacji</SelectItem>
          </SelectContent>
        </Select>

        {/* Order */}
        <Select onValueChange={(value) => setOrder(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Kolejność" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Rosnąco</SelectItem>
            <SelectItem value="desc">Malejąco</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {offers &&
          offers.map((offer: Offer) => (
            <Link to={`/offers/${offer.id}`} key={offer.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{offer.title}</CardTitle>
                  <CardDescription>
                    {offer.author.firstName} {offer.author.lastName}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
}
export default OffersList;
