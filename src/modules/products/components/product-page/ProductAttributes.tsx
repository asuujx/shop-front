import { Badge } from '@/modules/core/components/ui/badge';
import { Product } from 'types';

interface ProductAttributesProps {
  product: Product;
};

function ProductAttributes({ product }: ProductAttributesProps) {
  return (
    <div>
      {product.attributes.map((attribute) => (
        <div key={attribute.id} className="flex gap-2">
          <p className="text-muted-foreground">{attribute.name}:</p>
          {attribute.name === "Funkcje" ? (
            attribute.options.length > 0 ? (
              attribute.options.map((option) => (
                <Badge key={option.id}>{option.value}</Badge>
              ))
            ) : (
              <Badge>{attribute.value}</Badge>
            )
          ) : attribute.options.length > 0 ? (
            attribute.options.map((option) => (
              <p key={option.id}>{option.value}</p>
            ))
          ) : (
            <p>{attribute.value}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProductAttributes