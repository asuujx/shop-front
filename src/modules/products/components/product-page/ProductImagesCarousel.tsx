import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/modules/core/components/ui/carousel";
import { Product } from "types";

interface ProductImagesCarouselProps {
  product: Product;
}

function ProductImagesCarousel({ product }: ProductImagesCarouselProps) {
  return (
    <div>
      {product.images.length > 0 && (
        <Carousel className="mx-14 w-full max-w-xs">
          <CarouselContent>
            {product.images.map((image) => (
              <CarouselItem key={image.id}>
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}/${image.url}`}
                  crossOrigin="anonymous"
                  className="w-80 h-80 object-cover rounded-lg"
                  alt={product.name}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      )}
    </div>
  );
}

export default ProductImagesCarousel;
