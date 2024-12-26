import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Product } from "./ProductConfirmation";
import ProductConfirmationDialogForm from "./ProductConfirmationDialogForm";

interface ProductConfirmationDialogProps {
  productData: Product;
}

const ProductConfirmationDialog = ({
  productData,
}: ProductConfirmationDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const closeDialog = () => setIsDialogOpen(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger className="block hover:underline">
        {productData.name}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Zatwierdzanie produktu</DialogTitle>
          <DialogDescription>
            Uważnie sprawdź dane produktu przed zatwierdzeniem. W przypadku
            błędów oraz braków edytuj pola. Zawsze odrzucaj potencjalne
            duplikaty produktów.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96">
          <ProductConfirmationDialogForm
            productData={productData}
            closeDialog={closeDialog}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
export default ProductConfirmationDialog;
