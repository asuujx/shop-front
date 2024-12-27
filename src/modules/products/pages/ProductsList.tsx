import { Card, CardContent, CardTitle } from "@/modules/core/components/ui/card";
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
import { Product } from "types";

const fetchProducts = async (categoryId: string, sort: string, order: string) => {
  const response = await axiosInstance.get<Product[]>(
    `/products/approved?filter=categoryId:eq:${categoryId}&sort=${sort}:${order}`
  );
  return response.data;
};

const fetchCategory = async (categoryId: string) => {
  const response = await axiosInstance.get(`/categories/${categoryId}`);
  return response.data;
};

function ProductsList() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const [sort, setSort] = useState<string>("name");
  const [order, setOrder] = useState<string>("asc");

  const { data: products } = useQuery({
    queryKey: ["products", { categoryId, sort, order }],
    queryFn: () => fetchProducts(categoryId!, sort, order),
  });

  const { data: category, isFetching: isCategoryFetching } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => fetchCategory(categoryId!),
  });

  return (
    <div className="max-w-screen-xl mt-20 flex flex-col items-center m-5 md:mx-auto">
      <h1 className="mb-10 text-5xl font-semibold">
        {isCategoryFetching ? <Skeleton /> : category.name}
      </h1>

      <div className="w-full mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
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

      <div className="grid grid-cols-1 auto-rows-fr gap-5 md:grid-cols-2">
        {products?.map((product: Product) => (
          <Card key={product.id}>
            <Link to={`/products/${product.id}`}>
              <CardContent className="flex gap-5 p-5">
                <div>
                  {product.images.length > 0 && (
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/${
                        product.images[0].url
                      }`}
                      crossOrigin="anonymous"
                      className="w-32 h-32 object-cover rounded-lg"
                      alt={product.name}
                    />
                  )}
                </div>
                <div>
                  <CardTitle className="mb-2">{product.name}</CardTitle>

                  <div className="flex flex-col">
                    {product.attributes
                      .filter((attribute) => attribute.required)
                      .map((attribute) => (
                        <span key={attribute.id} className="flex gap-2">
                          <p className="text-muted-foreground">
                            {attribute.name}:
                          </p>
                          <p>{attribute.value}</p>
                        </span>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ProductsList;
