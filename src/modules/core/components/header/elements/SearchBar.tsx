import { Input } from "@/modules/core/components/ui/input";
import axiosInstance from "@/modules/core/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "types";
import { Button } from "../../ui/button";

const fetchProducts = async (search: string) => {
  const response = await axiosInstance.get<Product[]>(
    `/products/approved?filter=name:like:${search}`
  );
  return response.data;
};

function SearchBar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { data: products } = useQuery({
    queryKey: ["products", search],
    queryFn: () => fetchProducts(search),
    enabled: !!search,
  });

  const handleSearchResultClick = (productId: string) => {
    navigate(`/products/${productId}`);
    // console.log(productId);
    setSearch("");
  };

  return (
    <div
      className="relative"
      onBlur={() => setTimeout(() => setSearch(""), 200)}
    >
      <div className="flex items-center w-full space-x-2 rounded-lg border px-4 py-2">
        <SearchIcon className="h-4 w-4" />
        <Input
          type="search"
          placeholder="Wyszukaj..."
          className="w-full border-0 h-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {products && (
        <div className="absolute left-0 right-0 z-10 bg-background border rounded-lg flex flex-col gap-1">
          {products.slice(0, 5).map((product: Product) => (
            <div key={product.id} className="px-4 py-2">
              <Button
                variant="ghost"
                onClick={() => handleSearchResultClick(product.id)}
                className="w-full hover:text-primary"
              >
                {product.name}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
