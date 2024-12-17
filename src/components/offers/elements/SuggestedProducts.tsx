import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Product } from "types";

interface SuggestedProductsProps {
  query: string;
  categoryId: string | null;
  selectedProduct: Product | null;
  handleChangeSelectedProduct: (product: Product | null) => void;
  handleAutoFillClick: (product: Product) => void;
}

const fetchProducts = async (query: string, categoryId: string) => {
  const response = await axiosInstance.get(
    `/products/suggestions?productName=${query}&categoryId=${categoryId}`
  );
  return response.data;
};

function SuggestedProducts({ query, categoryId, selectedProduct, handleChangeSelectedProduct, handleAutoFillClick }: SuggestedProductsProps) {
  const { data: products, refetch: refetchProducts } = useQuery<Product[]>({
    queryKey: ["products", "suggested"],
    queryFn: () => fetchProducts(query, categoryId!),
    enabled: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
  });

  const handleValueChange = (value: string) => {
    if (value === "null") {
      handleChangeSelectedProduct(null)
    } else {
      const product = products!.find((product) => product.id === value);
      handleChangeSelectedProduct(product || null);
    }
  };

  useEffect(() => {
    if (query.length >= 3 && categoryId && !selectedProduct) {
      refetchProducts();
    }
  }, [query, selectedProduct, categoryId]);

  return (
    <RadioGroup value={selectedProduct?.id || "null"} onValueChange={handleValueChange}>
      {products?.map((product) => (
        <div
          className="flex items-center gap-2 border rounded-lg px-2 py-4"
          key={product.id}
        >
          <RadioGroupItem value={product.id} id={product.id} />
          <Label htmlFor={product.id} className="grow">
            {product.name}
          </Label>
          <Button type="button" variant="secondary" onClick={() => handleAutoFillClick(product)}>
            Autouzupełnij
          </Button>
        </div>
      ))}
      <div className="flex gap-2 items-center border px-2 py-4 rounded-lg">
        <RadioGroupItem value="null" id="null" />
        <Label htmlFor="null">
          Żaden z powyższych
        </Label>
      </div>
    </RadioGroup>
  );
}

export default SuggestedProducts;
