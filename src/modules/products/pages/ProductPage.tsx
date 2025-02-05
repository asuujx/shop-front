import axiosInstance from "@/modules/core/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Product } from "types";
import ProductOffersSheet from "../components/ProductOffersSheet";
import ProductAttributes from "../components/product-page/ProductAttributes";
import ProductImagesCarousel from "../components/product-page/ProductImagesCarousel";

const fetchProduct = async (productId: string) => {
  const response = await axiosInstance.get<Product>(`/products/${productId}`);
  return response.data;
};

function ProductPage() {
  const productId = useParams().id;

  const { data: product } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId!),
  });

  // console.log(product);

  return (
    <div className="max-w-screen-xl mt-20 flex flex-col items-center m-5 md:mx-auto">
      {product && (
        <div>
          <div className="flex flex-wrap gap-5">
            {/* Images */}
            <ProductImagesCarousel product={product} />

            <div>
              <h1 className="mb-5 text-4xl font-semibold">{product.name}</h1>

              {/* Specs */}
              <h2 className="text-xl font-semibold mb-2">Specyfikacja: </h2>
              <ProductAttributes product={product} />

              {/* Offers */}
              <ProductOffersSheet productId={product.id} />
            </div>
          </div>

          {/* Description */}
          <div className="max-w-screen-lg text-justify mt-5">
            <p>{product.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
