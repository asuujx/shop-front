import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Product } from "types";

const fetchProduct = async (productId: string) => {
  const response = await axiosInstance.get<Product>(`/products/${productId}`);
  return response.data;
};

function ProductPage() {
  const productId = useParams().id;
  const navigate = useNavigate();

  const { data: product } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId!),
  });

  return (
    <div className="max-w-screen-xl mt-20 flex flex-col items-center m-5 md:mx-auto">
      {product && (
        <div>
          <div className="flex gap-5">
            {/* Images */}
            <div>
              {product.images.length > 0 && (
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}/${
                    product.images[0].url
                  }`}
                  crossOrigin="anonymous"
                  className="w-64 h-64 object-cover rounded-lg"
                  alt={product.name}
                />
              )}
            </div>

            {/* Specs */}
            <div>
              <h1 className="mb-5 text-4xl font-semibold">{product.name}</h1>
              {/* <p>{product.description}</p> */}
              {product.attributes.map((attribute) => (
                <div key={attribute.id} className="flex gap-5">
                  <p className="text-muted-foreground">{attribute.name}:</p>
                  <p>{attribute.value}</p>
                </div>
              ))}
              <Button className="mt-5" onClick={() => navigate(`/offers?categoryId=${product.id}`)}>Oferty</Button>
            </div>
          </div>

          {/* Description */}
          <div>
            <p>{product.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
