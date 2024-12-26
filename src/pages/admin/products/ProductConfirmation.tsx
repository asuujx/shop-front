import { ProductStatus } from "@/../types";
import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import ProductConfirmationDialog from "./ProductConfirmationDialog";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  status: ProductStatus;
  categoryId: string;
  authorId: string;
  images: Image[];
  attributes: ProductAttribute[];
}

interface Image {
  id: string;
  url: string;
  order: number;
}

interface ProductAttribute {
  id: string;
  categoryAttributeId: string;
  name: string;
  value: string | null;
  options: ProductAttributeOption[];
}

interface ProductAttributeOption {
  id: string;
  value: string;
}

const getPendingProducts = async () => {
  const response = await axiosInstance.get<Product[]>(
    `/products?filter=status:eq:${ProductStatus.WAITING}`
  );
  return response.data;
};

const ProductConfirmation = () => {
  const { data: pendingProductsData, isLoading: pendingProductsIsLoading } =
    useQuery({
      queryKey: ["products", "pending"],
      queryFn: getPendingProducts,
    });

  const isReady = !pendingProductsIsLoading && pendingProductsData;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">
        Oczekujące na zatwierdzenie
      </h2>
      {!isReady && <p>Ładowanie...</p>}
      {isReady && pendingProductsData.length === 0 && (
        <p>Brak produktów do zatwierdzenia</p>
      )}

      {isReady &&
        pendingProductsData.map((product) => (
          <div className="">
            <ProductConfirmationDialog productData={product} key={product.id} />
          </div>
        ))}
    </div>
  );
};
export default ProductConfirmation;
