import {
  Card,
  CardContent,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/modules/core/components/ui/sheet";
import axiosInstance from "@/modules/core/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Offer } from "types";

interface ProductOffersSheetProps {
  productId: string;
}

const fetchOffers = async (productId: string, sort: string, order: string) => {
  const response = await axiosInstance.get<Offer[]>(
    `/offers/active?filter=productId:eq:${productId}&sort=${sort}:${order}`
  );
  return response.data;
};

function ProductOffersSheet({ productId }: ProductOffersSheetProps) {
  const [sort, setSort] = useState<string>("price");
  const [order, setOrder] = useState<string>("asc");

  const { data: offers } = useQuery({
    queryKey: ["offers", { productId, sort, order }],
    queryFn: () => fetchOffers(productId, sort, order),
  });

  return (
    <Sheet>
      <SheetTrigger className="bg-primary text-primary-foreground mt-5 px-16 py-2 rounded-md">
        Oferty
      </SheetTrigger>
      <SheetContent className="px-10">
        <SheetHeader>
          <SheetTitle className="mb-5">Oferty</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-5">
          {/* Sorting */}
          <Select onValueChange={(value) => setSort(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sortuj" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Cena</SelectItem>
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

        <div className="mt-5 flex flex-col gap-5">
          {offers?.map((offer) => (
            <Link key={offer.id} to={`/offers/${offer.id}`}>
              <Card>
                <CardHeader>
                  <CardTitle>{offer.title}</CardTitle>
                  <CardDescription>
                    {offer.author.firstName} {offer.author.lastName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="flex gap-2 text-muted-foreground">
                    Stan:{" "}
                    <p className="text-foreground">{offer.productState.name}</p>
                  </span>
                  <span className="flex gap-2 text-muted-foreground">
                    Cena:{" "}
                    <p className="text-primary font-bold">{offer.price} zł</p>
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ProductOffersSheet;
