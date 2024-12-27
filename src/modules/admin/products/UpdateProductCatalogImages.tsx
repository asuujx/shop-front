import { Button } from "@/modules/core/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/core/components/ui/dialog";

const UpdateProductCatalogImages = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edycja katalogowych obrazów</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edycja katalogowych obrazów</DialogTitle>
          <DialogDescription>
            Ten formularz pozwala na edycję katalogowych obrazów produktów.
            Katalogowy obraz produktu jest obrazem, który nie jest powiązany z
            żadną konkretną ofertą.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default UpdateProductCatalogImages;
