import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/modules/core/components/ui/card";
import ProductConfirmation from "./ProductConfirmation";

const Products = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Produkty</CardTitle>
        <CardDescription>
          Formularze umożliwiające wykonywanie operacji na produktach.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProductConfirmation />
      </CardContent>
    </Card>
  );
};
export default Products;
