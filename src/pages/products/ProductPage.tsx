import ProductOffersSheet from "@/components/products/ProductOffersSheet";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import axiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Product } from "types";

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

  return (
    <div className="max-w-screen-xl mt-20 flex flex-col items-center m-5 md:mx-auto">
      {product && (
        <div>
          <div className="flex flex-wrap gap-5">
            {/* Images */}
            <div>
              {product.images.length > 0 && (
                <Carousel className="mx-14 w-full max-w-xs">
                  <CarouselContent>
                    <CarouselItem>
                      {product.images.map((image) => (
                        <img
                          key={image.id}
                          src={`${import.meta.env.VITE_API_BASE_URL}/${
                            image.url
                          }`}
                          crossOrigin="anonymous"
                          className="w-80 h-80 object-cover rounded-lg"
                          alt={product.name}
                        />
                      ))}
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:block" />
                  <CarouselNext className="hidden md:block" />
                </Carousel>
              )}
            </div>

            <div>
              <h1 className="mb-5 text-4xl font-semibold">{product.name}</h1>

              {/* Specs */}
              <h2 className="text-xl mb-2">Specyfikacja: </h2>
              {product.attributes.map((attribute) => (
                <div key={attribute.id} className="flex gap-2">
                  <p className="text-muted-foreground">{attribute.name}:</p>
                  <p>{attribute.value}</p>
                </div>
              ))}

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
