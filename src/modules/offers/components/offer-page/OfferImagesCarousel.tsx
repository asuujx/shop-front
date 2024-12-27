import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/modules/core/components/ui/carousel';
import { Offer } from 'types';

interface OfferImagesCarouselProps {
  offer: Offer;
};

function OfferImagesCarousel({ offer }: OfferImagesCarouselProps) {
  return (
    <div>
      {offer.images.length > 0 && (
        <Carousel className="mx-14 w-full max-w-xs">
          <CarouselContent>
            {offer.images.map((image) => (
              <CarouselItem key={image.id}>
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}/${image.url}`}
                  crossOrigin="anonymous"
                  className="w-80 h-80 object-cover rounded-lg"
                  alt={offer.product.name}
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

export default OfferImagesCarousel